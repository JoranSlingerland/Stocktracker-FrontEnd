import { Divider, Input, Typography } from 'antd';
import { useState, useEffect } from 'react';
import AntdTable from '../../components/antdTable';
import {
  cachedFetch,
  ovewriteCachedFetch,
  regularFetch,
} from '../../utils/api-utils';
import {
  formatCurrency,
  formatImageAndText,
  formatNumber,
} from '../../utils/formatting';
import AddXForm from '../../components/formModal';
import { UserInfo_Type } from '../../utils/types';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Title } = Typography;

const InputTransactionscolumns: ColumnsType = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (text: string, record: any) =>
      formatImageAndText(text, record.meta.logo),
  },
  {
    title: 'Transaction Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Cost',
    dataIndex: 'cost',
    key: 'cost',
    render: (text: string | number) => formatCurrency(text),
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (text: string | number) => formatNumber(text),
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
    render: (text: string | number) => formatCurrency(text),
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
  },
  {
    title: 'Domain',
    dataIndex: 'domain',
    key: 'domain',
  },
];

const InputInvestedscolumns: ColumnsType = [
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
    render: (text: string | number) => formatCurrency(text),
  },
];

async function fetchTransactionsData(userInfo: UserInfo_Type) {
  const data = await cachedFetch(`/api/data/get_table_data_basic`, [], 'POST', {
    userId: userInfo.clientPrincipal.userId,
    containerName: 'input_transactions',
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

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo_Type>({
    clientPrincipal: {
      userId: '',
      userRoles: ['anonymous'],
      claims: [],
      identityProvider: '',
      userDetails: '',
    },
  });
  const [InputTransactionsData, setInputTransactionsData] = useState(null);
  const [InputTransactionsDataisLoading, setInputTransactionsDataisLoading] =
    useState(true);
  const [InputTransactionsSearchText, setInputTransactionsSearchText] =
    useState<any>();
  const [InputInvestedData, setInputInvestedData] = useState(null);
  const [InputInvestedDataisLoading, setInputInvestedDataisLoading] =
    useState(true);
  const [InputInvestedSearchText, setInputInvestedSearchText] =
    useState<any>(undefined);

  // Fetch data
  async function getUserInfo() {
    await regularFetch('/.auth/me', undefined).then((data) => {
      setUserInfo(data);
    });
  }

  // Fetch data on mount
  useEffect(() => {
    getUserInfo();
  }, []);

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

  // Callbacks
  async function callback_transactions() {
    ovewriteCachedFetch(`/api/data/get_table_data_basic`, [], 'POST', {
      userId: userInfo.clientPrincipal.userId,
      containerName: 'input_transactions',
    }).then((data) => {
      setInputTransactionsData(data);
    });
  }

  async function callback_invested() {
    ovewriteCachedFetch(`/api/data/get_table_data_basic`, [], 'POST', {
      userId: userInfo.clientPrincipal.userId,
      containerName: 'input_invested',
    }).then((data) => {
      setInputInvestedData(data);
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
          columns={InputTransactionscolumns}
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
                  parentCallback={callback_transactions}
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
            columns={InputInvestedscolumns}
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
                    parentCallback={callback_invested}
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
