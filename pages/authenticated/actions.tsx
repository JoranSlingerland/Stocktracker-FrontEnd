import { Divider, Input, Typography, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import AntdTable from '../../components/antdTable';
import {
  cachedFetch,
  overwriteCachedFetch,
  ApiWithMessage,
} from '../../utils/api-utils';
import {
  formatCurrency,
  formatImageAndText,
  formatNumber,
} from '../../utils/formatting';
import AddXForm from '../../components/formModal';
import { UserInfo_Type, UserSettings_Type } from '../../utils/types';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Title, Text } = Typography;

async function fetchTransactionsData(userInfo: UserInfo_Type) {
  const data = await cachedFetch(`/api/data/get_table_data_basic`, [], 'POST', {
    userId: userInfo.clientPrincipal.userId,
    containerName: 'input_transactions',
  });
  data.forEach((row: any) => {
    row.total_cost = row.cost_per_share * row.quantity;
  });
  return { data: data, loading: false };
}

async function fetchInputInvestedData(userInfo: UserInfo_Type) {
  const data = await cachedFetch(`/api/data/get_table_data_basic`, [], 'POST', {
    userId: userInfo.clientPrincipal.userId,
    containerName: 'input_invested',
  });
  return { data: data, loading: false };
}

export default function Home({
  userInfo,
  userSettings,
}: {
  userInfo: UserInfo_Type;
  userSettings: UserSettings_Type;
}) {
  const [InputTransactionsData, setInputTransactionsData]: any = useState();
  const [InputTransactionsDataisLoading, setInputTransactionsDataisLoading] =
    useState(true);
  const [InputTransactionsSearchText, setInputTransactionsSearchText] =
    useState<any>();
  const [InputInvestedData, setInputInvestedData]: any = useState();
  const [InputInvestedDataisLoading, setInputInvestedDataisLoading] =
    useState(true);
  const [InputInvestedSearchText, setInputInvestedSearchText] =
    useState<any>(undefined);

  // columns
  const InputInvestedColumns: ColumnsType = [
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
        formatCurrency({ value: text, currency: userSettings.currency }),
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
            deleteData(userInfo, [record.id], 'input_invested');
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

  const InputTransactionsColumns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string, record: any) => (
        <div className="min-w-16">
          {formatImageAndText(text, record.meta.name, record.meta.logo)}
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
      render: (text: string, record: any) => (
        <Popconfirm
          title="Are you sure you want to delete this item?"
          onConfirm={() => {
            deleteData(userInfo, [record.id], 'input_transactions');
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

  useEffect(() => {
    if (userInfo.clientPrincipal.userId !== '') {
      fetchTransactionsData(userInfo).then(({ data, loading }) => {
        setInputTransactionsData(data);
        setInputTransactionsDataisLoading(loading);
      });
      fetchInputInvestedData(userInfo).then(({ data, loading }) => {
        setInputInvestedData(data);
        setInputInvestedDataisLoading(loading);
      });
    }
  }, [userInfo]);

  async function deleteData(
    userInfo: UserInfo_Type,
    id: string[],
    container: 'input_invested' | 'input_transactions'
  ) {
    await ApiWithMessage(
      `/api/delete/delete_input_items`,
      'Deleting item',
      'Item deleted',
      'POST',
      {
        itemIds: id,
        container: container,
        userId: userInfo.clientPrincipal.userId,
      },
      'application/json'
    ).then(() => {
      if (container === 'input_invested') {
        const newData = InputInvestedData.filter(
          (item: any) => !id.includes(item.id)
        );
        setInputInvestedData(newData);
      } else if (container === 'input_transactions') {
        const newData = InputTransactionsData.filter(
          (item: any) => !id.includes(item.id)
        );
        setInputTransactionsData(newData);
      }
      overWriteTableData(container);
    });
  }

  async function overWriteTableData(
    container: 'input_invested' | 'input_transactions'
  ): Promise<void> {
    overwriteCachedFetch(`/api/data/get_table_data_basic`, [], 'POST', {
      userId: userInfo.clientPrincipal.userId,
      containerName: container,
    }).then((data) => {
      if (container === 'input_invested') setInputInvestedData(data);
      else if (container === 'input_transactions')
        setInputTransactionsData(data);
    });
  }

  // Render
  return (
    <div>
      <Title className="flex items-center justify-center p-5" level={1}>
        Actions
      </Title>
      <Divider plain></Divider>
      <div>
        <Title className="mb-3" level={2}>
          Stock Transactions
        </Title>
        <AntdTable
          isLoading={InputTransactionsDataisLoading}
          columns={InputTransactionsColumns}
          data={InputTransactionsData}
          globalSorter={true}
          searchEnabled={true}
          searchText={InputTransactionsSearchText}
          tableProps={{
            size: 'small',
            pagination: {
              pageSize: 12,
              size: 'small',
              hideOnSinglePage: true,
              className: 'm-0',
            },
          }}
          caption={
            <div className="flex mx-1 mb-1">
              <div>
                <Search
                  allowClear
                  placeholder="Search"
                  onChange={(e) => {
                    setInputTransactionsSearchText([e.target.value]);
                  }}
                  onSearch={(value) => {
                    setInputTransactionsSearchText([value]);
                  }}
                  className="max-w-xs"
                />
              </div>
              <div className="mb-1 ml-auto">
                <AddXForm
                  form={'addStock'}
                  parentCallback={overWriteTableData}
                  userSettings={userSettings}
                />
              </div>
            </div>
          }
        />
        <Divider plain></Divider>
        <div>
          <Title className="mb-3" level={2}>
            Money Transactions
          </Title>
          <AntdTable
            isLoading={InputInvestedDataisLoading}
            columns={InputInvestedColumns}
            data={InputInvestedData}
            globalSorter={true}
            searchEnabled={true}
            searchText={InputInvestedSearchText}
            tableProps={{
              size: 'small',
              pagination: {
                pageSize: 12,
                size: 'small',
                hideOnSinglePage: true,
                className: 'm-0',
              },
            }}
            caption={
              <div className="flex mx-1 mb-1">
                <div>
                  <Search
                    allowClear
                    placeholder="Search"
                    onChange={(e) => {
                      setInputInvestedSearchText([e.target.value]);
                    }}
                    onSearch={(value) => {
                      setInputInvestedSearchText([value]);
                    }}
                    className="max-w-xs"
                  />
                </div>
                <div className="ml-auto">
                  <AddXForm
                    form={'addTransaction'}
                    parentCallback={overWriteTableData}
                    userSettings={userSettings}
                  />
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
