import { Column } from '@ant-design/plots';
import { Spin } from 'antd';

export default function PieChart({ isloading, data }) {
  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    label: {
      position: 'middle',
    },
    interactions: [
      {
        type: 'active-region',
        enable: false,
      },
    ],
  };
  return (
    <Spin spinning={isloading}>
      <Column {...config} />
    </Spin>
  );
}
