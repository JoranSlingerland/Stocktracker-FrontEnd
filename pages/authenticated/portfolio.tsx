import { Tabs, Collapse, Typography } from 'antd';
import { useEffect, useReducer } from 'react';
import PieChart from '../../components/elements/PrimeFacePieChart';
import AntdTable from '../../components/elements/antdTable';
import { apiRequestReducer, initialState } from '../../components/utils/api';
import {
  formatCurrency,
  formatCurrencyWithColors,
  formatPercentageWithColors,
  formatNumber,
  formatImageAndText,
} from '../../components/utils/formatting';
import { UserInfo_Type, UserSettings_Type } from '../../components/types/types';
import type { ColumnsType } from 'antd/es/table';
import useLocalStorageState from '../../components/hooks/useLocalStorageState';
import getPieData from '../../components/services/data/getPieData';
import getTableDataBasic from '../../components/services/data/getTableDataBasic';

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
  const [tab, setTab] = useLocalStorageState('portfolioTab', '1');
  const [CollapseKey, setCollapseKey] = useLocalStorageState(
    'portfolioCollapse',
    '0'
  );

  // UseEffect setup
  useEffect(() => {
    if (userInfo.clientPrincipal.userId !== '') {
      const abortController = new AbortController();
      if (tab === '1') {
        getPieData({
          body: {
            userId: userInfo.clientPrincipal.userId,
            dataType: 'stocks',
          },
          dispatcher: StockPieDataDispatcher,
          abortController,
        });
      }
      if (tab === '2') {
        getPieData({
          body: {
            userId: userInfo.clientPrincipal.userId,
            dataType: 'sector',
          },
          dispatcher: SectorPieDataReducer,
          abortController,
        });
      }
      if (tab === '3') {
        getPieData({
          body: {
            userId: userInfo.clientPrincipal.userId,
            dataType: 'country',
          },

          dispatcher: CountryPieDataReducer,
          abortController,
        });
      }
      if (tab === '4') {
        getPieData({
          body: {
            userId: userInfo.clientPrincipal.userId,
            dataType: 'currency',
          },
          dispatcher: CurrencyPieDataDispatcher,
          abortController,
        });
      }
      return () => {
        abortController.abort();
      };
    }
  }, [userInfo, tab]);

  useEffect(() => {
    if (userInfo.clientPrincipal.userId !== '') {
      const abortController = new AbortController();

      getTableDataBasic({
        dispatcher: unRealizedDataDispatcher,
        abortController,
        body: {
          fullyRealized: false,
          userId: userInfo.clientPrincipal.userId,
          containerName: 'stocks_held',
        },
      });

      return () => {
        abortController.abort();
      };
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo.clientPrincipal.userId !== '' && CollapseKey === '1') {
      const abortController = new AbortController();

      getTableDataBasic({
        dispatcher: RealizedDataDispatcher,
        abortController,
        body: {
          userId: userInfo.clientPrincipal.userId,
          fullyRealized: true,
          partialRealized: true,
          andOr: 'or',
          containerName: 'stocks_held',
        },
      });

      return () => {
        abortController.abort();
      };
    }
  }, [userInfo, CollapseKey]);

  // Tabs setup
  const items = [
    {
      key: '1',
      label: 'Stocks',
      children: (
        <div className="min-h-96">
          <PieChart
            data={StockPieData.data}
            isloading={StockPieData.isLoading}
            userSettings={userSettings}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Sector',
      children: (
        <div className="min-h-96">
          <PieChart
            data={SectorPieData.data}
            isloading={SectorPieData.isLoading}
            userSettings={userSettings}
          />
        </div>
      ),
    },
    {
      key: '3',
      label: 'Country',
      children: (
        <div className="min-h-96">
          <PieChart
            data={CountryPieData.data}
            isloading={CountryPieData.isLoading}
            userSettings={userSettings}
          />
        </div>
      ),
    },
    {
      key: '4',
      label: 'Currency',
      children: (
        <div className="min-h-96">
          <PieChart
            data={CurrencyPieData.data}
            isloading={CurrencyPieData.isLoading}
            userSettings={userSettings}
          />
        </div>
      ),
    },
  ];

  // Columns setup

  const UnRealizedColumns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'meta',
      key: 'meta.name',
      fixed: 'left',
      render: (text: any, record: any) =>
        formatImageAndText(record.symbol, text.name, record.meta.logo),
    },
    {
      title: 'Cost',
      dataIndex: 'unrealized',
      key: 'unrealized.total_cost',
      responsive: ['md'],
      render: (text: { total_cost: string | number }, record: any) => (
        <div>
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
      title: 'Value',
      dataIndex: 'unrealized',
      key: 'unrealized.total_value',
      render: (text: { total_value: string | number }, record: any) => (
        <div>
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
      title: 'P/L',
      dataIndex: 'unrealized',
      key: 'unrealized.total_pl',
      render: (text) => (
        <div>
          <div>
            {formatCurrencyWithColors({
              value: text.total_pl,
              currency: userSettings.currency,
            })}
          </div>
          <div>
            {formatPercentageWithColors({ value: text.total_pl_percentage })}
          </div>
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
      render: (text, record: any) =>
        formatImageAndText(record.symbol, text.name, record.meta.logo),
    },
    {
      title: 'Cost',
      dataIndex: 'realized',
      key: 'realized.buy_price',
      responsive: ['md'],
      render: (text) => (
        <div>
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
      title: 'Realized',
      dataIndex: 'realized',
      key: 'realized.sell_price',
      render: (text) => (
        <div>
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
      title: 'P/L',
      dataIndex: 'realized',
      key: 'realized.total_pl',
      render: (text) => (
        <div>
          <div>
            {formatCurrencyWithColors({
              value: text.total_pl,
              currency: userSettings.currency,
            })}
          </div>
          <div>
            {formatPercentageWithColors({ value: text.total_pl_percentage })}
          </div>
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
        <Tabs
          type="line"
          activeKey={tab}
          onChange={(activeKey) => {
            setTab(activeKey);
          }}
          items={items}
        />
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
        <Collapse
          activeKey={CollapseKey}
          onChange={() => {
            setCollapseKey(CollapseKey === '1' ? '0' : '1');
          }}
          bordered={false}
          ghost
        >
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
