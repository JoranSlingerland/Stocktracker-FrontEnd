import { Spin, Checkbox, List, Skeleton, Progress } from 'antd';
import { formatCurrency } from '../utils/formatting';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PieChartData } from '../services/chart/pie';
import { useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js/auto';

ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

interface ChartData {
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
    borderWidth: number;
  }[];
  labels: string[];
}

export default function PieChart({
  data,
  isLoading,
  currency,
}: {
  data: PieChartData | undefined;
  isLoading: boolean;
  currency: string;
}): JSX.Element {
  const chartRef = useRef<ChartJS<'pie'>>(null);
  const sum = data?.data?.reduce((a: number, b: number) => a + b, 0) ?? 0;

  const chartData: ChartData = {
    labels: [],
    datasets: [],
  };
  if (data) {
    chartData.labels = data['labels'];
    chartData.datasets = [
      {
        data: data['data'],
        backgroundColor: data['color'],
        hoverBackgroundColor: data['color'].map((color) => color + '80'),
        borderWidth: 0,
      },
    ];
  }

  const listDataSource = chartData['labels'].map((label: string, i: number) => {
    return {
      title: label,
      color: chartData?.['datasets'][0]['backgroundColor'][i],
      data: chartData['datasets'][0]['data'][i],
      key: i,
    };
  });

  function onClick(index: number) {
    chartRef.current?.toggleDataVisibility(index);
    chartRef.current?.update();
  }

  function mouseEnter(index: number) {
    chartRef.current?.setActiveElements([{ datasetIndex: 0, index }]);
    chartRef.current?.update();
  }

  function mouseLeave() {
    chartRef.current?.setActiveElements([]);
    chartRef.current?.update();
  }

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#fff',
        formatter(value) {
          let percentage = (value * 100) / sum;
          if (percentage < 3) return '';
          return percentage.toFixed(0) + '%';
        },
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          label(tooltipItem) {
            return formatCurrency({
              value: tooltipItem.parsed,
              currency,
            });
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
    <div className="md:grid md:grid-cols-2 md:grid-rows-1 mb-4">
      <Spin className="md:mt-[65px]" spinning={isLoading}>
        <div className="h-[400px] md:h-[500px] md:m-4">
          <Pie data={chartData} options={options} ref={chartRef} />
        </div>
      </Spin>
      <div>
        <Skeleton
          title={false}
          paragraph={{ width: '100%' }}
          loading={isLoading}
          active={isLoading}
          className="mt-4 md:mt-0"
        >
          <List
            itemLayout="horizontal"
            dataSource={listDataSource}
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
