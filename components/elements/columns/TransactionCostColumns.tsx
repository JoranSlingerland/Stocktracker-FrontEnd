import type { ColumnsType } from 'antd/es/table';
import { formatCurrency, formatImageAndText } from '../../utils/formatting';

export const TransactionCostColumns = (currency: string): ColumnsType => [
  {
    title: 'Name',
    dataIndex: 'meta',
    key: 'meta.name',
    render: (text: any, record: any) =>
      formatImageAndText(record.symbol, text.name, record.meta.icon),
  },
  {
    title: 'Transaction Costs',
    dataIndex: 'realized',
    key: 'realized.transaction_cost',
    render: (text: { transaction_cost: string | number }) =>
      formatCurrency({
        value: text.transaction_cost,
        currency,
      }),
  },
];
