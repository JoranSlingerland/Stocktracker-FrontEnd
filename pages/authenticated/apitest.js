import { useState, useEffect } from 'react';

export default function apitest() {
  const [isLoading, setIsLoading] = useState(true);
  const [Data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/get_table_data/input_transactions');
      const data = await response.json();
      setData(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <div>
        <h2>dashboard</h2>
        <h2>test - {Data[0].symbol}</h2>
      </div>
      <div>
        <h2>dashboard 2</h2>
        {Data &&
          Data.length > 0 &&
          Data.map((Data) => (
            <div key={Data.uid}>
              <h3>
                {' '}
                {Data.symbol} - {Data.transaction_date}{' '}
              </h3>
            </div>
          ))}
      </div>
    </div>
  );
}
