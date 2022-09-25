import { Chart } from 'primereact/chart';

export default function PrimeFacePieChart(jsondata) {
  const data = [
    { date: '2022 January', value: 0.0, category: 'MSFT' },
    { date: '2022 January', value: 0.0, category: 'PEP' },
    { date: '2022 January', value: 0.0, category: 'AAPL' },
    { date: '2022 February', value: 2.2, category: 'MSFT' },
    { date: '2022 February', value: 0.0, category: 'PEP' },
    { date: '2022 February', value: 0.5700000000000001, category: 'AAPL' },
    { date: '2022 March', value: 0.0, category: 'MSFT' },
    { date: '2022 March', value: 2.9699999999999998, category: 'PEP' },
    { date: '2022 March', value: 0.0, category: 'AAPL' },
    { date: '2022 April', value: 0.0, category: 'MSFT' },
    { date: '2022 April', value: 0.0, category: 'PEP' },
    { date: '2022 April', value: 0.0, category: 'AAPL' },
    { date: '2022 May', value: 1.77, category: 'MSFT' },
    { date: '2022 May', value: 0.0, category: 'PEP' },
    { date: '2022 May', value: 0.66, category: 'AAPL' },
    { date: '2022 June', value: 0.0, category: 'MSFT' },
    { date: '2022 June', value: 3.21, category: 'PEP' },
    { date: '2022 June', value: 0.0, category: 'AAPL' },
    { date: '2022 July', value: 0.0, category: 'MSFT' },
    { date: '2022 July', value: 0.0, category: 'PEP' },
    { date: '2022 July', value: 0.0, category: 'AAPL' },
    { date: '2022 August', value: 1.8599999999999999, category: 'MSFT' },
    { date: '2022 August', value: 0.0, category: 'PEP' },
    { date: '2022 August', value: 0.6900000000000001, category: 'AAPL' },
    { date: '2022 September', value: 0.0, category: 'MSFT' },
    { date: '2022 September', value: 4.64, category: 'PEP' },
    { date: '2022 September', value: 0.0, category: 'AAPL' },
  ];
  const labels = data.map(function (index) {
    return index.date;
  });

  const values = data.map(function (index) {
    return index.value;
  });

  const category = data.map(function (index) {
    return index.category;
  });

  function filter_json(symbol) {
    const output_data = data.map(function (index) {
      if(index.category === symbol){
        return index.value;
      }
    })
    return output_data
  }

  const barchart_datasets = []
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
      label: uniquecategory[i - 1],
      data: filter_json(uniquecategory[i - 1]),
      backgroundColor: bg[i - 1],
      borderColor: bc[i - 1],
    });
  }

  const stackedData = {
    labels: labels,
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
    <div>
      <div className="card">
        <h5>Stacked</h5>
        <Chart type="bar" data={stackedData} options={stackedOptions} />
      </div>
    </div>
  );
}
