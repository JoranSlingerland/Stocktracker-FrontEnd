// pages\authenticated\portfolio.js

import { Divider, Tabs } from 'antd';
import { useState, useEffect } from 'react';
import PieChart from '../../components/PrimeFacePieChart';
import PrimeFaceTable from '../../components/PrimeFaceTable';
import { cachedFetch } from '../../utils/api-utils.js';

const { TabPane } = Tabs;

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
      cachedFetch(`/api/get_table_data_basic/single_day`).then((data) => {
        setSingleDayData(data);
        setSingleDayDataisLoading(false);
      });
    }
    fetchData();
  }, []);

  // Get stock pie chart data
  const [StockPieData, setStockPieData] = useState({
    labels: [],
    data: [],
    color: [],
  });
  const [StockPieDataisLoading, setStockPieDataisLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      cachedFetch(`/api/get_pie_data/stocks`, 24, StockPieData).then((data) => {
        setStockPieData(data);
        setStockPieDataisLoading(false);
      });
    }
    fetchData();
  }, []);

  // Get currency pie chart data
  const [CurrencyPieData, setCurrencyPieData] = useState({
    labels: [],
    data: [],
    color: [],
  });
  const [CurrencyPieDataisLoading, setCurrencyPieDataisLoading] =
    useState(true);

  useEffect(() => {
    async function fetchData() {
      cachedFetch(`/api/get_pie_data/currency`, 24, CurrencyPieData).then(
        (data) => {
          setCurrencyPieData(data);
          setCurrencyPieDataisLoading(false);
        }
      );
    }
    fetchData();
  }, []);

  // Get sector pie chart data
  const [SectorPieData, setSectorPieData] = useState({
    labels: [],
    data: [],
    color: [],
  });
  const [SectorPieDataisLoading, setSectorPieDataisLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      cachedFetch(`/api/get_pie_data/sector`, 24, SectorPieData).then(
        (data) => {
          setSectorPieData(data);
          setSectorPieDataisLoading(false);
        }
      );
    }
    fetchData();
  }, []);

  // Get country pie chart data
  const [CountryPieData, setCountryPieData] = useState({
    labels: [],
    data: [],
    color: [],
  });
  const [CountryPieDataisLoading, setCountryPieDataisLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      cachedFetch(`/api/get_pie_data/country`, 24, CountryPieData).then(
        (data) => {
          setCountryPieData(data);
          setCountryPieDataisLoading(false);
        }
      );
    }
    fetchData();
  }, []);

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
