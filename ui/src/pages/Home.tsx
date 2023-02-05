import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Link } from 'react-router-dom';
import { trpc } from '../util/trpc.js';
import { Button } from '../components/Button/Button.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ChartDataLabels
);

ChartJS.defaults.set('plugins.datalabels', {
  color: 'white',
  align: 'end',
  anchor: 'end',
  offset: -42,
  font: {
    weight: 'bold',
    size: 14,
  },
});

ChartJS.defaults.color = 'white';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.02)';

export const Home = () => {
  const { isLoading, data } = trpc.uniqueComponents.useQuery({ limit: 5 });

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="my-16 max-h-96">
        <div className="flex items-end justify-between">
          <h2>Component Instances found in Projects</h2>

          <Link to="/components">
            <Button color="secondary">Show All</Button>
          </Link>
        </div>

        <Bar
          options={{
            indexAxis: 'y' as const,
            elements: {
              bar: {
                borderWidth: 2,
                borderRadius: 3,
                borderColor: 'rgba(127, 90, 240, 1)',
                backgroundColor: 'rgba(127, 90, 240, 0.2)',
              },
            },
            maintainAspectRatio: false,
            responsive: true,
          }}
          data={{
            labels: data.map((component) => component.name),
            datasets: [
              {
                barPercentage: 0.8,
                categoryPercentage: 0.8,
                data: data.map((component) => component.count),
              },
            ],
          }}
        />
      </div>
    </div>
  );
};
