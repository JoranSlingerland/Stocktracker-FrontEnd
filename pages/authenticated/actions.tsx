import { Divider, Input, Typography, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect, useReducer } from 'react';
import AntdTable from '../../components/elements/antdTable';
import { apiRequestReducer, initialState } from '../../components/utils/api';
import {
  formatCurrency,
  formatImageAndText,
  formatNumber,
} from '../../components/utils/formatting';
import AddXForm from '../../components/modules/formModal';
import { UserSettings_Type } from '../../components/types/types';
import type { ColumnsType } from 'antd/es/table';
import { getTableDataBasic } from '../../components/services/data';
import { deleteInputItems } from '../../components/services/delete';

const { Search } = Input;
const { Title, Text } = Typography;

export default function Home({
  userSettings,
}: {
  userSettings: UserSettings_Type;
}) {
  const [InputTransactionsData, InputTransactionsDataDispatcher] = useReducer(
    apiRequestReducer,
    initialState({ isLoading: true })
  );
  const [InputTransactionsSearchText, setInputTransactionsSearchText] =
    useState<any>();
  const [InputInvestedData, InputInvestedDataDispatcher] = useReducer(
    apiRequestReducer,
    initialState({ isLoading: true })
  );
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

  useEffect(() => {
    const abortController = new AbortController();

    getTableDataBasic({
      body: {
        containerName: 'input_transactions',
      },
      abortController,
      dispatcher: InputTransactionsDataDispatcher,
    });

    getTableDataBasic({
      body: {
        containerName: 'input_invested',
      },
      abortController,
      dispatcher: InputInvestedDataDispatcher,
    });
    return () => {
      abortController.abort();
    };
  }, []);

  async function deleteData(
    id: string[],
    container: 'input_invested' | 'input_transactions'
  ) {
    await deleteInputItems({
      body: {
        itemIds: id,
        container: container,
      },
    }).then(() => {
      if (container === 'input_invested') {
        const newData = InputInvestedData.data.filter(
          (item: any) => !id.includes(item.id)
        );
        InputInvestedDataDispatcher({
          type: 'FETCH_SUCCESS',
          payload: newData,
        });
      } else if (container === 'input_transactions') {
        const newData = InputTransactionsData.data.filter(
          (item: any) => !id.includes(item.id)
        );
        InputTransactionsDataDispatcher({
          type: 'FETCH_SUCCESS',
          payload: newData,
        });
      }
      overWriteTableData(container);
    });
  }

  async function overWriteTableData(
    container: 'input_invested' | 'input_transactions'
  ): Promise<void> {
    const dispatch =
      container === 'input_invested'
        ? InputInvestedDataDispatcher
        : InputTransactionsDataDispatcher;

    getTableDataBasic({
      body: {
        containerName: container,
      },
      abortController: new AbortController(),
      dispatcher: dispatch,
      overWrite: true,
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
          isLoading={InputTransactionsData.isLoading}
          columns={InputTransactionsColumns}
          data={InputTransactionsData.data}
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
            isLoading={InputInvestedData.isLoading}
            columns={InputInvestedColumns}
            data={InputInvestedData.data}
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
