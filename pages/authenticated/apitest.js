import React, { useState, useEffect } from 'react';
import PrimeFaceTable from '../../components/PrimeFaceTable';

export default function app() {
  const [InputInvestedData, setInputInvestedData] = useState(null);
  const [InputInvestedDataisLoading, setInputInvestedDataisLoading] =
    useState(true);

  const InputInvestedscolumns = [
    {
      field: 'transaction_type',
      header: 'Transaction Type',
    },
    {
      field: 'transaction_date',
      header: 'Transaction Date',
    },
    {
      field: 'amount',
      header: 'Amount',
    },
  ];

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
    <div>
      <PrimeFaceTable
        data={InputInvestedData}
        columns={InputInvestedscolumns}
        loading={InputInvestedDataisLoading}
      />
    </div>
  );
}
