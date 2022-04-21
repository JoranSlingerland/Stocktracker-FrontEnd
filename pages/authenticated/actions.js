import { Divider, Table } from 'antd';
import { useState, useEffect } from 'react';
import PrimeFaceTable from '../../components/PrimeFaceTable';

const InputTransactionscolumns = [
  {
    header: 'Transaction Date',
    field: 'transaction_date',
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
];

const InputInvestedscolumns = [
  {
    header: 'Transaction Type',
    field: 'transaction_type',
  },
  {
    header: 'Transaction Date',
    field: 'transaction_date',
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
              <PrimeFaceTable
                loading={InputTransactionsDataisLoading}
                columns={InputTransactionscolumns}
                data={InputTransactionsData}
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
