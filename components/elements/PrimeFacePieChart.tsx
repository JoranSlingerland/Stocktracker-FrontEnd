import { Spin, Checkbox, List, Skeleton } from 'antd';
import { Chart } from 'primereact/chart';
import { formatCurrency } from '../utils/formatting';
import React from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PieChartData } from '../services/chart/pie';

export default function PieChart({
  data,
  isloading,
  currency,
}: {
  data: PieChartData | undefined;
  isloading: boolean;
  currency: string;
}): JSX.Element {
  const myChartRef: any = React.createRef();

  const chartData: any = {
    labels: [],
    datasets: [],
  };
  if (data) {
    chartData.labels = data['labels'];
    chartData.datasets = [
      {
        data: data['data'],
        backgroundColor: data['color'],
        hoverBorderWidth: 0,
        hoverBorderColor: data['color'],
        hoverOffset: 3,
      },
    ];
  }

  const list_data_source = chartData['labels'].map(
    (label: string, i: number) => {
      return {
        title: label,
        color: chartData['datasets'][0]['backgroundColor'][i],
        data: chartData['datasets'][0]['data'][i],
        key: i,
      };
    }
  );

  function find_parent_with_id(target: any, id: string) {
    while (target && target.id !== id) {
      target = target.parentNode;
    }
    return target;
  }

  function find_target_index(target: any) {
    var parent = target.parentNode;
    var index = Array.prototype.indexOf.call(parent.children, target);
    return index;
  }

  function clickEvent(e: { target: any }) {
    var target = e.target;
    target = find_parent_with_id(target, 'legend_li_item');
    var index = find_target_index(target);
    const chart_ctx = myChartRef.current.getChart();
    chart_ctx.toggleDataVisibility(index);
    chart_ctx.update();
  }

  function mouseEnter(e: any) {
    var target = e.target;
    target = find_parent_with_id(target, 'legend_li_item');
    var index = find_target_index(target);
    const chart_ctx = myChartRef.current.getChart();
    chart_ctx.setActiveElements([{ datasetIndex: 0, index: index }]);
    chart_ctx.update();
  }

  function mouseLeave(e: any) {
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
        formatter: (
          value: number,
          ctx: {
            chart: { data: { datasets: { data: number[] }[] } };
          }
        ) => {
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
          label: function (context: {
            dataIndex: any;
            label: any;
            dataset: { data: { [x: string]: string | number } };
          }) {
            let index = context.dataIndex;
            let label = context.label;
            label += ': ';
            label += formatCurrency({
              value: context.dataset.data[index],
              currency,
            });
            return label;
          },
          labelPointStyle: function () {
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
    <div className="flex flex-col justify-center md:flex-row">
      <Spin spinning={isloading}>
        <div>
          <Chart
            type="pie"
            data={chartData}
            options={options}
            className="w-10/12 m-auto md:w-full md:mr-20"
            ref={myChartRef}
            plugins={[ChartDataLabels]}
          />
        </div>
      </Spin>
      <div className="w-full mt-10 md:items-center md:w-1/2 md:my-2">
        <Skeleton
          title={false}
          paragraph={{ width: '100%' }}
          loading={isloading}
          active={isloading}
        >
          <List
            itemLayout="horizontal"
            dataSource={list_data_source}
            className="w-full"
            size="small"
            pagination={{
              pageSize: 8,
              size: 'small',
              hideOnSinglePage: true,
              className: 'm-0',
            }}
            renderItem={(item: {
              title: string;
              color: string;
              data: number | string;
            }) => (
              <List.Item
                key="legend_li_item"
                id="legend_li_item"
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
              >
                <List.Item.Meta
                  title={
                    <div>
                      <div
                        className="w-10 h-2 rounded-full display:"
                        ref={(el) =>
                          el &&
                          el.style.setProperty(
                            'background-color',
                            item.color,
                            'important'
                          )
                        }
                      ></div>
                      <div>{item.title}</div>
                    </div>
                  }
                  avatar={
                    <Checkbox
                      onClick={clickEvent}
                      defaultChecked={true}
                    ></Checkbox>
                  }
                />
                <div>
                  {formatCurrency({
                    value: item.data,
                    currency,
                  })}
                </div>
              </List.Item>
            )}
          />
        </Skeleton>
      </div>
    </div>
  );
}
