import Overviewbar from '../../components/modules/Overviewbar';
import { useMemo } from 'react';
import { Divider, Segmented, Typography } from 'antd';
import LineGraph from '../../components/elements/LineGraph';
import BarChart from '../../components/elements/BarChart';
import AntdTable from '../../components/elements/antdTable';
import useSessionStorageState from '../../components/hooks/useSessionStorageState';
import { useTableDataPerformanceStocksHeld } from '../../components/services/table/performance/stocksHeld';
import { valueGrowthColumns } from '../../components/elements/columns/valueGrowthColumns';
import { ReceivedDividedColumns } from '../../components/elements/columns/ReceivedDividedColumns';
import { TransactionCostColumns } from '../../components/elements/columns/TransactionCostColumns';
import { useBarchartData } from '../../components/services/chart/bar';
import { useLineChartData } from '../../components/services/chart/line';
import { useProps } from '../../components/hooks/useProps';

const { Title } = Typography;

export default function performance() {
  // const setup
  const { timeFrameState, timeFrameDates, totalPerformance } = useProps();
  const timeFrameBody = useMemo(() => {
    const body: TimeFrameBody = {};
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
  const [tab, setTab] = useSessionStorageState('performanceTab', 1);
  const { data: valueGrowthData, isLoading: valueGrowthIsLoading } =
    useLineChartData({
      query: {
        ...timeFrameBody,
        dataType: 'invested_and_value',
      },
    });
  const { data: dividendData, isLoading: dividendIsLoading } = useBarchartData({
    query: {
      ...timeFrameBody,
      dataType: 'dividend',
    },
    enabled: tab === 2,
  });
  const {
    data: totalTransactionCostData,
    isLoading: totalTransactionCostIsLoading,
  } = useBarchartData({
    query: {
      ...timeFrameBody,
      dataType: 'transaction_cost',
    },
    enabled: tab === 3,
  });
  const { data: totalGainsData, isLoading: totalGainsIsLoading } =
    useLineChartData({
      query: {
        ...timeFrameBody,
        dataType: 'total_gains',
      },
      enabled: tab === 4,
    });
  const { data: singleDayData, isLoading: singleDayIsLoading } =
    useTableDataPerformanceStocksHeld({
      query: {
        ...timeFrameBody,
        containerName: 'stocks_held',
      },
    });
  const { timeFrame = 'max', setTimeFrame = () => {} } = timeFrameState ?? {};

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
        totalPerformanceData={totalPerformance?.data}
        valueGrowthData={valueGrowthData}
        loading={totalPerformance?.isLoading || valueGrowthIsLoading}
        tabState={{ tab, setTab }}
      />
      {tab === 1 && (
        <>
          <LineGraph data={valueGrowthData} isLoading={valueGrowthIsLoading} />
          <Divider />
          <AntdTable
            isLoading={singleDayIsLoading}
            columns={valueGrowthColumns()}
            data={singleDayData}
            globalSorter={true}
          />
        </>
      )}
      {tab === 2 && (
        <>
          <BarChart data={dividendData} isloading={dividendIsLoading} />
          <Divider />
          <AntdTable
            isLoading={singleDayIsLoading}
            columns={ReceivedDividedColumns()}
            data={singleDayData}
            globalSorter={true}
          />
        </>
      )}
      {tab === 3 && (
        <>
          <BarChart
            data={totalTransactionCostData}
            isloading={totalTransactionCostIsLoading}
          />
          <Divider />
          <AntdTable
            isLoading={singleDayIsLoading}
            columns={TransactionCostColumns()}
            data={singleDayData}
            globalSorter={true}
          />
        </>
      )}
      {tab === 4 && (
        <>
          <LineGraph data={totalGainsData} isLoading={totalGainsIsLoading} />
          <Divider />
          <AntdTable
            isLoading={singleDayIsLoading}
            columns={valueGrowthColumns()}
            data={singleDayData}
            globalSorter={true}
          />
        </>
      )}
    </>
  );
}
