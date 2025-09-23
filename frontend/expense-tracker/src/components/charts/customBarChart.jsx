import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomBarChart = ({ data }) => {
  // Validazione dei dati
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white mt-6 h-80 flex items-center justify-center border border-gray-200 rounded-lg">
        <p className="text-gray-500">Nessun dato da visualizzare</p>
      </div>
    );
  }

  // Colori moderni e attraenti
  const getBarColor = (index, isHovered = false) => {
    const colors = [
      "#3b82f6", // Blue
      "#ef4444", // Red
      "#10b981", // Green
      "#f59e0b", // Yellow
      "#8b5cf6", // Purple
      "#06b6d4", // Cyan
      "#f97316", // Orange
      "#84cc16", // Lime
    ];

    if (isHovered) {
      return colors[index % colors.length] + "dd"; // Slightly transparent on hover
    }

    return colors[index % colors.length];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200 min-w-32">
          <p className="text-sm font-semibold text-gray-800 mb-2 capitalize">
            {payload[0].payload.category || label}
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: payload[0].color }}
            />
            <span className="text-sm text-gray-600">€</span>
            <span className="text-lg font-bold text-gray-900">
              {payload[0].value.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6 p-4 rounded-lg border border-gray-100 shadow-sm">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barCategoryGap="20%"
        >
          {/* Griglia più sottile e elegante */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />

          <XAxis
            dataKey="category"
            tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
            stroke="#e2e8f0"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            stroke="#e2e8f0"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `€${value}`}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
          />

          <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
