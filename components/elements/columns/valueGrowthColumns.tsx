import type { ColumnsType } from 'antd/es/table';
import {
  formatCurrencyWithColors,
  formatImageAndText,
  formatPercentage,
} from '../../utils/formatting';
import { StocksHeldData, MetaData } from '../../types/types';
import { Typography } from 'antd';

const { Text } = Typography;

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
        })}{' '}
        <Text type="secondary">
          {formatPercentage({ value: text.total_pl_percentage })}
        </Text>
      </>
    ),
  },
];
