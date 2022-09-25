import { Chart } from 'primereact/chart';
import { Spin } from 'antd';

export default function PrimeFacePieChart(data, isloading) {
  const labels = data.data.map(function (index) {
    return index.date;
  });

  const uniquelabels = [...new Set(labels)];

  const category = data.data.map(function (index) {
    return index.category;
  });

  function filter_json(symbol) {
    let outputData = [];
    for (const element of data.data) {
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
  const uniquecategory = [...new Set(category)];
  const bg = [
    'rgba(27, 158, 119, 0.5)',
    'rgba(217, 95, 2, 0.5)',
    'rgba(117, 112, 179, 0.5)',
    'rgba(231, 41, 138, 0.5)',
    'rgba(102, 166, 30, 0.5)',
    'rgba(230, 171, 2, 0.5)',
    'rgba(166, 118, 29, 0.5)',
    'rgba(102, 102, 102, 0.5)',
  ];
  const bc = [
    'rgb(27, 158, 119)',
    'rgb(217, 95, 2)',
    'rgb(117, 112, 179)',
    'rgb(231, 41, 138)',
    'rgb(102, 166, 30)',
    'rgb(230, 171, 2)',
    'rgb(166, 118, 29)',
    'rgb(102, 102, 102)',
  ];

  for (let i = 1; i < uniquecategory.length + 1; i++) {
    barchart_datasets.push({
      type: 'bar',
      label: uniquecategory[i - 1],
      data: filter_json(uniquecategory[i - 1]),
      backgroundColor: bg[i - 1],
    });
  }

  const stackedData = {
    labels: uniquelabels,
    datasets: barchart_datasets,
  };

  const getLightTheme = () => {
    let stackedOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };

    return {
      stackedOptions,
    };
  };

  const { stackedOptions } = getLightTheme();

  return (
    <Spin spinning={data.isloading}>
      <Chart type="bar" data={stackedData} options={stackedOptions} />
    </Spin>
  );
}
