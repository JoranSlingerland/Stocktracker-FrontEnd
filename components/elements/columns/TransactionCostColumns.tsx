import type { ColumnsType } from 'antd/es/table';
import { formatCurrency, formatImageAndText } from '../../utils/formatting';
import { useProps } from '../../hooks/useProps';

export const TransactionCostColumns = (): ColumnsType<StocksHeldData> => {
  const { userSettings } = useProps();

  return [
    {
      title: 'Name',
      dataIndex: 'meta',
      key: 'meta.name',
      render: (text: MetaData, record) =>
        formatImageAndText(record.symbol, text.name, record.meta.icon),
    },
    {
      title: 'Transaction Costs',
      dataIndex: 'realized',
      key: 'realized.transaction_cost',
      render: (text: StocksHeldData['realized']) =>
        formatCurrency({
          value: text.transaction_cost,
          currency: userSettings?.data.currency,
        }),
    },
  ];
};
