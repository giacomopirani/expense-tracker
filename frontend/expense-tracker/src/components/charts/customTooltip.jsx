const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-stone-300">
        <p className="text-xs font-semibold text-yellow-700">
          {payload[0].name}
        </p>
        <p className="text-sm text-stone-600">
          Amount:{" "}
          <span className="text-sm font-bold text-stone-800">
            €{payload[0].value}
          </span>
        </p>
      </div>
    );
  }
};

export default CustomTooltip;
