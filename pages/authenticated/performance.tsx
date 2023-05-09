import Overviewbar from '../../components/modules/Overviewbar';
import React, { useEffect, useReducer, useMemo } from 'react';
import { Divider, Segmented, Typography } from 'antd';
import BasicLineGraph from '../../components/elements/PrimeFaceLineGraph';
import PrimeFaceBarChart from '../../components/elements/PrimeFaceBarChart';
import { apiRequestReducer, initialState } from '../../components/utils/api';
import AntdTable from '../../components/elements/antdTable';
import {
  formatCurrency,
  formatCurrencyWithColors,
  formatPercentageWithColors,
  formatImageAndText,
} from '../../components/utils/formatting';
import {
  UserInfo_Type,
  UserSettings_Type,
  TimeFramestate,
} from '../../components/types/types';
import useLocalStorageState from '../../components/hooks/useLocalStorageState';
import type { ColumnsType } from 'antd/es/table';
import {
  getBarchartData,
  getLineChartData,
  getTableDataPerformance,
} from '../../components/services/data';

const { Title } = Typography;

const totalGainsDataFallBackObject = {
  labels: [],
  datasets: [
    {
      label: 'Gains',
      borderColor: '#0e8505',
      data: [],
    },
  ],
};

const valueGrowthDataFallBackObject = {
  labels: [],
  datasets: [
    {
      label: 'Value',
      borderColor: '#0e8505',
      data: [],
    },
    {
      label: 'Invested',
      borderColor: '#090a09',
      data: [],
    },
  ],
};

export default function performance({
  userInfo,
  userSettings,
  timeFrameState,
  timeFrameDates,
  totalPerformanceData,
}: {
  userInfo: UserInfo_Type;
  userSettings: UserSettings_Type;
  timeFrameState: TimeFramestate;
  timeFrameDates: { start_date: string; end_date: string };
  totalPerformanceData: any;
}) {
  // const setup
  const [valueGrowthData, valueGrowthDataReducer] = useReducer(
    apiRequestReducer,
    initialState({
      fallback_data: valueGrowthDataFallBackObject,
      isLoading: true,
    })
  );
  const [dividendData, dividendDataReducer] = useReducer(
    apiRequestReducer,
    initialState({ fallback_data: [], isLoading: true })
  );
  const [totalGainsData, totalGainsDataReducer] = useReducer(
    apiRequestReducer,
    initialState({
      fallback_data: totalGainsDataFallBackObject,
      isLoading: true,
    })
  );
  const [totalTransactionCostData, totalTransactionCostDataReducer] =
    useReducer(
      apiRequestReducer,
      initialState({ fallback_data: [], isLoading: true })
    );
  const [SingleDayData, SingleDayDataReducer] = useReducer(
    apiRequestReducer,
    initialState({ isLoading: true })
  );
  const [tab, setTab] = useLocalStorageState('performanceTab', 1);
  const { timeFrame, setTimeFrame } = timeFrameState;

  // useMemo
  const valueGrowthDataMemo = useMemo(() => {
    return (
      <BasicLineGraph
        data={valueGrowthData.data}
        isloading={valueGrowthData.isLoading}
        userSettings={userSettings}
      />
    );
  }, [valueGrowthData.data, valueGrowthData.isLoading, userSettings]);

  const totalGainsDataMemo = useMemo(() => {
    return (
      <BasicLineGraph
        data={totalGainsData.data}
        isloading={totalGainsData.isLoading}
        userSettings={userSettings}
      />
    );
  }, [totalGainsData.data, totalGainsData.isLoading, userSettings]);

  const dividendDataMemo = useMemo(() => {
    return (
      <PrimeFaceBarChart
        data={dividendData.data}
        isloading={dividendData.isLoading}
        userSettings={userSettings}
      />
    );
  }, [dividendData.data, dividendData.isLoading, userSettings]);

  const totalTransactionCostDataMemo = useMemo(() => {
    return (
      <PrimeFaceBarChart
        data={totalTransactionCostData.data}
        isloading={totalTransactionCostData.isLoading}
        userSettings={userSettings}
      />
    );
  }, [
    totalTransactionCostData.data,
    totalTransactionCostData.isLoading,
    userSettings,
  ]);

  // useEffects
  useEffect(() => {
    if (!userInfo?.clientPrincipal?.userId) {
      return;
    }

    const { start_date, end_date } = timeFrameDates;
    const body: any = {
      userId: userInfo.clientPrincipal.userId,
    };
    if (end_date === 'max' && start_date === 'max') {
      body.allData = true;
    } else if (end_date && start_date) {
      body.startDate = start_date;
      body.endDate = end_date;
    } else {
      return;
    }

    const abortController = new AbortController();

    if (tab === 2) {
      getBarchartData({
        dispatcher: dividendDataReducer,
        abortController,
        body: {
          ...body,
          dataType: 'dividend',
        },
      });
    }

    if (tab === 3) {
      getBarchartData({
        dispatcher: totalTransactionCostDataReducer,
        abortController,
        body: {
          ...body,
          dataType: 'transaction_cost',
        },
      });
    }

    if (tab === 4) {
      getLineChartData({
        dispatcher: totalGainsDataReducer,
        abortController,
        body: {
          ...body,
          dataType: 'total_gains',
        },
        fallback_data: totalGainsDataFallBackObject,
      });
    }

    return () => {
      abortController.abort();
    };
  }, [userInfo, timeFrameDates, tab]);

  useEffect(() => {
    if (!userInfo?.clientPrincipal?.userId) {
      return;
    }

    const { start_date, end_date } = timeFrameDates;
    const body: any = {
      userId: userInfo.clientPrincipal.userId,
      containerName: 'stocks_held',
    };
    if (end_date === 'max' && start_date === 'max') {
      body.allData = true;
    } else if (end_date && start_date) {
      body.startDate = start_date;
      body.endDate = end_date;
    } else {
      return;
    }

    const abortController = new AbortController();
    getTableDataPerformance({
      dispatcher: SingleDayDataReducer,
      abortController,
      body: {
        ...body,
        dataType: 'stocks_held',
      },
    });

    getLineChartData({
      dispatcher: valueGrowthDataReducer,
      abortController,
      body: {
        ...body,
        dataType: 'invested_and_value',
      },
      fallback_data: valueGrowthDataFallBackObject,
    });

    return () => {
      abortController.abort();
    };
  }, [userInfo, timeFrameDates]);

  // Columns
  const valueGrowthColumns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'meta',
      key: 'meta.name',
      render: (text: any, record: any) =>
        formatImageAndText(record.symbol, text.name, record.meta.logo),
    },
    {
      title: 'Profit / Loss',
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

  const ReceivedDividedColumns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'meta',
      key: 'meta.name',
      render: (text: any, record: any) =>
        formatImageAndText(record.symbol, text.name, record.meta.logo),
    },
    {
      title: 'Dividends',
      dataIndex: 'realized',
      key: 'realized.total_dividends',
      render: (text: { total_dividends: string | number }) =>
        formatCurrency({
          value: text.total_dividends,
          currency: userSettings.currency,
        }),
    },
  ];

  const TransactionCostColumns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'meta',
      key: 'meta.name',
      render: (text: any, record: any) =>
        formatImageAndText(record.symbol, text.name, record.meta.logo),
    },
    {
      title: 'Transaction Costs',
      dataIndex: 'realized',
      key: 'realized.transaction_cost',
      render: (text: { transaction_cost: string | number }) =>
        formatCurrency({
          value: text.transaction_cost,
          currency: userSettings.currency,
        }),
    },
  ];

  // Render
  return (
    <div>
      {/* Title */}
      <div className="flex shrink-0 flex-row pt-2">
        <Title className="min-w-[220px] mr-2" level={1}>
          Performance
        </Title>
        <div className="pt-3 ml-auto mr-0 overflow-auto">
          <Segmented
            options={[
              {
                label: <div onClick={() => setTimeFrame('ytd')}>YTD</div>,
                value: 'ytd',
              },
              {
                label: <div onClick={() => setTimeFrame('week')}>Week</div>,
                value: 'week',
              },
              {
                label: <div onClick={() => setTimeFrame('month')}>Month</div>,
                value: 'month',
              },
              {
                label: <div onClick={() => setTimeFrame('year')}>Year</div>,
                value: 'year',
              },
              {
                label: <div onClick={() => setTimeFrame('max')}>Max</div>,
                value: 'max',
              },
            ]}
            value={timeFrame}
          />
        </div>
      </div>
      <div>
        <Overviewbar
          totalPerformanceData={totalPerformanceData.data}
          valueGrowthData={valueGrowthData.data}
          loading={totalPerformanceData.isLoading || valueGrowthData.isLoading}
          userSettings={userSettings}
          tabState={{ tab, setTab }}
        />
      </div>
      <div>
        <div></div>
        <div>
          {tab === 1 && (
            <React.Fragment>
              <div>
                {valueGrowthDataMemo}
                <Divider />
                <AntdTable
                  isLoading={SingleDayData.isLoading}
                  columns={valueGrowthColumns}
                  data={SingleDayData.data}
                  globalSorter={true}
                />
              </div>
            </React.Fragment>
          )}
          {tab === 2 && (
            <React.Fragment>
              {dividendDataMemo}
              <Divider />
              <AntdTable
                isLoading={SingleDayData.isLoading}
                columns={ReceivedDividedColumns}
                data={SingleDayData.data}
                globalSorter={true}
              />
            </React.Fragment>
          )}
          {tab === 3 && (
            <React.Fragment>
              {totalTransactionCostDataMemo}
              <Divider />
              <AntdTable
                isLoading={SingleDayData.isLoading}
                columns={TransactionCostColumns}
                data={SingleDayData.data}
                globalSorter={true}
              />
            </React.Fragment>
          )}
          {tab === 4 && (
            <React.Fragment>
              <div>
                {totalGainsDataMemo}
                <Divider />
                <AntdTable
                  isLoading={SingleDayData.isLoading}
                  columns={valueGrowthColumns}
                  data={SingleDayData.data}
                  globalSorter={true}
                />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
