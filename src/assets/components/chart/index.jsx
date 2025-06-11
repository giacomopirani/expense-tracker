import Chart from "react-apexcharts";

export default function TransactionChartSummary() {
  const options = {
    labels: ["Expense", "Income"],
    colors: ["#FD5E53", "#213ebf"],
    chart: {
      width: "50px",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: ["#FD5E53", "#213ebf"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: undefined,
        backgoundColor: "#000000",
      },
    },
  };

  return <Chart options={options} />;
}
