import type { ColumnsType } from 'antd/es/table';
import { Typography, Button, Popconfirm, Tag } from 'antd';
import {
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  formatCurrency,
  formatImageAndText,
  formatNumber,
  formatCurrencyWithColors,
  formatPercentageWithColors,
} from '../utils/formatting';
import { terminateOrchestrator } from '../services/orchestrator/terminateOrchestrator';
import { purgeOrchestrator } from '../services/orchestrator/purgeOrchestrator';

const { Text } = Typography;

const RealizedColumns = (currency: string): ColumnsType => [
  {
    title: 'Name',
    dataIndex: 'meta',
    key: 'meta.name',
    fixed: 'left',
    render: (text, record: any) =>
      formatImageAndText(record.symbol, text.name, record.meta.icon),
  },
  {
    title: 'Cost',
    dataIndex: 'realized',
    key: 'realized.buy_price',
    responsive: ['md'],
    render: (text) => (
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
    render: (text) => (
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

const UnRealizedColumns = (currency: string): ColumnsType => [
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

const valueGrowthColumns = (currency: string): ColumnsType => [
  {
    title: 'Name',
    dataIndex: 'meta',
    key: 'meta.name',
    render: (text: any, record: any) =>
      formatImageAndText(record.symbol, text.name, record.meta.icon),
  },
  {
    title: 'Profit / Loss',
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

const ReceivedDividedColumns = (currency: string): ColumnsType => [
  {
    title: 'Name',
    dataIndex: 'meta',
    key: 'meta.name',
    render: (text: any, record: any) =>
      formatImageAndText(record.symbol, text.name, record.meta.icon),
  },
  {
    title: 'Dividends',
    dataIndex: 'realized',
    key: 'realized.total_dividends',
    render: (text: { total_dividends: string | number }) =>
      formatCurrency({
        value: text.total_dividends,
        currency,
      }),
  },
];

const TransactionCostColumns = (currency: string): ColumnsType => [
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

const InputInvestedColumns = (
  currency: string,
  deleteData: (
    id: string[],
    container: 'input_invested' | 'input_transactions'
  ) => Promise<void>
): ColumnsType => [
  {
    title: 'Transaction Date',
    dataIndex: 'date',
    key: 'date',
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
    render: (text: string, record: any) => (
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
    ),
  },
];

const InputTransactionsColumns = (
  deleteData: (
    id: string[],
    container: 'input_invested' | 'input_transactions'
  ) => Promise<void>
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
    render: (record: any) => (
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
    ),
  },
];

const orchestratorColumns: ColumnsType = [
  {
    title: 'Status',
    dataIndex: 'runtimeStatus',
    key: 'runtimeStatus',
    render: (text: string) => {
      if (text === 'Completed') {
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {text}
          </Tag>
        );
      } else if (text === 'Failed') {
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            {text}
          </Tag>
        );
      } else if (text === 'Suspended' || text === 'Terminated') {
        return (
          <Tag icon={<ExclamationCircleOutlined />} color="warning">
            {text}
          </Tag>
        );
      } else if (text === 'Running' || text === 'Pending') {
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            {text}
          </Tag>
        );
      } else {
        return <Tag color="default">{text}</Tag>;
      }
    },
  },
  {
    title: 'Created Time',
    dataIndex: 'createdTime',
    key: 'createdTime',
  },
  {
    title: 'Last Updated Time',
    dataIndex: 'lastUpdatedTime',
    key: 'lastUpdatedTime',
  },
  {
    title: 'Instance ID',
    dataIndex: 'instanceId',
    key: 'instanceId',
    render: (text: string) => <Text copyable>{text}</Text>,
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    render: (record: any) => (
      <>
        <Popconfirm
          title="Are you sure you want to terminate this orchestrator?"
          onConfirm={() => {
            terminateOrchestrator({
              body: {
                instanceId: record.instanceId,
              },
            });
          }}
          okText="Yes"
          cancelText="No"
          arrow={false}
          icon={false}
        >
          <Button
            danger
            disabled={
              record.runtimeStatus === 'Running' ||
              record.runtimeStatus === 'Pending'
                ? false
                : true
            }
            className="mb-1 mr-1"
            size="small"
          >
            Terminate
          </Button>
        </Popconfirm>
        <Popconfirm
          title="Are you sure you want to purge this orchestrator?"
          onConfirm={() => {
            purgeOrchestrator({
              body: {
                instanceId: record.instanceId,
              },
            });
          }}
          okText="Yes"
          cancelText="No"
          arrow={false}
          icon={false}
        >
          <Button size="small" danger>
            Purge
          </Button>
        </Popconfirm>
      </>
    ),
  },
];

export {
  RealizedColumns,
  UnRealizedColumns,
  valueGrowthColumns,
  ReceivedDividedColumns,
  TransactionCostColumns,
  InputInvestedColumns,
  InputTransactionsColumns,
  orchestratorColumns,
};
