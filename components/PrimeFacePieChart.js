// components\PrimeFacePieChart.js

import { Spin, Checkbox } from 'antd';
import { Chart } from 'primereact/chart';
import { formatCurrency } from '../utils/formatting';
import React from 'react';

export default function PieChart({ data, isloading }) {
  const myChartRef = React.createRef();

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
      <li className="flex">
        <Checkbox onClick={clickevent} defaultChecked={true}></Checkbox>
        <span
          className="w-10 my-auto h-2.5 rounded-full mx-2"
          style={{
            backgroundColor: chartData['datasets'][0]['backgroundColor'][i],
          }}
        ></span>
        <div className="text-align-left">{labels}</div>
      </li>
    );
  });

  function clickevent(e) {
    var target = e.target.parentNode.parentNode.parentNode;
    var parent = target.parentNode;
    var index = Array.prototype.indexOf.call(parent.children, target);

    const chart_ctx = myChartRef.current.getChart();
    chart_ctx.toggleDataVisibility(index);
    chart_ctx.update();
  }

  const options = {
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

  return (
    <Spin spinning={isloading}>
      <div className="flex flex-row">
        <Chart
          type="pie"
          data={chartData}
          options={options}
          className="w-1/2 mr-10"
          ref={myChartRef}
        />
        <div className="flex items-center justify-center">
          <ul className="content-center">{legend}</ul>
        </div>
      </div>
    </Spin>
  );
}
