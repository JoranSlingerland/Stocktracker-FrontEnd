// pages\authenticated\portfolio.js

import { Tabs, Collapse, Typography } from 'antd';
import { useEffect, useState } from 'react';
import PieChart from '../../components/PrimeFacePieChart';
import AntdTable from '../../components/antdTable';
import { cachedFetch, regularFetch } from '../../utils/api-utils.js';
import {
  formatCurrency,
  formatCurrencyWithColors,
  formatPercentageWithColors,
  formatNumber,
  formatImageAndText,
} from '../../utils/formatting.js';

const { Title } = Typography;

const { Panel } = Collapse;

const UnRealizedColumns = [
  {
    title: 'symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (text, record) => formatImageAndText(text, record.meta.logo),
  },
  {
    title: 'Name',
    dataIndex: 'meta',
    key: 'meta.name',
    render: (text) => text.name,
  },
  {
    title: 'Quantity',
    dataIndex: 'unrealized',
    key: 'unrealized.quantity',
    render: (text) => formatNumber(text.quantity),
  },
  {
    title: 'Total Cost',
    dataIndex: 'unrealized',
    key: 'unrealized.total_cost',
    render: (text) => formatCurrency(text.total_cost),
  },
  {
    title: 'Profit / Loss',
    dataIndex: 'unrealized',
    key: 'unrealized.total_pl',
    render: (text) => formatCurrencyWithColors(text.total_pl),
  },
  {
    title: 'Percentage',
    dataIndex: 'unrealized',
    key: 'unrealized.total_pl_percentage',
    render: (text) => formatPercentageWithColors(text.total_pl_percentage),
  },
  {
    title: 'Total Value',
    dataIndex: 'unrealized',
    key: 'unrealized.total_value',
    render: (text) => formatCurrency(text.total_value),
  },
];

const RealizedColumns = [
  {
    title: 'symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (text, record) => formatImageAndText(text, record.meta.logo),
  },
  {
    title: 'Name',
    dataIndex: 'meta',
    key: 'meta.name',
    render: (text) => text.name,
  },
  {
    title: 'Quantity',
    dataIndex: 'realized',
    key: 'realized.quantity',
    render: (text) => formatNumber(text.quantity),
  },
  {
    title: 'Total Cost',
    dataIndex: 'realized',
    key: 'realized.buy_price',
    render: (text) => formatCurrency(text.buy_price),
  },
  {
    title: 'Profit / Loss',
    dataIndex: 'realized',
    key: 'realized.total_pl',
    render: (text) => formatCurrencyWithColors(text.total_pl),
  },
  {
    title: 'Percentage',
    dataIndex: 'realized',
    key: 'realized.total_pl_percentage',
    render: (text) => formatPercentageWithColors(text.total_pl_percentage),
  },
  {
    title: 'Sell Price',
    dataIndex: 'realized',
    key: 'realized.sell_price',
    render: (text) => formatCurrency(text.sell_price),
  },
];

const fallbackObject = {
  labels: [],
  data: [],
  color: [],
};

export default function Home() {
  // Const setup
  const [userInfo, setUserInfo] = useState(null);
  const [UnRealizedData, setUnRealizedData] = useState([null]);
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
  async function getUserInfo() {
    await regularFetch('/.auth/me', undefined).then((data) => {
      setUserInfo(data);
    });
  }

  async function fetchUnRealizedData() {
    cachedFetch(
      `/api/get_table_data_basic/single_day`,
      [],
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
      [],
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
    cachedFetch(`/api/get_pie_data/stocks`, fallbackObject, 'POST', {
      userId: userInfo.clientPrincipal.userId,
    }).then((data) => {
      setStockPieData(data);
      setStockPieDataisLoading(false);
    });
  }

  async function fetchCurrencyPieData() {
    cachedFetch(`/api/get_pie_data/currency`, fallbackObject, 'POST', {
      userId: userInfo.clientPrincipal.userId,
    }).then((data) => {
      setCurrencyPieData(data);
      setCurrencyPieDataisLoading(false);
    });
  }

  async function fetchSectorPieData() {
    cachedFetch(`/api/get_pie_data/sector`, fallbackObject, 'POST', {
      userId: userInfo.clientPrincipal.userId,
    }).then((data) => {
      setSectorPieData(data);
      setSectorPieDataisLoading(false);
    });
  }

  async function fetchCountryPieData() {
    cachedFetch(`/api/get_pie_data/country`, fallbackObject, 'POST', {
      userId: userInfo.clientPrincipal.userId,
    }).then((data) => {
      setCountryPieData(data);
      setCountryPieDataisLoading(false);
    });
  }

  // Fetch data on page load
  useEffect(() => {
    fetchUnRealizedData();
    fetchRealizedData();
    getUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetchStockPieData();
      fetchCurrencyPieData();
      fetchSectorPieData();
      fetchCountryPieData();
    }
  }, [userInfo]);

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
        <Title className="flex items-center justify-center pt-5" level={1}>
          Portfolio
        </Title>
      </div>
      {/* Tabs */}
      <div>
        <Tabs type="line" defaultActiveKey="1" items={items} />
      </div>
      {/* Table */}
      <div>
        <AntdTable
          columns={UnRealizedColumns}
          data={UnRealizedData}
          isLoading={UnRealizedDataisLoading}
          globalSorter={true}
        />
      </div>
      {/* Table */}
      <div>
        <Collapse bordered={false} ghost>
          <Panel className="p-0" header="Realized Stocks">
            <AntdTable
              columns={RealizedColumns}
              data={RealizedData}
              isLoading={RealizedDataisLoading}
              globalSorter={true}
            />
          </Panel>
        </Collapse>
      </div>
    </div>
  );
}
