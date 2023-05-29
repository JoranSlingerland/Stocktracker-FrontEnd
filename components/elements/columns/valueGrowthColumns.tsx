import type { ColumnsType } from 'antd/es/table';
import {
  formatCurrencyWithColors,
  formatImageAndText,
  formatPercentageWithColors,
} from '../../utils/formatting';
import { StocksHeldData, MetaData } from '../../types/types';

export const valueGrowthColumns = (
  currency: string
): ColumnsType<StocksHeldData> => [
  {
    title: 'Name',
    dataIndex: 'meta',
    key: 'meta.name',
    render: (text: MetaData, record: StocksHeldData) =>
      formatImageAndText(record.symbol, text.name, record.meta.icon),
  },
  {
    title: 'Profit / Loss',
    dataIndex: 'unrealized',
    key: 'unrealized.total_pl',
    render: (text: StocksHeldData['unrealized']) => (
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
