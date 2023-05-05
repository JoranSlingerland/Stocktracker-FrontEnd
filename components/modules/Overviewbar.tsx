import { Skeleton, Typography, Statistic } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import { formatCurrency, formatPercentage } from '../utils/formatting';
import { UserSettings_Type } from '../types/types';

const { Text } = Typography;

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
  const PercentageFormat = (value: number | string) => {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    if (value > 0) {
      const data = formatPercentage(value);
      return (
        <Text strong type="success">
          <RiseOutlined /> {data}
        </Text>
      );
    } else if (value < 0) {
      const data = formatPercentage(value);
      return (
        <Text strong type="danger">
          <FallOutlined /> {data}
        </Text>
      );
    } else {
      const data = formatPercentage(value);
      return data;
    }
  };

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
    <div className="flex flex-col space-y-5 lg:space-x-5 lg:space-y-0 lg:flex-row">
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
          formatter={(value) => PercentageFormat(value)}
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
          formatter={(value) => PercentageFormat(value)}
        />
      )}
    </div>
  );
}
