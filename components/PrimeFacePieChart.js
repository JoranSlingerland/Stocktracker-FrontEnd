// components\PrimeFacePieChart.js

import { Spin, Checkbox } from 'antd';
import { Chart } from 'primereact/chart';
import { formatCurrency } from '../utils/formatting';
import React from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function PieChart({ data, isloading }) {
  const myChartRef = React.createRef();

  const chartData = {
    labels: data['labels'],
    datasets: [
      {
        data: data['data'],
        backgroundColor: data['color'],
        hoverBorderWidth: 0,
        hoverBorderColor: data['color'],
        hoverOffset: 3,
      },
    ],
  };

  const legend = chartData['labels'].map((labels, i) => {
    return (
      <li
        key="legend_li_item"
        id="legend_li_item"
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      >
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

  function find_parent_with_id(target, id) {
    while (target && target.id !== id) {
      target = target.parentNode;
    }
    return target;
  }
  function find_target_index(target) {
    var parent = target.parentNode;
    var index = Array.prototype.indexOf.call(parent.children, target);
    return index;
  }

  function clickevent(e) {
    var target = e.target;
    target = find_parent_with_id(target, 'legend_li_item');
    var index = find_target_index(target);
    const chart_ctx = myChartRef.current.getChart();
    chart_ctx.toggleDataVisibility(index);
    chart_ctx.update();
  }

  function mouseEnter(e) {
    var target = e.target;
    target = find_parent_with_id(target, 'legend_li_item');
    var index = find_target_index(target);
    const chart_ctx = myChartRef.current.getChart();
    chart_ctx.setActiveElements([{ datasetIndex: 0, index: index }]);
    chart_ctx.update();
  }

  function mouseLeave(e) {
    var target = e.target;
    target = find_parent_with_id(target, 'legend_li_item');
    const chart_ctx = myChartRef.current.getChart();
    chart_ctx.setActiveElements([]);
    chart_ctx.update();
  }

  const options = {
    plugins: {
      datalabels: {
        color: '#fff',
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data) => {
            sum += data;
          });
          let percentage = ((value * 100) / sum).toFixed(0) + '%';
          return percentage;
        },
      },
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
            plugins={[ChartDataLabels]}
          />
        </div>
        <div className="flex justify-center mt-10 sm:items-center sm:my-2">
          <ul>{legend}</ul>
        </div>
      </div>
    </Spin>
  );
}
