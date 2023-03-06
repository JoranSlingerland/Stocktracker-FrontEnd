// components\Overviewbar.js

import { useRouter } from 'next/router';
import { Skeleton } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import { formatCurrency, formatPercentage } from '../utils/formatting';

export default function tabs({ topBarData, loading, handleTabChange }) {
  const tab = (useRouter().query.tab || 1).toString();

  const PercentageFormat = (value) => {
    if (value > 0) {
      const data = formatPercentage(value);
      return (
        <span className="text-green-500">
          <RiseOutlined /> {data}
        </span>
      );
    } else if (value < 0) {
      const data = formatPercentage(value);
      return (
        <span className="text-red-500">
          <FallOutlined />
          {data}
        </span>
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
    title: false,
  };

  const skeletonProps_full_width = {
    paragraph: { rows: 1, width: '100%' },
    active: loading,
    loading: loading,
    title: false,
  };

  return (
    <div className="flex flex-col space-y-5 sm:space-x-5 justify-items-stretch sm:space-y-0 sm:flex-row">
      <div
        className={`${
          tab === '1'
            ? 'flex flex-col basis-0 flex-grow rounded-full px-4 h-12 bg-white shadow'
            : 'flex flex-col basis-0 flex-grow rounded-full px-4 h-12 bg-neutral-100'
        }`}
        onClick={() => handleTabChange('1')}
      >
        <div>Value growth</div>
        <div className="flex">
          <div className="flex-grow font-bold">
            <Skeleton {...skeletonProps}>
              {formatCurrency(topBarData.total_value_gain)}
            </Skeleton>
          </div>
          <div className="flex flex-row-reverse flex-grow">
            <div className="min-w-16">
              <Skeleton {...skeletonProps_full_width}>
                {formatCurrency(topBarData.total_value)}
              </Skeleton>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          tab === '2'
            ? 'flex flex-col basis-0 flex-grow rounded-full px-4 h-12 bg-white shadow'
            : 'flex flex-col basis-0 flex-grow rounded-full px-4 h-12 bg-neutral-100'
        }`}
        onClick={() => handleTabChange('2')}
      >
        <div>Received dividends</div>
        <div className="flex">
          <div className="flex-grow font-bold">
            <Skeleton {...skeletonProps}>
              {formatCurrency(topBarData.total_dividends)}
            </Skeleton>
          </div>
          <div className="flex-grow"></div>
        </div>
      </div>
      <div
        className={`${
          tab === '3'
            ? 'flex flex-col basis-0 flex-grow rounded-full px-4 h-12 bg-white shadow'
            : 'flex flex-col basis-0 flex-grow rounded-full px-4 h-12 bg-neutral-100'
        }`}
        onClick={() => handleTabChange('3')}
      >
        <div>Made expenses</div>
        <div className="flex">
          <div className="flex-grow font-bold">
            <Skeleton {...skeletonProps}>
              {formatCurrency(topBarData.total_dividends)}
            </Skeleton>
          </div>
          <div className="flex-grow"></div>
        </div>
      </div>
      <div
        className={`${
          tab === '4'
            ? 'flex flex-col basis-0 flex-grow rounded-full px-4 h-12 bg-white shadow'
            : 'flex flex-col basis-0 flex-grow rounded-full px-4 h-12 bg-neutral-100'
        }`}
        onClick={() => handleTabChange('4')}
      >
        <div>Total gains</div>
        <div className="flex">
          <div className="flex-grow font-bold">
            <Skeleton {...skeletonProps}>
              {formatCurrency(topBarData.total_pl)}
            </Skeleton>
          </div>
          <div className="flex flex-row-reverse flex-grow">
            <div className="min-w-16">
              <Skeleton {...skeletonProps_full_width}>
                {PercentageFormat(topBarData.total_pl_percentage)}
              </Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
