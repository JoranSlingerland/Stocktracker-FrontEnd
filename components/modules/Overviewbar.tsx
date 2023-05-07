import { Skeleton, Statistic } from 'antd';
import {
  formatCurrency,
  formatPercentageWithColors,
} from '../utils/formatting';
import { UserSettings_Type } from '../types/types';

export default function tabs({
  topBarData,
  loading,
  userSettings,
  tabState,
}: {
  topBarData: any;
  loading: boolean;
  userSettings: UserSettings_Type;
  tabState: any;
}): JSX.Element {
  const { tab, setTab } = tabState;

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
          value={topBarData.total_value_gain}
          formatter={(value) =>
            formatCurrency({ value, currency: userSettings.currency })
          }
          title={
            topBarData.total_value_gain > 0 ? 'Value growth' : 'Value loss'
          }
          className="ml-1"
        ></Statistic>,
        <Statistic
          value={topBarData.total_value_gain_percentage}
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
          value={topBarData.total_dividends}
          title={'Received dividends'}
          formatter={(value) =>
            formatCurrency({ value, currency: userSettings.currency })
          }
          className="ml-1"
        />
      )}
      {createCard(
        3,
        60,
        <Statistic
          value={topBarData.transaction_cost}
          title={'Transaction cost'}
          formatter={(value) =>
            formatCurrency({ value, currency: userSettings.currency })
          }
          className="ml-1"
        />
      )}
      {createCard(
        4,
        100,
        <Statistic
          value={topBarData.total_pl}
          formatter={(value) =>
            formatCurrency({ value, currency: userSettings.currency })
          }
          title={topBarData.total_pl > 0 ? 'Gains' : 'Losses'}
          className="ml-1"
        ></Statistic>,
        <Statistic
          value={topBarData.total_pl_percentage}
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
