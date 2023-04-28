import { Chart } from 'primereact/chart';
import { Spin } from 'antd';
import { formatCurrency } from '../utils/formatting';

export default function PrimeFacePieChart({
  data,
  isloading,
}: {
  data:
    | [
        {
          date: string;
          category: string;
          value: number;
        }
      ]
    | any[];
  isloading: boolean;
}): JSX.Element {
  const labels = data.map(function (index) {
    return index.date;
  });

  const uniquelabels = Array.from(new Set(labels));

  const category = data.map(function (index) {
    return index.category;
  });

  function filter_json(symbol: string) {
    let outputData = [];
    for (const element of data) {
      for (let i = 1; i < uniquelabels.length + 1; i++) {
        if (
          element['category'] === symbol &&
          element['date'] === uniquelabels[i - 1]
        ) {
          outputData.push(element);
        }
      }
    }
    const outputData_final = outputData.map(function (index) {
      return index.value;
    });
    return outputData_final;
  }

  const barchart_datasets = [];
  const uniquecategory = Array.from(new Set(category));

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

  function hexToRgbA(hex: string) {
    var c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return (
        'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)'
      );
    }
    throw new Error('Bad Hex');
  }

  for (let i = 1; i < uniquecategory.length + 1; i++) {
    const filterd_data = filter_json(uniquecategory[i - 1]);
    const filterd_data_sum = filterd_data.reduce((a, b) => a + b, 0);
    if (filterd_data_sum !== 0)
      barchart_datasets.push({
        type: 'bar',
        label: uniquecategory[i - 1],
        data: filterd_data,
        backgroundColor: stringToColour(uniquecategory[i - 1]),
      });
  }

  const stackedData = {
    labels: uniquelabels,
    datasets: barchart_datasets,
  };

  let stackedOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let index = context.dataIndex;
            let label = context.dataset.label;
            label += ': ';
            label += formatCurrency(context.dataset.data[index]);
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
        ticks: {
          callback: function (value: number) {
            if (Math.floor(value) === value) {
              return formatCurrency(value, 0);
            }
          },
        },
      },
    },
  };

  return (
    <Spin spinning={isloading}>
      <Chart type="bar" data={stackedData} options={stackedOptions} />
    </Spin>
  );
}
