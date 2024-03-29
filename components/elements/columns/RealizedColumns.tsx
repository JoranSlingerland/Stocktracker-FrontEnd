import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import {
  formatCurrency,
  formatCurrencyWithColors,
  formatImageAndText,
  formatNumber,
  formatPercentage,
} from '../../utils/formatting';
import { useProps } from '../../hooks/useProps';

const { Text } = Typography;

export const RealizedColumns = (): ColumnsType<StocksHeldData> => {
  const { userSettings } = useProps();

  return [
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
              currency: userSettings?.data.currency,
            })}
          </Text>
          <div className="flex space-x-0.5 flex-row">
            <Text keyboard> x{formatNumber({ value: text.quantity })} </Text>
            <Text type="secondary">
              {formatCurrency({
                value: text.cost_per_share_buy,
                currency: userSettings?.data.currency,
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
              currency: userSettings?.data.currency,
            })}
          </Text>
          <div className="flex space-x-0.5 flex-row">
            <Text className="whitespace-nowrap" keyboard>
              x{formatNumber({ value: text.quantity })}{' '}
            </Text>
            <Text type="secondary">
              {formatCurrency({
                value: text.cost_per_share_sell,
                currency: userSettings?.data.currency,
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
            currency: userSettings?.data.currency,
          })}{' '}
          <Text type="secondary">
            {formatPercentage({ value: text.total_pl_percentage })}
          </Text>
        </>
      ),
    },
  ];
};
