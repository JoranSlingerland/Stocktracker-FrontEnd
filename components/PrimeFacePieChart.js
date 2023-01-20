// components\PrimeFacePieChart.js

import { Spin } from 'antd';
import { Chart } from 'primereact/chart';
import { formatCurrency } from '../utils/formatting';
import { useCallback } from 'react';

export default function PieChart({ data, isloading }) {
  const chartData = {
    labels: data['labels'],
    datasets: [
      {
        data: data['data'],
        backgroundColor: data['color'],
      },
    ],
  };

  const legend = chartData['labels'].map((labels, i) => {
    return (
      <li className="flex" onClick={clickevent}>
        <span
          className="w-10 my-auto h-2.5 rounded-full mr-2.5"
          style={{
            backgroundColor: chartData['datasets'][0]['backgroundColor'][i],
          }}
        ></span>
        <div className="text-align-left">{labels}</div>
      </li>
    );
  });

  function clickevent() {
    // const visible = Chart.getDataVisibility(2);
    // console.log(visible);
  }

  const lightOptions = {
    plugins: {
      tooltip: {
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            let index = context.dataIndex;
            let label = context.label;
            label += ': ';
            label += formatCurrency(context.dataset.data[index]);
            return label;
          },
          labelPointStyle: function (context) {
            return {
              pointStyle: 'triangle',
              rotation: 0,
            };
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  const onRefChange = useCallback((node) => {
    console.log(node);
    if (node !== null) {
      const canvasid = node.getChart();
      console.log('element:', canvasid);
    }
    // console.log(canvasid);
  }, []);

  return (
    <Spin spinning={isloading}>
      <div className="flex flex-row">
        <Chart
          type="pie"
          data={chartData}
          options={lightOptions}
          className="w-1/2 mr-10"
          ref={onRefChange}
        />
        <div className="flex items-center justify-center">
          <ul className="content-center">{legend}</ul>
        </div>
      </div>
    </Spin>
  );
}
