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
      legend: {
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
