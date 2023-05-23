import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import {
  formatCurrency,
  formatCurrencyWithColors,
  formatImageAndText,
  formatNumber,
  formatPercentageWithColors,
} from '../../utils/formatting';

const { Text } = Typography;

export const UnRealizedColumns = (currency: string): ColumnsType => [
  {
    title: 'Name',
    dataIndex: 'meta',
    key: 'meta.name',
    fixed: 'left',
    render: (text: any, record: any) =>
      formatImageAndText(record.symbol, text.name, record.meta.icon),
  },
  {
    title: 'Cost',
    dataIndex: 'unrealized',
    key: 'unrealized.total_cost',
    responsive: ['md'],
    render: (text: { total_cost: string | number }, record: any) => (
      <>
        <Text strong>
          {formatCurrency({
            value: text.total_cost,
            currency,
          })}
        </Text>
        <div className="flex space-x-0.5 flex-row flex-nowrap">
          <Text keyboard> x{formatNumber(record.unrealized.quantity)} </Text>
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
    render: (text: { total_value: string | number }, record: any) => (
      <>
        <Text strong>
          {formatCurrency({
            value: text.total_value,
            currency,
          })}
        </Text>
        <div className="flex space-x-0.5 flex-row">
          <Text keyboard> x{formatNumber(record.unrealized.quantity)} </Text>
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
