import { Spin } from 'antd';
import { formatCurrency } from '../utils/formatting';
import { BarChartData } from '../services/chart/bar';
import React, { useContext } from 'react';
import { PropsContext } from '../../pages/_app';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js/auto';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({
  data,
  isloading,
}: {
  data: BarChartData | undefined;
  isloading: boolean;
}): JSX.Element {
  const { userSettings } = useContext(PropsContext);
  function getYAxisMaxValue() {
    let result = data?.datasets.reduce((acc: number[], curr) => {
      curr.data.forEach((num, i) => {
        acc[i] = (acc[i] || 0) + num;
      });
      return acc;
    }, []);
    result = result?.map((num: number) => Math.ceil((num * 1.1) / 10) * 10);
    if (!result) return 10;
    return Math.max(...result, 10);
  }

  const stackedOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let index = context.dataIndex;
            let label = context.dataset.label;
            let value = context.dataset.data[index];
            if (typeof value === 'number' || value == null) {
              label += ': ';
              label += formatCurrency({
                value,
                currency: userSettings?.data.currency,
              });
            } else {
              label += ': ';
              label += formatCurrency({
                value: value[0],
                currency: userSettings?.data.currency,
              });
              label += ' - ';
              label += formatCurrency({
                value: value[1],
                currency: userSettings?.data.currency,
              });
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: 'rgb(120 113 108)',
        },
      },
      y: {
        grid: {
          color: 'rgb(120 113 108)',
        },
        stacked: true,
        max: getYAxisMaxValue(),
        ticks: {
          callback: function (tickValue) {
            tickValue = +tickValue;
            if (Math.floor(tickValue) === tickValue) {
              return formatCurrency({
                value: tickValue,
                maximumFractionDigits: 0,
                currency: userSettings?.data.currency,
              });
            }
          },
        },
      },
    },
  };

  if (isloading || !data)
    return (
      <div className="h-[500px]">
        <Spin spinning={isloading}>
          <Bar
            height={500}
            data={{
              labels: [],
              datasets: [
                {
                  label: '',
                  data: [],
                  backgroundColor: '#f0f0f0',
                },
              ],
            }}
            options={stackedOptions}
          />
        </Spin>
      </div>
    );

  return (
    <Spin spinning={isloading}>
      <Bar height={500} data={data} options={stackedOptions} />
    </Spin>
  );
}
