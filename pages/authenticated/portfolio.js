// pages\authenticated\portfolio.js

import { Divider, Tabs, Collapse } from 'antd';
import { useEffect, useState } from 'react';
import PieChart from '../../components/PrimeFacePieChart';
import PrimeFaceTable from '../../components/PrimeFaceTable';
import { cachedFetch } from '../../utils/api-utils.js';

const { Panel } = Collapse;

const UnRealizedColumns = [
  {
    header: 'Symbol',
    field: 'symbol',
  },
  {
    header: 'Name',
    field: 'meta.name',
  },
  {
    header: 'Quantity',
    field: 'unrealized.quantity',
  },
  {
    header: 'Total Cost',
    field: 'unrealized.total_cost',
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
    header: 'Total Value',
    field: 'unrealized.total_value',
  },
];

const RealizedColumns = [
  {
    header: 'Symbol',
    field: 'symbol',
  },
  {
    header: 'Name',
    field: 'meta.name',
  },
  {
    header: 'Quantity',
    field: 'realized.quantity',
  },
  {
    header: 'Total Cost',
    field: 'realized.buy_price',
  },
  {
    header: 'Profit / Loss',
    field: 'realized.total_pl',
  },
  {
    header: 'Percentage',
    field: 'realized.total_pl_percentage',
  },
  {
    header: 'Sell Price',
    field: 'realized.sell_price',
  },
];

const fallbackObject = {
  labels: [],
  data: [],
  color: [],
};

export default function Home() {
  // Const setup
  const [UnRealizedData, setUnRealizedData] = useState(null);
  const [UnRealizedDataisLoading, setUnRealizedDataisLoading] = useState(true);
  const [RealizedData, setRealizedData] = useState(null);
  const [RealizedDataisLoading, setRealizedDataisLoading] = useState(true);
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
  async function fetchUnRealizedData() {
    cachedFetch(
      `/api/get_table_data_basic/single_day`,
      24,
      {},
      'POST',
      {
        fully_realized: false,
      },
      '/api/get_table_data_basic/single_day?fully_realized=false'
    ).then((data) => {
      setUnRealizedData(data);
      setUnRealizedDataisLoading(false);
    });
  }

  async function fetchRealizedData() {
    cachedFetch(
      `/api/get_table_data_basic/single_day`,
      24,
      {},
      'POST',
      {
        fully_realized: true,
        partial_realized: true,
        andor: 'or',
      },
      '/api/get_table_data_basic/single_day?fully_realized=true?partial_realized=true?andor=or'
    ).then((data) => {
      setRealizedData(data);
      setRealizedDataisLoading(false);
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
    fetchUnRealizedData();
    fetchRealizedData();
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
      {/* Tabs */}
      <div>
        <Tabs type="line" defaultActiveKey="1" items={items} />
      </div>
      {/* Table */}
      <div>
        <PrimeFaceTable
          loading={UnRealizedDataisLoading}
          columns={UnRealizedColumns}
          data={UnRealizedData}
        />
      </div>
      {/* Table */}
      <div>
        <Collapse bordered={false} ghost>
          <Panel header="Realized Stocks">
            <PrimeFaceTable
              loading={RealizedDataisLoading}
              columns={RealizedColumns}
              data={RealizedData}
            />
          </Panel>
        </Collapse>
      </div>
    </div>
  );
}
