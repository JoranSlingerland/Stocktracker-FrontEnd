import { Spin } from 'antd';
import { Chart } from 'primereact/chart';
import { formatCurrency } from '../utils/formatting';
import { UserSettings_Type } from '../utils/types';

export default function BasicLineGraph({
  isloading,
  data,
  userSettings,
}: {
  isloading: boolean;
  data: any;
  userSettings: UserSettings_Type;
}): JSX.Element {
  let multiAxisOptions = {
    stacked: false,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: {
            dataIndex: any;
            dataset: { label: any; data: { [x: string]: string | number } };
          }) {
            let index = context.dataIndex;
            let label = context.dataset.label;
            label += ': ';
            label += formatCurrency({
              value: context.dataset.data[index],
              currency: userSettings.currency,
            });
            return label;
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
        },
        grid: {
          color: 'rgb(120 113 108)',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          callback: function (value: number) {
            if (Math.floor(value) === value) {
              return formatCurrency({
                value: value,
                maximumFractionDigits: 0,
                currency: userSettings.currency,
              });
            }
          },
        },
        grid: {
          color: 'rgb(120 113 108)',
        },
      },
    },
  };

  if (data['datasets'].length == 1) {
    let multiAxisData = {
      labels: data['labels'],
      datasets: [
        {
          label: data['datasets'][0]['label'],
          fill: false,
          borderColor: '#0e8505',
          yAxisID: 'y',
          tension: 0.4,
          data: data['datasets'][0]['data'],
        },
      ],
    };
    return (
      <Spin spinning={isloading}>
        <Chart type="line" data={multiAxisData} options={multiAxisOptions} />
      </Spin>
    );
  }
  if (data['datasets'].length == 2) {
    let multiAxisData = {
      labels: data['labels'],
      datasets: [
        {
          label: data['datasets'][0]['label'],
          fill: false,
          borderColor: '#0e8505',
          yAxisID: 'y',
          tension: 0.4,
          data: data['datasets'][0]['data'],
        },
        {
          label: data['datasets'][1]['label'],
          fill: false,
          borderColor: userSettings.dark_mode ? '#d6d3d1' : '#000000',
          yAxisID: 'y',
          tension: 0.4,
          data: data['datasets'][1]['data'],
        },
      ],
    };

    return (
      <div className="h-[500px]">
        <Spin spinning={isloading}>
          <Chart type="line" data={multiAxisData} options={multiAxisOptions} />
        </Spin>
      </div>
    );
  }
  // return empty chart if no data
  return (
    <div className="h-[500px]">
      <Spin spinning={isloading}>
        <Chart type="line" data={{}} options={multiAxisOptions} />
      </Spin>
    </div>
  );
}
