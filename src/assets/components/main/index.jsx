import { Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../../context";
import ExpenseView from "../expense-view";
import Summary from "../summary";

export default function Main() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    allTransactions,
    totalExpense,
    setTotalExpense,
    totalIncome,
    setTotalIncome,
  } = useContext(GlobalContext);

  useEffect(() => {
    let income = 0;
    let expense = 0;

    allTransactions.forEach((item) => {
      item.type === "income"
        ? (income = income + parseFloat(item.amount))
        : (expense = expense + parseFloat(item.amount));
    });

    setTotalExpense(expense);
    setTotalIncome(income);
  }, [allTransactions]);

  return (
    <Flex textAlign={"center"} flexDirection={"column"} pr={"5"} pl={"5"}>
      <Flex alignItems={"center"} justifyContent={"space-between"} mt={"12"}>
        <Heading
          color={"blue.400"}
          display={["none", "block", "block", "block", "block"]}
          fontWeight={"extrabold"}
        >
          Expense Tracker
        </Heading>
        <Flex alignItems={"center"}>
          <Button
            onClick={onOpen}
            bg={"blue.400"}
            color={"white"}
            ml={"4"}
            _hover={{
              bg: "blue.600",
              transform: "scale(1.05)",
              transition: "all 0.2s ease-in-out",
            }}
          >
            Add New Transaction
          </Button>
        </Flex>
      </Flex>
      <Summary
        totalExpense={totalExpense}
        totalIncome={totalIncome}
        isOpen={isOpen}
        onClose={onClose}
      />

      <Flex
        w="full"
        alignItems={"flex-start"}
        justifyContent={"space-evenly"}
        flexDirection={["column", "column", "column", "row", "row"]}
      >
        <ExpenseView
          data={allTransactions.filter((item) => item.type === "expense")}
          type={"expense"}
        />
        <ExpenseView
          data={allTransactions.filter((item) => item.type === "income")}
          type={"income"}
        />
      </Flex>
    </Flex>
  );
}
