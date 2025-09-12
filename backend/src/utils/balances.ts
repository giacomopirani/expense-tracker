type Expense = {
  payerId: string;
  totalCents: number;
  participants: string[]; // userIds
  splits?: { userId: string; amountCents: number }[]; // optional
};

export type NetBalance = { userId: string; netCents: number };
export type SimplifiedTx = { from: string; to: string; amountCents: number };

export function computeNetBalances(expenses: Expense[]): NetBalance[] {
  const map = new Map<string, number>(); // userId -> cents

  const add = (userId: string, cents: number) => {
    map.set(userId, (map.get(userId) || 0) + cents);
  };

  for (const e of expenses) {
    // payer paid total
    add(e.payerId, e.totalCents);

    // determine per-user owed amounts
    if (e.splits && e.splits.length) {
      // custom splits
      for (const s of e.splits) {
        add(s.userId, -s.amountCents);
      }
    } else {
      // equal split among participants (including payer if in participants)
      const n = e.participants.length;
      if (n === 0) continue;
      const base = Math.floor(e.totalCents / n);
      let remainder = e.totalCents - base * n;

      for (const userId of e.participants) {
        let share = base;
        if (remainder > 0) {
          share += 1;
          remainder -= 1;
        }
        add(userId, -share);
      }
    }
  }

  return Array.from(map.entries()).map(([userId, netCents]) => ({
    userId,
    netCents,
  }));
}

export function simplifyDebts(balances: NetBalance[]): SimplifiedTx[] {
  // creditors: net > 0, debtors: net < 0
  const creditors = balances
    .filter((b) => b.netCents > 0)
    .map((b) => ({ ...b }));
  const debtors = balances.filter((b) => b.netCents < 0).map((b) => ({ ...b }));

  creditors.sort((a, b) => b.netCents - a.netCents);
  debtors.sort((a, b) => a.netCents - b.netCents); // most negative first

  const txs: SimplifiedTx[] = [];
  let i = 0,
    j = 0;

  while (i < creditors.length && j < debtors.length) {
    const credit = creditors[i];
    const debt = debtors[j];
    const amount = Math.min(credit.netCents, -debt.netCents);

    txs.push({ from: debt.userId, to: credit.userId, amountCents: amount });

    credit.netCents -= amount;
    debt.netCents += amount;

    if (credit.netCents === 0) i++;
    if (debt.netCents === 0) j++;
  }

  return txs;
}
