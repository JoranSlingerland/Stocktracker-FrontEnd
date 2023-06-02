import { Chart } from 'primereact/chart';
import { Spin } from 'antd';
import { formatCurrency } from '../utils/formatting';
import { BarChartData } from '../services/chart/bar';

export default function PrimeFacePieChart({
  data,
  isloading,
  currency,
}: {
  data: BarChartData | undefined;
  isloading: boolean;
  currency: string;
}): JSX.Element {
  const stackedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let index = context.dataIndex;
            let label = context.dataset.label;
            label += ': ';
            label += formatCurrency({
              value: context.dataset.data[index],
              currency,
            });
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
        max: function (context: any) {
          let result = context.chart.data.datasets.reduce(
            (acc: number[], curr: any) => {
              curr.data.forEach((num: number, i: number) => {
                acc[i] = (acc[i] || 0) + num;
              });
              return acc;
            },
            []
          );
          result = result.map(
            (num: number) => Math.ceil((num * 1.1) / 10) * 10
          );

          return Math.max(...result, 10);
        },
        ticks: {
          callback: function (value: number) {
            if (Math.floor(value) === value) {
              return formatCurrency({
                value: value,
                maximumFractionDigits: 0,
                currency,
              });
            }
          },
        },
      },
    },
  };

  if (isloading)
    return (
      <div className="h-[500px]">
        <Spin spinning={isloading}>
          <Chart type="bar" data={{}} options={stackedOptions} />
        </Spin>
      </div>
    );

  return (
    <div className="h-[500px]">
      <Spin spinning={isloading}>
        <Chart type="bar" data={data} options={stackedOptions} />
      </Spin>
    </div>
  );
}
