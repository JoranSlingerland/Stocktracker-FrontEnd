import { useRouter } from 'next/router';
import { Skeleton, Typography, Statistic } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import { formatCurrency, formatPercentage } from '../utils/formatting';

const { Text } = Typography;

export default function tabs({
  topBarData,
  loading,
  handleTabChange,
}: {
  topBarData: any;
  loading: boolean;
  handleTabChange: (tab: string) => void;
}): JSX.Element {
  const tab = (useRouter().query.tab || 1).toString();

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

  const skeletonProps = {
    paragraph: { rows: 1 },
    active: loading,
    loading: loading,
    title: true,
  };

  const skeletonProps_full_width = {
    paragraph: { rows: 1, width: '100%' },
    active: loading,
    loading: loading,
    title: true,
  };

  return (
    <div className="flex flex-col space-y-5 lg:space-x-5 lg:space-y-0 lg:flex-row">
      <div
        className={`${
          tab === '1'
            ? 'flex flex-col basis-0 flex-grow rounded-full px-4 bg-white shadow'
            : 'flex flex-col basis-0 flex-grow rounded-full px-4 bg-neutral-100'
        }`}
        onClick={() => handleTabChange('1')}
      >
        <div className="flex my-1">
          <Skeleton {...skeletonProps_full_width}>
            <Statistic
              value={topBarData.total_value_gain}
              formatter={(value) => formatCurrency(value)}
              title={
                topBarData.total_value_gain > 0 ? 'Value growth' : 'Value loss'
              }
              className="ml-1"
            ></Statistic>
          </Skeleton>
          <div className="mt-auto mb-0 ml-auto mr-0 ">
            <Skeleton {...skeletonProps_full_width}>
              <Statistic
                value={topBarData.total_value_gain_percentage}
                formatter={(value) => PercentageFormat(value)}
              />
            </Skeleton>
          </div>
        </div>
      </div>
      <div
        className={`${
          tab === '2'
            ? 'flex flex-col basis-0 flex-grow rounded-full px-4 bg-white shadow'
            : 'flex flex-col basis-0 flex-grow rounded-full px-4 bg-neutral-100'
        }`}
        onClick={() => handleTabChange('2')}
      >
        <div className="flex my-1">
          <Skeleton {...skeletonProps}>
            <Statistic
              value={topBarData.total_dividends}
              title={'Received dividends'}
              formatter={(value) => formatCurrency(value)}
              className="ml-1"
            />
          </Skeleton>
        </div>
      </div>
      <div
        className={`${
          tab === '3'
            ? 'flex flex-col basis-0 flex-grow rounded-full px-4 bg-white shadow'
            : 'flex flex-col basis-0 flex-grow rounded-full px-4 bg-neutral-100'
        }`}
        onClick={() => handleTabChange('3')}
      >
        <div className="flex my-1">
          <Skeleton {...skeletonProps}>
            <Statistic
              value={topBarData.transaction_cost}
              title={'Transaction cost'}
              formatter={(value) => formatCurrency(value)}
              className="ml-1"
            />
          </Skeleton>
        </div>
      </div>
      <div
        className={`${
          tab === '4'
            ? 'flex flex-col basis-0 flex-grow rounded-full px-4 bg-white shadow'
            : 'flex flex-col basis-0 flex-grow rounded-full px-4 bg-neutral-100'
        }`}
        onClick={() => handleTabChange('4')}
      >
        <div className="flex my-1">
          <Skeleton {...skeletonProps_full_width}>
            <Statistic
              value={topBarData.total_pl}
              formatter={(value) => formatCurrency(value)}
              title={topBarData.total_pl > 0 ? 'Gains' : 'Losses'}
              className="ml-1"
            ></Statistic>
          </Skeleton>
          <div className="mt-auto mb-0 ml-auto mr-0 ">
            <Skeleton {...skeletonProps_full_width}>
              <Statistic
                value={topBarData.total_pl_percentage}
                formatter={(value) => PercentageFormat(value)}
              />
            </Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}
