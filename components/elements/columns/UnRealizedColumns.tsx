import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import {
  formatCurrency,
  formatCurrencyWithColors,
  formatImageAndText,
  formatNumber,
  formatPercentage,
} from '../../utils/formatting';
import { StocksHeldData, MetaData } from '../../types/types';

const { Text } = Typography;

export const UnRealizedColumns = (
  currency: string
): ColumnsType<StocksHeldData> => [
  {
    title: 'Name',
    dataIndex: 'meta',
    key: 'meta.name',
    fixed: 'left',
    render: (text: MetaData, record) =>
      formatImageAndText(record.symbol, text.name, record.meta.icon),
  },
  {
    title: 'Cost',
    dataIndex: 'unrealized',
    key: 'unrealized.total_cost',
    responsive: ['md'],
    render: (text: StocksHeldData['unrealized'], record) => (
      <>
        <Text strong>
          {formatCurrency({
            value: text.total_cost,
            currency,
          })}
        </Text>
        <div className="flex space-x-0.5 flex-row flex-nowrap">
          <Text keyboard>
            {' '}
            x{formatNumber({ value: record.unrealized.quantity })}{' '}
          </Text>
          <Text type="secondary">
            {formatCurrency({
              value: record.unrealized.cost_per_share,
              currency,
            })}
          </Text>
        </div>
      </>
    ),
  },
  {
    title: 'Value',
    dataIndex: 'unrealized',
    key: 'unrealized.total_value',
    render: (text: StocksHeldData['unrealized'], record) => (
      <>
        <Text strong>
          {formatCurrency({
            value: text.total_value,
            currency,
          })}
        </Text>
        <div className="flex space-x-0.5 flex-row">
          <Text keyboard>
            {' '}
            x{formatNumber({ value: record.unrealized.quantity })}{' '}
          </Text>
          <Text type="secondary">
            {formatCurrency({
              value: record.unrealized.close_value,
              currency,
            })}
          </Text>
        </div>
      </>
    ),
  },
  {
    title: 'P/L',
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
