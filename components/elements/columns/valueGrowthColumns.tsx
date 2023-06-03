import type { ColumnsType } from 'antd/es/table';
import {
  formatCurrencyWithColors,
  formatImageAndText,
  formatPercentage,
} from '../../utils/formatting';
import { Typography } from 'antd';
import { useContext } from 'react';
import { PropsContext } from '../../../pages/_app';

const { Text } = Typography;

export const valueGrowthColumns = (): ColumnsType<StocksHeldData> => {
  const { userSettings } = useContext(PropsContext);

  return [
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
