import { Pie } from '@ant-design/plots';

export default function PieChart({ data }) {
  const formatCurrency = (value) => {
    return value.toLocaleString('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    legend: {
      itemValue: {
        formatter: (text, item) => {
          const items = data.filter((d) => d.type === item.value);
          return formatCurrency(
            items.length
              ? items.reduce((a, b) => a + b.value, 0) / items.length
              : '-'
          );
        },
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
      {
        type: 'pie-legend-active',
      },
    ],
  };
  return <Pie {...config} />;
}
