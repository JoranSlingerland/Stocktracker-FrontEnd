import Overviewbar from '../../components/modules/Overviewbar';
import React, { useEffect, useReducer, useMemo } from 'react';
import { Divider, Segmented, Typography } from 'antd';
import BasicLineGraph from '../../components/elements/PrimeFaceLineGraph';
import PrimeFaceBarChart from '../../components/elements/PrimeFaceBarChart';
import AntdTable from '../../components/elements/antdTable';
import { TimeFramestate } from '../../components/types/types';
import useLocalStorageState from '../../components/hooks/useLocalStorageState';
import { useTableDataPerformanceStocksHeld } from '../../components/services/data/GetTableDataPerformance/stocksHeld';
import { valueGrowthColumns } from '../../components/elements/columns/valueGrowthColumns';
import { ReceivedDividedColumns } from '../../components/elements/columns/ReceivedDividedColumns';
import { TransactionCostColumns } from '../../components/elements/columns/TransactionCostColumns';
import { UserSettings } from '../../components/services/data/getUserData';
import {
  getBarchartData,
  barChartDataInitialState,
  barChartDataReducer,
} from '../../components/services/data/getBarchartData';
import {
  getLineChartData,
  lineChartDataInitialState,
  lineChartDataReducer,
} from '../../components/services/data/getLineChartData';
import { UseFetchResult } from '../../components/hooks/useFetch';
import { TotalsData } from '../../components/types/types';

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
  userSettings,
  timeFrameState,
  timeFrameDates,
  totalPerformance,
}: {
  userSettings: UserSettings;
  timeFrameState: TimeFramestate;
  timeFrameDates: { start_date: string; end_date: string };
  totalPerformance: UseFetchResult<TotalsData[]>;
}) {
  // const setup
  const [valueGrowthData, valueGrowthDataReducer] = useReducer(
    lineChartDataReducer,
    lineChartDataInitialState({
      isLoading: true,
    })
  );
  const [dividendData, dividendDataReducer] = useReducer(
    barChartDataReducer,
    barChartDataInitialState({
      isLoading: true,
    })
  );
  const [totalGainsData, totalGainsDataReducer] = useReducer(
    lineChartDataReducer,
    lineChartDataInitialState({
      isLoading: true,
    })
  );
  const [totalTransactionCostData, totalTransactionCostDataReducer] =
    useReducer(
      barChartDataReducer,
      barChartDataInitialState({ isLoading: true })
    );
  const timeFrameBody = useMemo(() => {
    const body: any = {};
    if (
      timeFrameDates.end_date === 'max' &&
      timeFrameDates.start_date === 'max'
    ) {
      body.allData = true;
    } else if (timeFrameDates.end_date && timeFrameDates.start_date) {
      body.startDate = timeFrameDates.start_date;
      body.endDate = timeFrameDates.end_date;
    } else {
      return;
    }
    return body;
  }, [timeFrameDates.end_date, timeFrameDates.start_date]);
  const { data: singleDayData, isLoading: singleDayIsLoading } =
    useTableDataPerformanceStocksHeld({
      body: {
        ...timeFrameBody,
        containerName: 'stocks_held',
        dataType: 'stocks_held',
      },
    });
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
    const body: any = {};
    if (
      timeFrameDates.end_date === 'max' &&
      timeFrameDates.start_date === 'max'
    ) {
      body.allData = true;
    } else if (timeFrameDates.end_date && timeFrameDates.start_date) {
      body.startDate = timeFrameDates.start_date;
      body.endDate = timeFrameDates.end_date;
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
  }, [timeFrameDates.end_date, timeFrameDates.start_date, tab]);

  useEffect(() => {
    const body: any = {
      containerName: 'stocks_held',
    };
    if (
      timeFrameDates.end_date === 'max' &&
      timeFrameDates.start_date === 'max'
    ) {
      body.allData = true;
    } else if (timeFrameDates.end_date && timeFrameDates.start_date) {
      body.startDate = timeFrameDates.start_date;
      body.endDate = timeFrameDates.end_date;
    } else {
      return;
    }

    const abortController = new AbortController();

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
  }, [timeFrameDates.end_date, timeFrameDates.start_date]);

  // Columns

  // Render
  return (
    <>
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
      <Overviewbar
        totalPerformanceData={totalPerformance.data}
        valueGrowthData={valueGrowthData.data}
        loading={totalPerformance.isLoading || valueGrowthData.isLoading}
        userSettings={userSettings}
        tabState={{ tab, setTab }}
      />
      {tab === 1 && (
        <>
          {valueGrowthDataMemo}
          <Divider />
          <AntdTable
            isLoading={singleDayIsLoading}
            columns={valueGrowthColumns(userSettings.currency)}
            data={singleDayData}
            globalSorter={true}
          />
        </>
      )}
      {tab === 2 && (
        <>
          {dividendDataMemo}
          <Divider />
          <AntdTable
            isLoading={singleDayIsLoading}
            columns={ReceivedDividedColumns(userSettings.currency)}
            data={singleDayData}
            globalSorter={true}
          />
        </>
      )}
      {tab === 3 && (
        <>
          {totalTransactionCostDataMemo}
          <Divider />
          <AntdTable
            isLoading={singleDayIsLoading}
            columns={TransactionCostColumns(userSettings.currency)}
            data={singleDayData}
            globalSorter={true}
          />
        </>
      )}
      {tab === 4 && (
        <>
          {totalGainsDataMemo}
          <Divider />
          <AntdTable
            isLoading={singleDayIsLoading}
            columns={valueGrowthColumns(userSettings.currency)}
            data={singleDayData}
            globalSorter={true}
          />
        </>
      )}
    </>
  );
}
