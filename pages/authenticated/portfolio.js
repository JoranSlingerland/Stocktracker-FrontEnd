import { Divider, Table, Tabs } from 'antd';
import { useState, useEffect } from 'react';
import PieChart from '../../components/PieChart';
import PrimeFaceTable from '../../components/PrimeFaceTable';

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

const SingleDaycolumns = [
  {
    header: 'Symbol',
    field: 'symbol',
  },
  {
    header: 'Name',
    field: 'name',
  },
  {
    header: 'Country',
    field: 'country',
  },
  {
    header: 'Average Cost',
    field: 'average_cost',
  },
  {
    header: 'Total Cost',
    field: 'total_cost',
  },
  {
    header: 'Total Value',
    field: 'total_value',
  },
  {
    header: 'Profit / Loss',
    field: 'total_pl',
  },
  {
    header: 'Percentage',
    field: 'total_pl_percentage',
  },
  {
    header: 'Quantity',
    field: 'quantity',
  },
  {
    header: 'Transaction Cost',
    field: 'transaction_cost',
  },
  {
    header: 'Close Value',
    field: 'close_value',
  },
  {
    header: 'Dividends',
    field: 'total_dividends',
  },
];

export default function Home() {
  // get table data
  const [SingleDayData, setSingleDayData] = useState(null);
  const [SingleDayDataisLoading, setSingleDayDataisLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/get_table_data/single_day`);
      const SingleDayData = await response.json();
      setSingleDayData(SingleDayData);
      setSingleDayDataisLoading(false);
    }
    fetchData();
  }, []);

  // Get stock pie chart data
  const [StockPieData, setStockPieData] = useState([{ type: '', value: 0 }]);
  const [StockPieDataisLoading, setStockPieDataisLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/get_pie_data/stocks`);
      const StockPieData = await response.json();
      setStockPieData(StockPieData);
      setStockPieDataisLoading(false);
    }
    fetchData();
  }, []);

  // Get currency pie chart data
  const [CurrencyPieData, setCurrencyPieData] = useState([
    { type: '', value: 0 },
  ]);
  const [CurrencyPieDataisLoading, setCurrencyPieDataisLoading] =
    useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/get_pie_data/currency`);
      const CurrencyPieData = await response.json();
      setCurrencyPieData(CurrencyPieData);
      setCurrencyPieDataisLoading(false);
    }
    fetchData();
  }, []);

  // Get sector pie chart data
  const [SectorPieData, setSectorPieData] = useState([{ type: '', value: 0 }]);
  const [SectorPieDataisLoading, setSectorPieDataisLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/get_pie_data/sector`);
      const SectorPieData = await response.json();
      setSectorPieData(SectorPieData);
      setSectorPieDataisLoading(false);
    }
    fetchData();
  }, []);

  // Get country pie chart data
  const [CountryPieData, setCountryPieData] = useState([
    { type: '', value: 0 },
  ]);
  const [CountryPieDataisLoading, setCountryPieDataisLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/get_pie_data/country`);
      const CountryPieData = await response.json();
      setCountryPieData(CountryPieData);
      setCountryPieDataisLoading(false);
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
      {/* Tabs */}
      <div className="w-fullcard-container">
        <Tabs
          className="tabs-height"
          type="card"
          defaultActiveKey="1"
          onChange={callback}
        >
          <TabPane className="w-full max-w-4xl" tab="Stocks" key="1">
            <PieChart data={StockPieData} isloading={StockPieDataisLoading} />
          </TabPane>
          <TabPane className="w-full max-w-4xl" tab="Country" key="2">
            <PieChart
              data={CountryPieData}
              isloading={CountryPieDataisLoading}
            />
          </TabPane>
          <TabPane className="w-full max-w-4xl" tab="Currency" key="3">
            <PieChart
              data={CurrencyPieData}
              isloading={CurrencyPieDataisLoading}
            />
          </TabPane>
          <TabPane className="w-full max-w-4xl" tab="Sector" key="4">
            <PieChart data={SectorPieData} isloading={SectorPieDataisLoading} />
          </TabPane>
        </Tabs>
      </div>
      <Divider plain></Divider>
      {/* Table */}
      <div className="w-full">
        <PrimeFaceTable
          loading={SingleDayDataisLoading}
          columns={SingleDaycolumns}
          data={SingleDayData}
        />
      </div>
    </div>
  );
}
