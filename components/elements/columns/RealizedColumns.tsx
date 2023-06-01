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

export const RealizedColumns = (
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
    dataIndex: 'realized',
    key: 'realized.buy_price',
    responsive: ['md'],
    render: (text: StocksHeldData['realized']) => (
      <>
        <Text strong>
          {formatCurrency({
            value: text.buy_price,
            currency: currency,
          })}
        </Text>
        <div className="flex space-x-0.5 flex-row">
          <Text keyboard> x{formatNumber(text.quantity)} </Text>
          <Text type="secondary">
            {formatCurrency({
              value: text.cost_per_share_buy,
              currency,
            })}
          </Text>
        </div>
      </>
    ),
  },
  {
    title: 'Realized',
    dataIndex: 'realized',
    key: 'realized.sell_price',
    render: (text: StocksHeldData['realized']) => (
      <>
        <Text strong>
          {formatCurrency({
            value: text.sell_price,
            currency,
          })}
        </Text>
        <div className="flex space-x-0.5 flex-row">
          <Text className="whitespace-nowrap" keyboard>
            x{formatNumber(text.quantity)}{' '}
          </Text>
          <Text type="secondary">
            {formatCurrency({
              value: text.cost_per_share_sell,
              currency,
            })}
          </Text>
        </div>
      </>
    ),
  },
  {
    title: 'P/L',
    dataIndex: 'realized',
    key: 'realized.total_pl',
    render: (text: StocksHeldData['realized']) => (
      <>
        {formatCurrencyWithColors({
          value: text.total_pl,
          currency,
        })}{' '}
        <Text type="secondary">
          {formatPercentage(text.total_pl_percentage)}
        </Text>
      </>
    ),
  },
];
