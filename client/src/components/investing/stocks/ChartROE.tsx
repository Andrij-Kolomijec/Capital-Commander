import classes from "./ChartROE.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type ChartROEProps = {
  ROE: { [date: string]: string }[];
};

export default function ChartROE({ ROE }: ChartROEProps) {
  if (!ROE) {
    return <p className={classes.error}>Graph data unavailable.</p>;
  }

  const options = {};
  const chartData = {
    labels: ROE.map((i) => Object.keys(i)[0]).reverse(),
    datasets: [
      {
        label: "Return on Equity",
        data: ROE.map((i) => Object.values(i)[0].replace("%", "")).reverse(),
        borderColor: "#2c0072",
        backgroundColor: "#2c0072",
      },
    ],
  };

  return (
    <div className={classes.chart}>
      <Line options={options} data={chartData} />
    </div>
  );
}
