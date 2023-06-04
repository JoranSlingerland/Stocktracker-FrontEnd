import { Skeleton, Statistic } from 'antd';
import {
  formatCurrency,
  formatPercentageWithColors,
} from '../utils/formatting';
import { LineChartData } from '../services/chart/line';
import { useProps } from '../hooks/useProps';

export default function tabs({
  totalPerformanceData,
  valueGrowthData,
  loading,
  tabState,
}: {
  totalPerformanceData: TotalsData[] | undefined;
  valueGrowthData: LineChartData | undefined;
  loading: boolean;
  tabState: {
    tab: number;
    setTab: React.Dispatch<React.SetStateAction<number>>;
  };
}): JSX.Element {
  const { userSettings } = useProps();
  const { tab, setTab } = tabState;
  const firstData = valueGrowthData?.datasets[0]?.data[0] ?? 0;
  const lastData =
    valueGrowthData?.datasets[0]?.data[
      valueGrowthData.datasets[0]?.data.length - 1
    ] ?? 0;
  const valueGrowth = lastData - firstData;
  const valueGrowthPercentage = firstData == 0 ? 0 : valueGrowth / firstData;

  function createCard(
    tabNumber: number,
    skeletonWidth: number,
    block1: JSX.Element,
    block2?: JSX.Element
  ) {
    const skeletonProps = {
      paragraph: { rows: 1, width: `${skeletonWidth}%` },
      active: loading,
      loading: loading,
      title: true,
    };
    return (
      <div
        className={`flex flex-col basis-0 flex-grow rounded-full px-4 shadow transition-colors ${
          tab === tabNumber
            ? 'bg-white dark:bg-neutral-700'
            : 'bg-neutral-100 dark:bg-neutral-950'
        }`}
        onClick={() => setTab(tabNumber)}
      >
        <div className="flex my-1">
          <Skeleton {...skeletonProps}> {block1}</Skeleton>
          <div className="mt-auto mb-0 ml-auto mr-0">
            <Skeleton {...skeletonProps}>{block2}</Skeleton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 grid-rows-4 gap-4 p-2 sm:grid-rows-2 sm:grid-cols-2 lg:grid-rows-1 lg:grid-cols-4">
      {createCard(
        1,
        100,
        <Statistic
          value={valueGrowth}
          formatter={(value) =>
            formatCurrency({ value, currency: userSettings?.data.currency })
          }
          title={valueGrowth > 0 ? 'Value growth' : 'Value loss'}
          className="ml-1"
        ></Statistic>,
        <Statistic
          value={valueGrowthPercentage}
          formatter={(value) =>
            formatPercentageWithColors({
              value,
              addIcon: true,
              className: 'text-xl',
            })
          }
        />
      )}
      {createCard(
        2,
        60,
        <Statistic
          value={totalPerformanceData?.[0]?.realized.dividends}
          title={'Received dividends'}
          formatter={(value) =>
            formatCurrency({ value, currency: userSettings?.data.currency })
          }
          className="ml-1"
        />
      )}
      {createCard(
        3,
        60,
        <Statistic
          value={totalPerformanceData?.[0]?.realized.transaction_cost}
          title={'Transaction cost'}
          formatter={(value) =>
            formatCurrency({ value, currency: userSettings?.data.currency })
          }
          className="ml-1"
        />
      )}
      {createCard(
        4,
        100,
        <Statistic
          value={totalPerformanceData?.[0]?.unrealized.total_pl}
          formatter={(value) =>
            formatCurrency({ value, currency: userSettings?.data.currency })
          }
          title={
            totalPerformanceData &&
            totalPerformanceData[0]?.unrealized?.total_pl > 0
              ? 'Gains'
              : 'Losses'
          }
          className="ml-1"
        ></Statistic>,
        <Statistic
          value={totalPerformanceData?.[0]?.unrealized.total_pl_percentage}
          formatter={(value) =>
            formatPercentageWithColors({
              value,
              addIcon: true,
              className: 'text-xl',
            })
          }
        />
      )}
    </div>
  );
}
