// components\PrimeFacePieChart.js

import { Spin, Checkbox, Divider } from 'antd';
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
      <li>
        <div className="flex">
          <div>
            <Checkbox onClick={clickevent} defaultChecked={true}></Checkbox>
          </div>
          <div
            className="w-20 my-auto h-2.5 mx-2 rounded-full"
            style={{
              backgroundColor: chartData['datasets'][0]['backgroundColor'][i],
            }}
          ></div>

          <div className="grid w-full grid-cols-2 grid-rows-1">
            <div className="truncate">{labels}:</div>
            <div className="">
              {formatCurrency(chartData['datasets'][0]['data'][i], 0)}
            </div>
          </div>
        </div>
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
      <div className="flex flex-col sm:flex-row">
        <div>
          <Chart
            type="pie"
            data={chartData}
            options={options}
            className="w-full mr-10"
            ref={myChartRef}
          />
        </div>
        <div className="flex justify-center mt-10 sm:items-center sm:my-2">
          <ul>{legend}</ul>
        </div>
      </div>
    </Spin>
  );
}
