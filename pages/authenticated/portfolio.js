// pages\authenticated\portfolio.js

import { Divider, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import PieChart from '../../components/PrimeFacePieChart';
import PrimeFaceTable from '../../components/PrimeFaceTable';
import { cachedFetch } from '../../utils/api-utils.js';

const SingleDaycolumns = [
  {
    header: 'Symbol',
    field: 'symbol',
  },
  {
    header: 'Name',
    field: 'meta.name',
  },
  {
    header: 'Country',
    field: 'meta.country',
  },
  {
    header: 'Cost per Share',
    field: 'unrealized.cost_per_share',
  },
  {
    header: 'Total Cost',
    field: 'unrealized.total_cost',
  },
  {
    header: 'Total Value',
    field: 'unrealized.total_value',
  },
  {
    header: 'Profit / Loss',
    field: 'unrealized.total_pl',
  },
  {
    header: 'Percentage',
    field: 'unrealized.total_pl_percentage',
  },
  {
    header: 'Quantity',
    field: 'unrealized.quantity',
  },
  {
    header: 'Transaction Cost',
    field: 'realized.transaction_cost',
  },
  {
    header: 'Close Value',
    field: 'unrealized.close_value',
  },
  {
    header: 'Dividends',
    field: 'realized.total_dividends',
  },
];

const fallbackObject = {
  labels: [],
  data: [],
  color: [],
};

export default function Home() {
  // Const setup
  const [SingleDayData, setSingleDayData] = useState(null);
  const [SingleDayDataisLoading, setSingleDayDataisLoading] = useState(true);
  const [StockPieData, setStockPieData] = useState(fallbackObject);
  const [StockPieDataisLoading, setStockPieDataisLoading] = useState(true);
  const [CurrencyPieData, setCurrencyPieData] = useState(fallbackObject);
  const [CurrencyPieDataisLoading, setCurrencyPieDataisLoading] =
    useState(true);
  const [SectorPieData, setSectorPieData] = useState(fallbackObject);
  const [SectorPieDataisLoading, setSectorPieDataisLoading] = useState(true);
  const [CountryPieData, setCountryPieData] = useState(fallbackObject);
  const [CountryPieDataisLoading, setCountryPieDataisLoading] = useState(true);

  //  Fetch data
  async function fetchSingleDayData() {
    cachedFetch(`/api/get_table_data_basic/single_day`).then((data) => {
      setSingleDayData(data);
      setSingleDayDataisLoading(false);
    });
  }

  async function fetchStockPieData() {
    cachedFetch(`/api/get_pie_data/stocks`, 24, fallbackObject).then((data) => {
      setStockPieData(data);
      setStockPieDataisLoading(false);
    });
  }

  async function fetchCurrencyPieData() {
    cachedFetch(`/api/get_pie_data/currency`, 24, fallbackObject).then(
      (data) => {
        setCurrencyPieData(data);
        setCurrencyPieDataisLoading(false);
      }
    );
  }

  async function fetchSectorPieData() {
    cachedFetch(`/api/get_pie_data/sector`, 24, fallbackObject).then((data) => {
      setSectorPieData(data);
      setSectorPieDataisLoading(false);
    });
  }

  async function fetchCountryPieData() {
    cachedFetch(`/api/get_pie_data/country`, 24, fallbackObject).then(
      (data) => {
        setCountryPieData(data);
        setCountryPieDataisLoading(false);
      }
    );
  }

  // Fetch data on page load
  useEffect(() => {
    fetchSingleDayData();
    fetchStockPieData();
    fetchCurrencyPieData();
    fetchSectorPieData();
    fetchCountryPieData();
  }, []);

  // Tabs setup
  const items = [
    {
      key: '1',
      label: 'Stocks',
      children: (
        <PieChart data={StockPieData} isloading={StockPieDataisLoading} />
      ),
    },
    {
      key: '2',
      label: 'Sector',
      children: (
        <PieChart data={SectorPieData} isloading={SectorPieDataisLoading} />
      ),
    },
    {
      key: '3',
      label: 'Country',
      children: (
        <PieChart data={CountryPieData} isloading={CountryPieDataisLoading} />
      ),
    },
    {
      key: '4',
      label: 'Currency',
      children: (
        <PieChart data={CurrencyPieData} isloading={CurrencyPieDataisLoading} />
      ),
    },
  ];

  // Render
  return (
    <div>
      {/* Titel */}
      <div>
        <h1 className="flex items-center justify-center p-5 text-3xl py">
          Portfolio
        </h1>
      </div>
      <Divider plain></Divider>
      {/* Tabs */}
      <div>
        <Tabs type="card" defaultActiveKey="1" items={items} />
      </div>
      <Divider plain></Divider>
      {/* Table */}
      <div>
        <PrimeFaceTable
          loading={SingleDayDataisLoading}
          columns={SingleDaycolumns}
          data={SingleDayData}
        />
      </div>
    </div>
  );
}
