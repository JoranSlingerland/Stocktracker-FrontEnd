// pages\authenticated\actions.js

import { Divider } from 'antd';
import { useState, useEffect } from 'react';
import PrimeFaceTable from '../../components/PrimeFaceTable';
import { cachedFetch, ovewriteCachedFetch } from '../../utils/api-utils.js';

const InputTransactionscolumns = [
  {
    header: 'Transaction Date',
    field: 'date',
  },
  {
    header: 'Symbol',
    field: 'symbol',
  },
  {
    header: 'Cost',
    field: 'cost',
  },
  {
    header: 'Quantity',
    field: 'quantity',
  },
  {
    header: 'Transaction Type',
    field: 'transaction_type',
  },
  {
    header: 'Transaction Cost',
    field: 'transaction_cost',
  },
  {
    header: 'Currency',
    field: 'currency',
  },
  {
    header: 'Domain',
    field: 'domain',
  },
];

const InputInvestedscolumns = [
  {
    header: 'Transaction Date',
    field: 'date',
  },
  {
    header: 'Transaction Type',
    field: 'transaction_type',
  },
  {
    header: 'Amount',
    field: 'amount',
  },
];

export default function Home() {
  const [InputTransactionsData, setInputTransactionsData] = useState(null);
  const [InputTransactionsDataisLoading, setInputTransactionsDataisLoading] =
    useState(true);
  const [InputInvestedData, setInputInvestedData] = useState(null);
  const [InputInvestedDataisLoading, setInputInvestedDataisLoading] =
    useState(true);

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
    setInputTransactionsDataisLoading(true);
    ovewriteCachedFetch(`/api/get_table_data_basic/input_transactions`).then(
      (data) => {
        setInputTransactionsData(data);
        setInputTransactionsDataisLoading(false);
      }
    );
  }

  async function callback_invested() {
    setInputInvestedDataisLoading(true);
    ovewriteCachedFetch(`/api/get_table_data_basic/input_invested`).then(
      (data) => {
        setInputInvestedData(data);
        setInputInvestedDataisLoading(false);
      }
    );
  }

  // Render
  return (
    <div>
      {/* Titel */}
      <div>
        <h1 className="flex items-center justify-center p-5 text-3xl py">
          Actions
        </h1>
      </div>
      <Divider plain></Divider>
      {/* Content */}
      <div>
        {/* stock transactions */}
        <div>
          {/* Header */}
          <div>
            <h2 className="flex items-center justify-start px-3 text-3xl py">
              Stock Transactions
            </h2>
          </div>
          {/* Table */}
          <div>
            <div>
              <PrimeFaceTable
                loading={InputTransactionsDataisLoading}
                columns={InputTransactionscolumns}
                data={InputTransactionsData}
                allowAdd={true}
                form={'addStock'}
                parentCallback={callback_transactions}
              />
            </div>
          </div>
        </div>
        <Divider plain></Divider>
        {/* invested transactions */}
        <div>
          {/* Header */}
          <div>
            <h2 className="flex items-center justify-start px-3 pt-3 text-3xl py">
              Money Transactions
            </h2>
          </div>
          {/* Table */}
          <div>
            <div>
              <PrimeFaceTable
                loading={InputInvestedDataisLoading}
                columns={InputInvestedscolumns}
                data={InputInvestedData}
                allowAdd={true}
                form={'addTransaction'}
                parentCallback={callback_invested}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
