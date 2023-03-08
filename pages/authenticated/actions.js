// pages\authenticated\actions.js

import { Divider, Input } from 'antd';
import { useState, useEffect } from 'react';
import AntdTable from '../../components/antdTable';
import { cachedFetch, ovewriteCachedFetch } from '../../utils/api-utils.js';
import {
  formatCurrency,
  formatImageAndText,
  formatNumber,
} from '../../utils/formatting.js';
import AddXForm from '../../components/formModal';

const { Search } = Input;

const InputTransactionscolumns = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (text, record) => formatImageAndText(text, record.meta.logo),
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
    render: (text) => formatCurrency(text),
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (text) => formatNumber(text),
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
    render: (text) => formatCurrency(text),
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

const InputInvestedscolumns = [
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
    render: (text) => formatCurrency(text),
  },
];

export default function Home() {
  const [InputTransactionsData, setInputTransactionsData] = useState(null);
  const [InputTransactionsDataisLoading, setInputTransactionsDataisLoading] =
    useState(true);
  const [InputTransactionsSearchText, setInputTransactionsSearchText] =
    useState(null);
  const [InputInvestedData, setInputInvestedData] = useState(null);
  const [InputInvestedDataisLoading, setInputInvestedDataisLoading] =
    useState(true);
  const [InputInvestedSearchText, setInputInvestedSearchText] = useState(null);

  // Fetch data
  async function fetchTransactionsData() {
    cachedFetch(`/api/get_table_data_basic/input_transactions`).then((data) => {
      setInputTransactionsData(data);
      setInputTransactionsDataisLoading(false);
    });
  }

  async function fetchInputInvestedData() {
    cachedFetch(`/api/get_table_data_basic/input_invested`).then((data) => {
      setInputInvestedData(data);
      setInputInvestedDataisLoading(false);
    });
  }

  // Fetch data on mount
  useEffect(() => {
    fetchTransactionsData();
    fetchInputInvestedData();
  }, []);

  // Callbacks
  async function callback_transactions() {
    ovewriteCachedFetch(`/api/get_table_data_basic/input_transactions`).then(
      (data) => {
        setInputTransactionsData(data);
      }
    );
  }

  async function callback_invested() {
    ovewriteCachedFetch(`/api/get_table_data_basic/input_invested`).then(
      (data) => {
        setInputInvestedData(data);
      }
    );
  }

  // Render
  return (
    <div>
      <h1 className="flex items-center justify-center p-5 text-3xl py">
        Actions
      </h1>
      <Divider plain></Divider>
      <div>
        <h2 className="mb-3 text-3xl">Stock Transactions</h2>
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
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 12,
              size: 'small',
              hideOnSinglePage: true,
              className: 'm-0',
            },
          }}
          caption={
            <div className="flex">
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
              <AddXForm
                form={'addStock'}
                parentCallback={callback_transactions}
              />
            </div>
          }
        />
        <Divider plain></Divider>
        <div>
          <h2 className="mb-3 text-3xl">Money Transactions</h2>
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
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 12,
                size: 'small',
                hideOnSinglePage: true,
                className: 'm-0',
              },
            }}
            caption={
              <div className="flex">
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
                <div className="ml-auto mr-0">
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
