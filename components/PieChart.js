import { Spin } from 'antd';
import { Chart } from 'primereact/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function PieChart({ data, isloading }) {
  const formatCurrency = (value) => {
    return value.toLocaleString('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    });
  };
  // const plugin = Chartjs.register(ChartDataLabels);

  const chartData = {
    labels: data['labels'],
    datasets: [
      {
        data: data['data'],
        backgroundColor: data['color'],
      },
    ],
  };
  const lightOptions = {
    plugins: {
      tooltip: {
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            let index = context.dataIndex;
            console.log(context);
            let label = context.label;
            label += ': ';
            label += formatCurrency(context.dataset.data[index]);
            return label;
          },
          labelPointStyle: function (context) {
            console.log(context);
            return {
              pointStyle: 'triangle',
              rotation: 0,
            };
          },
        },
      },
      legend: {
        position: 'right',
        labels: {
          color: '#495057',
        },
      },
    },
  };

  return (
    <Spin spinning={isloading}>
      <Chart
        type="pie"
        data={chartData}
        options={lightOptions}
        style={{ position: 'relative', width: '40%' }}
      />
    </Spin>
  );
}
