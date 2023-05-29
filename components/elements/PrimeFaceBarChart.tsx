import { Chart } from 'primereact/chart';
import { Spin } from 'antd';
import { formatCurrency } from '../utils/formatting';
import { BarChartData } from '../services/chart/bar';

export default function PrimeFacePieChart({
  data,
  isloading,
  currency,
}: {
  data: BarChartData[] | undefined;
  isloading: boolean;
  currency: string;
}): JSX.Element {
  const labels = data
    ? data.map(function (index) {
        return index.date;
      })
    : [];

  const uniqueLabels = Array.from(new Set(labels));

  const category = data
    ? data.map(function (index) {
        return index.category;
      })
    : [];

  function filter_json(symbol: string) {
    let outputData = [];
    if (data) {
      for (const element of data) {
        for (let i = 1; i < uniqueLabels.length + 1; i++) {
          if (
            element['category'] === symbol &&
            element['date'] === uniqueLabels[i - 1]
          ) {
            outputData.push(element);
          }
        }
      }
    }
    const outputData_final = outputData.map(function (index) {
      return index.value;
    });
    return outputData_final;
  }

  const barchart_datasets = [];
  const uniqueCategory = Array.from(new Set(category));

  function stringToColour(str: string) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return hexToRgbA(colour);
  }

  function hexToRgbA(hex: string, alpha: string = '1') {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } else {
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
  }

  for (let i = 1; i < uniqueCategory.length + 1; i++) {
    const filtered_data = filter_json(uniqueCategory[i - 1]);
    const filtered_data_sum = filtered_data.reduce((a, b) => a + b, 0);
    if (filtered_data_sum !== 0)
      barchart_datasets.push({
        type: 'bar',
        label: uniqueCategory[i - 1],
        data: filtered_data,
        backgroundColor: stringToColour(uniqueCategory[i - 1]),
      });
  }

  const stackedData = {
    labels: uniqueLabels,
    datasets: barchart_datasets,
  };

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
        <Chart type="bar" data={stackedData} options={stackedOptions} />
      </Spin>
    </div>
  );
}
