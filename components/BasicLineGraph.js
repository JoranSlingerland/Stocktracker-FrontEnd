import { Line } from '@ant-design/plots';
import { Spin } from 'antd';

export default function PieChart({ isloading, data }) {
  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    slider: {
      start: 0,
      end: 1,
    },
    smooth: true,
  };
  return (
    <Spin spinning={isloading}>
      <Line {...config} />
    </Spin>
  );
}
