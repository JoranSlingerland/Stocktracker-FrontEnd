import { Tabs, Collapse, Typography } from 'antd';
import { useEffect, useState } from 'react';
import PieChart from '../../components/PrimeFacePieChart';
import AntdTable from '../../components/antdTable';
import { cachedFetch } from '../../utils/api-utils';
import {
  formatCurrency,
  formatCurrencyWithColors,
  formatPercentageWithColors,
  formatNumber,
  formatImageAndText,
} from '../../utils/formatting';
import { UserInfo_Type, UserSettings_Type } from '../../utils/types';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

const { Panel } = Collapse;

const fallbackObject = {
  labels: [],
  data: [],
  color: [],
};

async function fetchUnRealizedData(userInfo: UserInfo_Type) {
  const data = await cachedFetch(`/api/data/get_table_data_basic`, [], 'POST', {
    userId: userInfo.clientPrincipal.userId,
    containerName: 'stocks_held',
    fullyRealized: false,
  });
  return { data: data, loading: false };
}

async function fetchRealizedData(userInfo: UserInfo_Type) {
  const data = await cachedFetch(`/api/data/get_table_data_basic`, [], 'POST', {
    userId: userInfo.clientPrincipal.userId,
    containerName: 'stocks_held',
    fullyRealized: true,
    partialRealized: true,
    andOr: 'or',
  });
  return { data: data, loading: false };
}

async function fetchStockPieData(userInfo: UserInfo_Type) {
  const data = await cachedFetch(
    `/api/data/get_pie_data`,
    fallbackObject,
    'POST',
    {
      userId: userInfo.clientPrincipal.userId,
      dataType: 'stocks',
    }
  );
  return { data: data, loading: false };
}

async function fetchCurrencyPieData(userInfo: UserInfo_Type) {
  const data = await cachedFetch(
    `/api/data/get_pie_data`,
    fallbackObject,
    'POST',
    {
      userId: userInfo.clientPrincipal.userId,
      dataType: 'currency',
    }
  );
  return { data: data, loading: false };
}

async function fetchSectorPieData(userInfo: UserInfo_Type) {
  const data = await cachedFetch(
    `/api/data/get_pie_data`,
    fallbackObject,
    'POST',
    {
      userId: userInfo.clientPrincipal.userId,
      dataType: 'sector',
    }
  );
  return { data: data, loading: false };
}

async function fetchCountryPieData(userInfo: UserInfo_Type) {
  const data = await cachedFetch(
    `/api/data/get_pie_data`,
    fallbackObject,
    'POST',
    {
      userId: userInfo.clientPrincipal.userId,
      dataType: 'country',
    }
  );
  return { data: data, loading: false };
}

export default function Home({
  userInfo,
  userSettings,
}: {
  userInfo: UserInfo_Type;
  userSettings: UserSettings_Type;
}) {
  // Const setup
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

  // Fetch data on page load
  useEffect(() => {
    if (userInfo.clientPrincipal.userId !== '') {
      fetchUnRealizedData(userInfo).then(({ data, loading }) => {
        setUnRealizedData(data);
        setUnRealizedDataisLoading(loading);
      });
      fetchRealizedData(userInfo).then(({ data, loading }) => {
        setRealizedData(data);
        setRealizedDataisLoading(loading);
      });
      fetchStockPieData(userInfo).then(({ data, loading }) => {
        setStockPieData(data);
        setStockPieDataisLoading(loading);
      });
      fetchCurrencyPieData(userInfo).then(({ data, loading }) => {
        setCurrencyPieData(data);
        setCurrencyPieDataisLoading(loading);
      });
      fetchSectorPieData(userInfo).then(({ data, loading }) => {
        setSectorPieData(data);
        setSectorPieDataisLoading(loading);
      });
      fetchCountryPieData(userInfo).then(({ data, loading }) => {
        setCountryPieData(data);
        setCountryPieDataisLoading(loading);
      });
    }
  }, [userInfo]);

  // Tabs setup
  const items = [
    {
      key: '1',
      label: 'Stocks',
      children: (
        <PieChart
          data={StockPieData}
          isloading={StockPieDataisLoading}
          userSettings={userSettings}
        />
      ),
    },
    {
      key: '2',
      label: 'Sector',
      children: (
        <PieChart
          data={SectorPieData}
          isloading={SectorPieDataisLoading}
          userSettings={userSettings}
        />
      ),
    },
    {
      key: '3',
      label: 'Country',
      children: (
        <PieChart
          data={CountryPieData}
          isloading={CountryPieDataisLoading}
          userSettings={userSettings}
        />
      ),
    },
    {
      key: '4',
      label: 'Currency',
      children: (
        <PieChart
          data={CurrencyPieData}
          isloading={CurrencyPieDataisLoading}
          userSettings={userSettings}
        />
      ),
    },
  ];

  // Columns

  const UnRealizedColumns: ColumnsType = [
    {
      title: 'symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string, record: any) =>
        formatImageAndText(text, record.meta.logo),
    },
    {
      title: 'Name',
      dataIndex: 'meta',
      key: 'meta.name',
      render: (text: { name: any }) => text.name,
      responsive: ['lg'],
    },
    {
      title: 'Quantity',
      dataIndex: 'unrealized',
      key: 'unrealized.quantity',
      render: (text: { quantity: string | number }) =>
        formatNumber(text.quantity),
    },
    {
      title: 'Total Cost',
      dataIndex: 'unrealized',
      key: 'unrealized.total_cost',
      render: (text: { total_cost: string | number }) =>
        formatCurrency({
          value: text.total_cost,
          currency: userSettings.currency,
        }),
      responsive: ['md'],
    },
    {
      title: 'Profit / Loss',
      dataIndex: 'unrealized',
      key: 'unrealized.total_pl',
      render: (text: { total_pl: string | number }) =>
        formatCurrencyWithColors({
          value: text.total_pl,
          currency: userSettings.currency,
        }),
    },
    {
      title: 'Percentage',
      dataIndex: 'unrealized',
      key: 'unrealized.total_pl_percentage',
      render: (text: { total_pl_percentage: string | number }) =>
        formatPercentageWithColors(text.total_pl_percentage),
      responsive: ['sm'],
    },
    {
      title: 'Total Value',
      dataIndex: 'unrealized',
      key: 'unrealized.total_value',
      render: (text: { total_value: string | number }) =>
        formatCurrency({
          value: text.total_value,
          currency: userSettings.currency,
        }),
    },
  ];

  const RealizedColumns: ColumnsType = [
    {
      title: 'symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string, record: any) =>
        formatImageAndText(text, record.meta.logo),
    },
    {
      title: 'Name',
      dataIndex: 'meta',
      key: 'meta.name',
      render: (text: { name: any }) => text.name,
      responsive: ['lg'],
    },
    {
      title: 'Quantity',
      dataIndex: 'realized',
      key: 'realized.quantity',
      render: (text: { quantity: string | number }) =>
        formatNumber(text.quantity),
    },
    {
      title: 'Total Cost',
      dataIndex: 'realized',
      key: 'realized.buy_price',
      render: (text: { buy_price: string | number }) =>
        formatCurrency({
          value: text.buy_price,
          currency: userSettings.currency,
        }),
      responsive: ['md'],
    },
    {
      title: 'Profit / Loss',
      dataIndex: 'realized',
      key: 'realized.total_pl',
      render: (text: { total_pl: string | number }) =>
        formatCurrencyWithColors({
          value: text.total_pl,
          currency: userSettings.currency,
        }),
    },
    {
      title: 'Percentage',
      dataIndex: 'realized',
      key: 'realized.total_pl_percentage',
      render: (text: { total_pl_percentage: string | number }) =>
        formatPercentageWithColors(text.total_pl_percentage),
      responsive: ['sm'],
    },
    {
      title: 'Sell Price',
      dataIndex: 'realized',
      key: 'realized.sell_price',
      render: (text: { sell_price: string | number }) =>
        formatCurrency({
          value: text.sell_price,
          currency: userSettings.currency,
        }),
    },
  ];

  // Render
  return (
    <div>
      {/* Title */}
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
          <Panel className="p-0" header="Realized Stocks" key="1">
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
