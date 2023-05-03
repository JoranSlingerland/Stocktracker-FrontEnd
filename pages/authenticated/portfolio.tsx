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

const { Title, Text } = Typography;

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
      title: 'Name',
      dataIndex: 'meta',
      key: 'meta.name',
      fixed: 'left',
      width: 120,
      render: (text: any, record: any) => (
        <div className="min-w-16">
          {formatImageAndText(record.symbol, text.name, record.meta.logo)}
        </div>
      ),
    },
    {
      title: 'Total Cost',
      dataIndex: 'unrealized',
      key: 'unrealized.total_cost',
      render: (text: { total_cost: string | number }, record: any) => (
        <div className="min-w-32">
          <Text strong>
            {formatCurrency({
              value: text.total_cost,
              currency: userSettings.currency,
            })}
          </Text>
          <div className="flex space-x-0.5 flex-row flex-nowrap">
            <Text keyboard> x{formatNumber(record.unrealized.quantity)} </Text>
            <Text type="secondary">
              {formatCurrency({
                value: record.unrealized.cost_per_share,
                currency: userSettings.currency,
              })}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Total Value',
      dataIndex: 'unrealized',
      key: 'unrealized.total_value',
      render: (text: { total_value: string | number }, record: any) => (
        <div className="min-w-32">
          <Text strong>
            {formatCurrency({
              value: text.total_value,
              currency: userSettings.currency,
            })}
          </Text>
          <div className="flex space-x-0.5 flex-row">
            <Text keyboard> x{formatNumber(record.unrealized.quantity)} </Text>
            <Text type="secondary">
              {formatCurrency({
                value: record.unrealized.close_value,
                currency: userSettings.currency,
              })}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Profit / Loss',
      dataIndex: 'unrealized',
      key: 'unrealized.total_pl',
      render: (text) => (
        <div className="min-w-32">
          <div>
            {formatCurrencyWithColors({
              value: text.total_pl,
              currency: userSettings.currency,
            })}
          </div>
          <div>{formatPercentageWithColors(text.total_pl_percentage)}</div>
        </div>
      ),
    },
  ];

  const RealizedColumns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'meta',
      key: 'meta.name',
      fixed: 'left',
      width: 200,
      render: (text, record: any) => (
        <div className="min-w-16">
          {formatImageAndText(record.symbol, text.name, record.meta.logo)}
        </div>
      ),
    },
    {
      title: 'Total Cost',
      dataIndex: 'realized',
      key: 'realized.buy_price',
      render: (text) => (
        <div className="min-w-32">
          <Text strong>
            {formatCurrency({
              value: text.buy_price,
              currency: userSettings.currency,
            })}
          </Text>
          <div className="flex space-x-0.5 flex-row">
            <Text keyboard> x{formatNumber(text.quantity)} </Text>
            <Text type="secondary">
              {formatCurrency({
                value: text.cost_per_share_buy,
                currency: userSettings.currency,
              })}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Realized Price',
      dataIndex: 'realized',
      key: 'realized.sell_price',
      render: (text) => (
        <div className="min-w-32">
          <Text strong>
            {formatCurrency({
              value: text.sell_price,
              currency: userSettings.currency,
            })}
          </Text>
          <div className="flex space-x-0.5 flex-row">
            <Text className="whitespace-nowrap" keyboard>
              x{formatNumber(text.quantity)}{' '}
            </Text>
            <Text type="secondary">
              {formatCurrency({
                value: text.cost_per_share_sell,
                currency: userSettings.currency,
              })}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Profit / Loss',
      dataIndex: 'realized',
      key: 'realized.total_pl',
      render: (text) => (
        <div className="min-w-32">
          <div>
            {formatCurrencyWithColors({
              value: text.total_pl,
              currency: userSettings.currency,
            })}
          </div>
          <div>{formatPercentageWithColors(text.total_pl_percentage)}</div>
        </div>
      ),
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
          tableProps={{
            scroll: true,
          }}
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
              tableProps={{
                scroll: true,
              }}
            />
          </Panel>
        </Collapse>
      </div>
    </div>
  );
}
