import { Spin } from 'antd';
import { formatCurrency } from '../utils/formatting';
import { UserSettings } from '../services/user/get';
import { LineChartData } from '../services/chart/line';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js/auto';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface ChartOptionsWithAnimation extends ChartOptions<'line'> {
  animation: any;
}

interface ChartData {
  labels: string[] | undefined;
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }[];
}

export default function LineGraph({
  isLoading,
  data,
  userSettings,
}: {
  isLoading: boolean;
  data: LineChartData | undefined;
  userSettings: UserSettings;
}): JSX.Element {
  const totalDuration = 500;
  let delayBetweenPoints = 0;
  if (data && data['labels']) {
    delayBetweenPoints = totalDuration / data['labels'].length;
  }

  const chartData: ChartData = {
    labels: data?.labels,
    datasets: [],
  };

  if (data?.datasets.length === 1) {
    chartData.datasets = [
      {
        label: data?.datasets[0].label,
        data: data?.datasets[0].data,
        fill: false,
        borderColor: '#0e8505',
        tension: 0.1,
      },
    ];
  } else if (data?.datasets.length === 2) {
    chartData.datasets = [
      {
        label: data?.datasets[0].label,
        data: data?.datasets[0].data,
        fill: false,
        borderColor: '#0e8505',
        tension: 0.1,
      },
      {
        label: data?.datasets[1].label,
        data: data?.datasets[1].data,
        fill: false,
        borderColor: userSettings.dark_mode ? '#d6d3d1' : '#000000',
        tension: 0.1,
      },
    ];
  }

  function getYAxisMaxValue() {
    let maxValues = data?.datasets.map((dataset) => {
      return Math.max(...dataset.data);
    });
    if (!maxValues) return 10;
    let result = Math.max(...maxValues) * 1.1;
    let digits = Math.floor(Math.log10(result));
    return Math.ceil(result / 10 ** (digits - 1)) * 10 ** (digits - 1);
  }

  const previousY = (ctx: any) => {
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(['y'], true).y;
  };

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

  let options: ChartOptionsWithAnimation = {
    animation,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let index = context.dataIndex;
            let label = context.dataset.label;
            label += ': ';
            label += formatCurrency({
              value: context.dataset.data[index] as number,
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
        max: getYAxisMaxValue(),
        ticks: {
          callback: function (tickValue) {
            tickValue = +tickValue;
            if (Math.floor(tickValue) === tickValue) {
              return formatCurrency({
                value: tickValue,
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

  if (isLoading) {
    return (
      <Spin spinning={isLoading}>
        <div className="h-[500px]">
          <Line
            data={{
              labels: [],
              datasets: [],
            }}
            options={options}
          />
        </div>
      </Spin>
    );
  } else {
    return (
      <div className="h-[500px]">
        <Line data={chartData} options={options} />
      </div>
    );
  }
}
