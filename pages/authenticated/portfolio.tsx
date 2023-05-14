import { Tabs, Collapse, Typography } from 'antd';
import { useEffect, useReducer } from 'react';
import PieChart from '../../components/elements/PrimeFacePieChart';
import AntdTable from '../../components/elements/antdTable';
import { apiRequestReducer, initialState } from '../../components/utils/api';
import { UserSettings_Type } from '../../components/types/types';
import useLocalStorageState from '../../components/hooks/useLocalStorageState';
import { getPieData, getTableDataBasic } from '../../components/services/data';
import {
  RealizedColumns,
  UnRealizedColumns,
} from '../../components/elements/Columns';

const { Title } = Typography;

const { Panel } = Collapse;

const fallbackObject = {
  labels: [],
  data: [],
  color: [],
};

export default function Home({
  userSettings,
}: {
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
    const abortController = new AbortController();
    if (tab === '1') {
      getPieData({
        body: {
          dataType: 'stocks',
        },
        dispatcher: StockPieDataDispatcher,
        abortController,
      });
    }
    if (tab === '2') {
      getPieData({
        body: {
          dataType: 'sector',
        },
        dispatcher: SectorPieDataReducer,
        abortController,
      });
    }
    if (tab === '3') {
      getPieData({
        body: {
          dataType: 'country',
        },

        dispatcher: CountryPieDataReducer,
        abortController,
      });
    }
    if (tab === '4') {
      getPieData({
        body: {
          dataType: 'currency',
        },
        dispatcher: CurrencyPieDataDispatcher,
        abortController,
      });
    }
    return () => {
      abortController.abort();
    };
  }, [tab]);

  useEffect(() => {
    const abortController = new AbortController();

    getTableDataBasic({
      dispatcher: unRealizedDataDispatcher,
      abortController,
      body: {
        fullyRealized: false,
        containerName: 'stocks_held',
      },
    });

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (CollapseKey === '1') {
      const abortController = new AbortController();

      getTableDataBasic({
        dispatcher: RealizedDataDispatcher,
        abortController,
        body: {
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
  }, [CollapseKey]);

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

  // Render
  return (
    <>
      <Title className="flex items-center justify-center pt-5" level={1}>
        Portfolio
      </Title>
      <Tabs
        type="line"
        activeKey={tab}
        onChange={(activeKey) => {
          setTab(activeKey);
        }}
        items={items}
      />
      <AntdTable
        columns={UnRealizedColumns(userSettings.currency)}
        data={UnRealizedData.data}
        isLoading={UnRealizedData.isLoading}
        globalSorter={true}
        tableProps={{
          scroll: true,
        }}
      />
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
            columns={RealizedColumns(userSettings.currency)}
            data={RealizedData.data}
            isLoading={RealizedData.isLoading}
            globalSorter={true}
            tableProps={{
              scroll: true,
            }}
          />
        </Panel>
      </Collapse>
    </>
  );
}
