import { Spin } from 'antd';
import { Chart } from 'primereact/chart';

export default function BasicLineGraph({ isloading, data }) {
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

  let multiAxisOptions = {
    stacked: false,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
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
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
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

  if (data['datasets'].length == 1) {
    let multiAxisData = {
      labels: data['labels'],
      datasets: [
        {
          label: data['datasets'][0]['label'],
          fill: false,
          borderColor: data['datasets'][0]['borderColor'],
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
          borderColor: data['datasets'][0]['borderColor'],
          yAxisID: 'y',
          tension: 0.4,
          data: data['datasets'][0]['data'],
        },
        {
          label: data['datasets'][1]['label'],
          fill: false,
          borderColor: data['datasets'][1]['borderColor'],
          yAxisID: 'y',
          tension: 0.4,
          data: data['datasets'][1]['data'],
        },
      ],
    };

    return (
      <Spin spinning={isloading}>
        <Chart type="line" data={multiAxisData} options={multiAxisOptions} />
      </Spin>
    );
  }
}
