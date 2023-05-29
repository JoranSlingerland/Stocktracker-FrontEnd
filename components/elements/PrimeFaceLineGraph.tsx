import { Spin } from 'antd';
import { Chart } from 'primereact/chart';
import { formatCurrency } from '../utils/formatting';
import { UserSettings } from '../services/user/get';
import { LineChartData } from '../services/chart/line';

export default function BasicLineGraph({
  isloading,
  data,
  userSettings,
}: {
  isloading: boolean;
  data: LineChartData | undefined;
  userSettings: UserSettings;
}): JSX.Element {
  const totalDuration = 500;
  let delayBetweenPoints = 0;
  if (data && data['labels']) {
    delayBetweenPoints = totalDuration / data['labels'].length;
  }

  const previousY = (ctx: any) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(['y'], true).y;

  const animation = {
    x: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
      from: NaN,
      delay(ctx: any) {
        if (ctx.type !== 'data' || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
    y: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
      from: previousY,
      delay(ctx: any) {
        if (ctx.type !== 'data' || ctx.yStarted) {
          return 0;
        }
        ctx.yStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
  };

  let multiAxisOptions = {
    animation,
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
            dataIndex: number;
            dataset: { label: string; data: { [x: string]: string | number } };
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
        max: function (context: any) {
          let max = 10;
          let customMax = false;
          for (let i = 0; i < context.chart.data.datasets.length; i++) {
            for (let j = 0; j < context.chart.data.datasets[i].data.length; j++)
              if (context.chart.data.datasets[i].data[j] > max) {
                max = context.chart.data.datasets[i].data[j] * 1.1;
                customMax = true;
              }
          }
          if (customMax) {
            return max;
          } else {
            return 10;
          }
        },
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

  if (isloading || data == undefined || data['datasets'].length == 0) {
    return (
      <div className="h-[500px]">
        <Spin spinning={isloading}>
          <Chart type="line" data={{}} options={multiAxisOptions} />
        </Spin>
      </div>
    );
  }
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
      <Chart type="line" data={multiAxisData} options={multiAxisOptions} />
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
        <Chart type="line" data={multiAxisData} options={multiAxisOptions} />
      </div>
    );
  }
  // return empty if no conditions are met
  return (
    <div className="h-[500px]">
      <Chart type="line" data={{}} options={multiAxisOptions} />
    </div>
  );
}
