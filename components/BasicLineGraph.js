import { Line } from '@ant-design/plots';
import { Spin } from 'antd';

export default function PieChart({ isloading, data }) {
  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    smooth: true,
  };
  return (
    <Spin spinning={isloading}>
      <Line {...config} />
    </Spin>
  );
}
