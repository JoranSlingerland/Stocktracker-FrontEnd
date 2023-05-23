import type { ColumnsType } from 'antd/es/table';
import {
  formatCurrencyWithColors,
  formatImageAndText,
  formatPercentageWithColors,
} from '../../utils/formatting';

export const valueGrowthColumns = (currency: string): ColumnsType => [
  {
    title: 'Name',
    dataIndex: 'meta',
    key: 'meta.name',
    render: (text: any, record: any) =>
      formatImageAndText(record.symbol, text.name, record.meta.icon),
  },
  {
    title: 'Profit / Loss',
    dataIndex: 'unrealized',
    key: 'unrealized.total_pl',
    render: (text) => (
      <>
        {formatCurrencyWithColors({
          value: text.total_pl,
          currency,
        })}

        {formatPercentageWithColors({ value: text.total_pl_percentage })}
      </>
    ),
  },
];
