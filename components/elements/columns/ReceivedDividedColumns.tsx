import type { ColumnsType } from 'antd/es/table';
import { formatCurrency, formatImageAndText } from '../../utils/formatting';
import { useContext } from 'react';
import { PropsContext } from '../../../pages/_app';

export const ReceivedDividedColumns = (): ColumnsType<StocksHeldData> => {
  const { userSettings } = useContext(PropsContext);

  return [
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
          currency: userSettings?.data.currency,
        }),
    },
  ];
};
