// components\PrimeFaceBarChart.js

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

  const formatCurrency = (value, maximumFractionDigits) => {
    if (maximumFractionDigits == undefined) {
      maximumFractionDigits == 2;
    }
    return value.toLocaleString('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: maximumFractionDigits,
    });
  };

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

  function stringToColour(str) {
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

  function hexToRgbA(hex) {
    var c;
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
    barchart_datasets.push({
      type: 'bar',
      label: uniquecategory[i - 1],
      data: filter_json(uniquecategory[i - 1]),
      backgroundColor: stringToColour(uniquecategory[i - 1]),
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
        tooltip: {
          callbacks: {
            label: function (context) {
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
        },
        y: {
          stacked: true,
          ticks: {
            callback: function (value) {
              if (Math.floor(value) === value) {
                return formatCurrency(value, 0);
              }
            },
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
