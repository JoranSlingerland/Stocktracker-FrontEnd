// components\PrimeFacePieChart.js

import { Spin } from 'antd';
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

  function clickevent(e, i) {
    //get index of list item clicked on
    var target = e.target;

    // check if target is a list item
    if (target.tagName === 'LI') {
      var parent = target.parentNode;
      // get index of list item
      var index = Array.prototype.indexOf.call(parent.children, target);
    } else {
      // get parent of target
      var target = target.parentNode;
      var parent = target.parentNode;
      // get index of list item
      var index = Array.prototype.indexOf.call(parent.children, target);
    }

    const chart_ctx = myChartRef.current.getChart();
    // console.log(chart_ctx);
    chart_ctx.toggleDataVisibility(index);
    chart_ctx.update();

    // const chart = myChartRef.current.getChart();
    // const hidden1 = myChartRef.current.getChart().getDatasetMeta(1)
    // console.log('hidden1', hidden1)
    // const test = myChartRef.current.getChart().getDatasetMeta(1).hidden = true
    // myChartRef.current.getChart().update('active');
    // const hidden2 = myChartRef.current.getChart().getDatasetMeta(1);
    // console.log('hidden2', hidden2)
    // chart.getDatasetMeta(1).hidden = true;
    // const test = chart.getDatasetMeta(1)
    // chart.update('active');
    // console.log(test);
    // hide the dataset
    // chart.hide(2);
    // chart.update();
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

  return (
    <Spin spinning={isloading}>
      <div className="flex flex-row">
        <Chart
          type="pie"
          data={chartData}
          options={lightOptions}
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
