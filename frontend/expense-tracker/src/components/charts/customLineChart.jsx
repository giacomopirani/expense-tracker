import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomLineChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-stone-300">
          <p className="text-xs font-semibold text-stone-800 mb-1">
            {payload[0].payload.category}
          </p>
          <p className="text-sm text-stone-600">
            Amount:{" "}
            <span className="text-sm font-bold text-stone-900">
              € {payload[0].payload.amount}
            </span>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg p-2">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#44403c" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#44403c" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="#44403c"
            fill="url(#expenseGradient)"
            strokeWidth={3}
            dot={{ r: 5, fill: "#44403c" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
