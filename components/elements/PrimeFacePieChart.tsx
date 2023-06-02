import { Spin, Checkbox, List, Skeleton, Progress } from 'antd';
import { Chart } from 'primereact/chart';
import { formatCurrency } from '../utils/formatting';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PieChartData } from '../services/chart/pie';
import { useRef } from 'react';

export default function PieChart({
  data,
  isloading,
  currency,
}: {
  data: PieChartData | undefined;
  isloading: boolean;
  currency: string;
}): JSX.Element {
  const myChartRef: any = useRef();
  const sum = data?.data?.reduce((a: number, b: number) => a + b, 0) ?? 0;

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

  function onClick(index: number) {
    const chart_ctx = myChartRef.current.getChart();
    chart_ctx.toggleDataVisibility(index);
    chart_ctx.update();
  }

  function mouseEnter(index: number) {
    const chart_ctx = myChartRef.current.getChart();
    chart_ctx.setActiveElements([{ datasetIndex: 0, index: index }]);
    chart_ctx.update();
  }

  function mouseLeave() {
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
              data: number;
              key: number;
            }) => (
              <List.Item
                onMouseEnter={() => mouseEnter(item.key)}
                onMouseLeave={mouseLeave}
              >
                <List.Item.Meta
                  avatar={
                    <Checkbox
                      onChange={() => {
                        onClick(item.key);
                      }}
                      defaultChecked={true}
                    ></Checkbox>
                  }
                />
                <div className="w-full pr-10">
                  <div>{item.title}</div>
                  <Progress
                    percent={(item.data / sum) * 100}
                    showInfo={false}
                    status="normal"
                    strokeColor={item.color}
                  />
                </div>
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
