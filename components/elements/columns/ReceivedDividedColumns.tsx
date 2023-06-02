import type { ColumnsType } from 'antd/es/table';
import { formatCurrency, formatImageAndText } from '../../utils/formatting';

export const ReceivedDividedColumns = (
  currency: string
): ColumnsType<StocksHeldData> => [
  {
    title: 'Name',
    dataIndex: 'meta',
    key: 'meta.name',
    render: (text: MetaData, record) =>
      formatImageAndText(record.symbol, text.name, record.meta.icon),
  },
  {
    title: 'Dividends',
    dataIndex: 'realized',
    key: 'realized.total_dividends',
    render: (text: StocksHeldData['realized']) =>
      formatCurrency({
        value: text.total_dividends,
        currency,
      }),
  },
];
