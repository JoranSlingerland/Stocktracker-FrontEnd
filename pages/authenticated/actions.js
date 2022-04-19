import { Divider, Table } from 'antd';
import { useState, useEffect } from 'react';

const InputTransactionscolumns = [
  {
    title: 'Transaction Date',
    dataIndex: 'transaction_date',
  },
  {
    title: 'Symbol',
    dataIndex: 'symbol',
  },
  {
    title: 'Cost',
    dataIndex: 'cost',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
  },
  {
    title: 'Transaction Type',
    dataIndex: 'transaction_type',
  },
  {
    title: 'Transaction Cost',
    dataIndex: 'transaction_cost',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
  },
];

const InputInvestedscolumns = [
  {
    title: 'Transaction Type',
    dataIndex: 'transaction_type',
  },
  {
    title: 'Transaction Date',
    dataIndex: 'transaction_date',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
  },
];

export default function Home() {
  const [InputTransactionsData, setInputTransactionsData] = useState(null);
  const [InputTransactionsDataisLoading, setInputTransactionsDataisLoading] =
    useState(true);
  const [InputInvestedData, setInputInvestedData] = useState(null);
  const [InputInvestedDataisLoading, setInputInvestedDataisLoading] =
    useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/get_table_data/input_transactions`);
      const InputTransactionsData = await response.json();
      setInputTransactionsData(InputTransactionsData);
      setInputTransactionsDataisLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/get_table_data/input_invested`);
      const InputInvestedData = await response.json();
      setInputInvestedData(InputInvestedData);
      setInputInvestedDataisLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="w-full">
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
              <Table
                loading={InputTransactionsDataisLoading}
                columns={InputTransactionscolumns}
                dataSource={InputTransactionsData}
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
              <Table
                loading={InputInvestedDataisLoading}
                columns={InputInvestedscolumns}
                dataSource={InputInvestedData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
