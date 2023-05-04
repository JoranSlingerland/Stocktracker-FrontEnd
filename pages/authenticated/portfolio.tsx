import { Tabs, Collapse, Typography } from 'antd';
import { useEffect, useReducer } from 'react';
import PieChart from '../../components/PrimeFacePieChart';
import AntdTable from '../../components/antdTable';
import {
  cachedFetch_2,
  apiRequestReducer,
  initialState,
} from '../../utils/api-utils';
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

export default function Home({
  userInfo,
  userSettings,
}: {
  userInfo: UserInfo_Type;
  userSettings: UserSettings_Type;
}) {
  // Const setup
  const [UnRealizedData, unRealizedDataDispatcher] = useReducer(
    apiRequestReducer,
    initialState({ isLoading: true })
  );
  const [RealizedData, RealizedDataDispatcher] = useReducer(
    apiRequestReducer,
    initialState({ isLoading: true })
  );
  const [StockPieData, StockPieDataDispatcher] = useReducer(
    apiRequestReducer,
    initialState({ fallback_data: fallbackObject, isLoading: true })
  );
  const [CurrencyPieData, CurrencyPieDataDispatcher] = useReducer(
    apiRequestReducer,
    initialState({ fallback_data: fallbackObject, isLoading: true })
  );
  const [SectorPieData, SectorPieDataReducer] = useReducer(
    apiRequestReducer,
    initialState({ fallback_data: fallbackObject, isLoading: true })
  );
  const [CountryPieData, CountryPieDataReducer] = useReducer(
    apiRequestReducer,
    initialState({ fallback_data: fallbackObject, isLoading: true })
  );

  // Fetch data on page load
  useEffect(() => {
    if (userInfo.clientPrincipal.userId !== '') {
      const abortController = new AbortController();
      cachedFetch_2({
        url: `/api/data/get_table_data_basic`,
        method: 'POST',
        body: {
          userId: userInfo.clientPrincipal.userId,
          containerName: 'stocks_held',
          fullyRealized: false,
        },
        dispatcher: unRealizedDataDispatcher,
        controller: abortController,
      });
      cachedFetch_2({
        url: `/api/data/get_table_data_basic`,
        method: 'POST',
        body: {
          userId: userInfo.clientPrincipal.userId,
          containerName: 'stocks_held',
          fullyRealized: true,
          partialRealized: true,
          andOr: 'or',
        },
        dispatcher: RealizedDataDispatcher,
        controller: abortController,
      });
      cachedFetch_2({
        url: `/api/data/get_pie_data`,
        fallback_data: fallbackObject,
        method: 'POST',
        body: {
          userId: userInfo.clientPrincipal.userId,
          dataType: 'stocks',
        },
        dispatcher: StockPieDataDispatcher,
        controller: abortController,
      });
      cachedFetch_2({
        url: `/api/data/get_pie_data`,
        fallback_data: fallbackObject,
        method: 'POST',
        body: {
          userId: userInfo.clientPrincipal.userId,
          dataType: 'currency',
        },
        dispatcher: CurrencyPieDataDispatcher,
        controller: abortController,
      });
      cachedFetch_2({
        url: `/api/data/get_pie_data`,
        fallback_data: fallbackObject,
        method: 'POST',
        body: {
          userId: userInfo.clientPrincipal.userId,
          dataType: 'sector',
        },
        dispatcher: SectorPieDataReducer,
        controller: abortController,
      });
      cachedFetch_2({
        url: `/api/data/get_pie_data`,
        fallback_data: fallbackObject,
        method: 'POST',
        body: {
          userId: userInfo.clientPrincipal.userId,
          dataType: 'country',
        },
        dispatcher: CountryPieDataReducer,
        controller: abortController,
      });
      return () => {
        abortController.abort();
      };
    }
  }, [userInfo]);

  // Tabs setup
  const items = [
    {
      key: '1',
      label: 'Stocks',
      children: (
        <PieChart
          data={StockPieData.data}
          isloading={StockPieData.isLoading}
          userSettings={userSettings}
        />
      ),
    },
    {
      key: '2',
      label: 'Sector',
      children: (
        <PieChart
          data={SectorPieData.data}
          isloading={SectorPieData.isLoading}
          userSettings={userSettings}
        />
      ),
    },
    {
      key: '3',
      label: 'Country',
      children: (
        <PieChart
          data={CountryPieData.data}
          isloading={CountryPieData.isLoading}
          userSettings={userSettings}
        />
      ),
    },
    {
      key: '4',
      label: 'Currency',
      children: (
        <PieChart
          data={CurrencyPieData.data}
          isloading={CurrencyPieData.isLoading}
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
          data={UnRealizedData.data}
          isLoading={UnRealizedData.isLoading}
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
              data={RealizedData.data}
              isLoading={RealizedData.isLoading}
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
