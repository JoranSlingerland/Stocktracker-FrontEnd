import { Divider, Table } from 'antd';
import { useState, useEffect } from 'react';

const stocktransactionscolumns = [
  {
    title: 'uid',
    dataIndex: 'uid',
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

export default function Home() {
  const [Data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/get_table_data/input_transactions');
      const Data = await response.json();
      setData(Data);
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
              <Table columns={stocktransactionscolumns} dataSource={Data} />
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
              {/* <Table columns={moneytransactionscolumns} dataSource={data} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
