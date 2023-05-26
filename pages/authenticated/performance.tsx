import Overviewbar from '../../components/modules/Overviewbar';
import React, { useMemo } from 'react';
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
import { useBarchartData } from '../../components/services/data/getBarchartData';
import { useLineChartData } from '../../components/services/data/getLineChartData';
import { UseFetchResult } from '../../components/hooks/useFetch';
import { TotalsData } from '../../components/types/types';

const { Title } = Typography;

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
  const [tab, setTab] = useLocalStorageState('performanceTab', 1);
  const { data: valueGrowthData, isLoading: valueGrowthIsLoading } =
    useLineChartData({
      body: {
        ...timeFrameBody,
        dataType: 'invested_and_value',
      },
    });
  const { data: totalGainsData, isLoading: totalGainsIsLoading } =
    useLineChartData({
      body: {
        ...timeFrameBody,
        dataType: 'total_gains',
      },
      enabled: tab === 2,
    });
  const { data: dividendData, isLoading: dividendIsLoading } = useBarchartData({
    body: {
      ...timeFrameBody,
      dataType: 'dividend',
    },
    enabled: tab === 2,
  });
  const {
    data: totalTransactionCostData,
    isLoading: totalTransactionCostIsLoading,
  } = useBarchartData({
    body: {
      ...timeFrameBody,
      dataType: 'transaction_cost',
    },
    enabled: tab === 3,
  });

  const { data: singleDayData, isLoading: singleDayIsLoading } =
    useTableDataPerformanceStocksHeld({
      body: {
        ...timeFrameBody,
        containerName: 'stocks_held',
        dataType: 'stocks_held',
      },
    });

  const { timeFrame, setTimeFrame } = timeFrameState;

  // useMemo
  const valueGrowthDataMemo = useMemo(() => {
    return (
      <BasicLineGraph
        data={valueGrowthData}
        isloading={valueGrowthIsLoading}
        userSettings={userSettings}
      />
    );
  }, [valueGrowthData, valueGrowthIsLoading, userSettings]);

  const totalGainsDataMemo = useMemo(() => {
    return (
      <BasicLineGraph
        data={totalGainsData}
        isloading={totalGainsIsLoading}
        userSettings={userSettings}
      />
    );
  }, [totalGainsData, totalGainsIsLoading, userSettings]);

  const dividendDataMemo = useMemo(() => {
    return (
      <PrimeFaceBarChart
        data={dividendData}
        isloading={dividendIsLoading}
        userSettings={userSettings}
      />
    );
  }, [dividendData, dividendIsLoading, userSettings]);

  const totalTransactionCostDataMemo = useMemo(() => {
    return (
      <PrimeFaceBarChart
        data={totalTransactionCostData}
        isloading={totalTransactionCostIsLoading}
        userSettings={userSettings}
      />
    );
  }, [totalTransactionCostData, totalTransactionCostIsLoading, userSettings]);

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
        valueGrowthData={valueGrowthData}
        loading={totalPerformance.isLoading || valueGrowthIsLoading}
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
