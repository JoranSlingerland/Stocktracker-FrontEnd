import type { ColumnsType } from 'antd/es/table';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/formatting';
import dayjs from 'dayjs';
import { TransactionsFormModal } from '../../modules/formModal';
import { InputInvestedData } from '../../types/types';

export const InputInvestedColumns = (
  currency: string,
  deleteData: (
    id: string[],
    container: 'input_invested' | 'input_transactions'
  ) => Promise<void>,
  parentCallback: () => void
): ColumnsType<InputInvestedData> => [
  {
    title: 'Transaction Date',
    dataIndex: 'date',
    key: 'date',
    render: (text: string | dayjs.Dayjs) =>
      typeof text === 'string' ? text : text.format('YYYY-MM-DD'),
  },
  {
    title: 'Transaction Type',
    dataIndex: 'transaction_type',
    key: 'transaction_type',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (text: string | number) =>
      formatCurrency({ value: text, currency }),
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    width: 60,
    sorter: false,
    render: (text: string, record) => (
      <div className="flex">
        <Popconfirm
          title="Are you sure you want to delete this item?"
          onConfirm={() => {
            deleteData([record.id], 'input_invested');
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
        <TransactionsFormModal
          currency={currency}
          parentCallback={parentCallback}
          initialValues={record}
          isEdit={true}
        />
      </div>
    ),
  },
];
