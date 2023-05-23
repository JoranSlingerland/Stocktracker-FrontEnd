import type { ColumnsType } from 'antd/es/table';
import { Typography, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
  formatCurrency,
  formatImageAndText,
  formatNumber,
} from '../../utils/formatting';
import { StockFormModal } from '../../modules/formModal';
import dayjs from 'dayjs';

const { Text } = Typography;

export const InputTransactionsColumns = (
  deleteData: (
    id: string[],
    container: 'input_invested' | 'input_transactions'
  ) => Promise<void>,
  parentCallback: () => Promise<void>,
  currency: string
): ColumnsType => [
  {
    title: 'Name',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (text: string, record: any) => (
      <div className="min-w-16">
        {formatImageAndText(text, record.meta.name, record.meta.icon)}
      </div>
    ),
  },
  {
    title: 'Transaction Date',
    dataIndex: 'date',
    key: 'date',
    render: (text: string | dayjs.Dayjs) =>
      typeof text === 'string' ? text : text.format('YYYY-MM-DD'),
  },
  {
    title: 'Cost',
    dataIndex: 'total_cost',
    key: 'total_cost',
    render: (text, record: any) => (
      <div className="min-w-32">
        <Text strong>
          {formatCurrency({
            value: text,
            currency: record.currency,
          })}
        </Text>
        <div className="flex space-x-0.5 flex-row">
          <Text keyboard> x{formatNumber(record.quantity)} </Text>
          <Text type="secondary">
            {formatCurrency({
              value: record.cost_per_share,
              currency: record.currency,
            })}
          </Text>
        </div>
      </div>
    ),
  },
  {
    title: 'Transaction Type',
    dataIndex: 'transaction_type',
    key: 'transaction_type',
  },
  {
    title: 'Transaction Cost',
    dataIndex: 'transaction_cost',
    key: 'transaction_cost',
    render: (text: string | number) =>
      formatCurrency({ value: text, currency: 'EUR' }),
  },
  {
    title: 'Domain',
    dataIndex: 'domain',
    key: 'domain',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    width: 60,
    sorter: false,
    render: (text, record: any) => (
      <div className="flex">
        <Popconfirm
          title="Are you sure you want to delete this item?"
          onConfirm={() => {
            deleteData([record.id], 'input_transactions');
          }}
          okText="Yes"
          cancelText="No"
          arrow={false}
          icon={false}
        >
          <Button
            size="small"
            type="text"
            icon={<DeleteOutlined />}
            danger
          ></Button>
        </Popconfirm>
        <StockFormModal
          parentCallback={parentCallback}
          initialValues={record}
          currency={currency}
          isEdit={true}
        />
      </div>
    ),
  },
];
