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
  // DEBUG: Stampa i dati per capire la struttura
  console.log("=== CHART DATA DEBUG ===");
  console.log("Raw data:", data);
  console.log("Data type:", typeof data);
  console.log("Is array:", Array.isArray(data));
  console.log("Data length:", data?.length);
  if (data?.length > 0) {
    console.log("First item:", data[0]);
    console.log("First item keys:", Object.keys(data[0]));
  }

  // Validazione e trasformazione dati
  let chartData = [];

  if (!data) {
    console.log("No data provided");
    return (
      <div className="bg-white mt-6 p-4 text-center">
        Nessun dato disponibile
      </div>
    );
  }

  // Se data non è un array, prova a convertirlo
  if (!Array.isArray(data)) {
    console.log("Data is not array, trying to convert...");
    if (data.transactions && Array.isArray(data.transactions)) {
      chartData = data.transactions;
    } else {
      chartData = [data]; // Converte oggetto singolo in array
    }
  } else {
    chartData = data;
  }

  // Se ancora non abbiamo dati validi
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white mt-6 p-4 text-center">
        Nessun dato da visualizzare
      </div>
    );
  }

  // function to alternate colors
  const getBarColor = (index) => {
    return index % 2 === 0 ? "#44403c" : "#57534e";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-stone-300">
          <p className="text-xs font-semibold text-stone-800 mb-1">
            {data.category || data.month || data.name || "Categoria"}
          </p>
          <p className="text-sm text-gray-600">
            Amount:{" "}
            <span className="text-sm font-medium text-stone-800 ">
              € {data.amount || data.value || 0}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Determina la chiave per l'asse X
  const xAxisKey = chartData[0]?.category
    ? "category"
    : chartData[0]?.month
    ? "month"
    : chartData[0]?.name
    ? "name"
    : "category";

  // Determina la chiave per l'altezza delle barre
  const yAxisKey = chartData[0]?.amount
    ? "amount"
    : chartData[0]?.value
    ? "value"
    : "amount";

  console.log("Using X-axis key:", xAxisKey);
  console.log("Using Y-axis key:", yAxisKey);

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="#ddd"
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="#ddd"
            axisLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey={yAxisKey} fill="#875cf5" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
