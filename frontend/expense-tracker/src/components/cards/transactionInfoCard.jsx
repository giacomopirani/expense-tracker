import { GiMoneyStack } from "react-icons/gi";
import { LuTrash2, LuTrendingDown, LuTrendingUp } from "react-icons/lu";

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  const getAmountStyles = () =>
    type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

  return (
    <div className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 mt-2 p-3 rounded-lg hover:bg-stone-200/50">
      <div className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-full text-stone-800">
        {icon ? (
          <img src={icon} alt={title} className="w-6 h-6" />
        ) : (
          <GiMoneyStack className="w-10 h-10" />
        )}
      </div>

      <div>
        <p className="text-sm text-stone-700 font-medium">{title}</p>
        <p className="text-xs text-stone-400 mt-1">{date}</p>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
        >
          <h6 className="text-xs font-medium">
            {type === "income" ? "+" : "-"} €{amount}
          </h6>
          {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
        </div>

        {!hideDeleteBtn && (
          <button
            className="
        text-stone-400 hover:text-red-500
        opacity-100 md:opacity-0 md:group-hover:opacity-100
        transition-opacity cursor-pointer
      "
            onClick={onDelete}
          >
            <LuTrash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionInfoCard;
