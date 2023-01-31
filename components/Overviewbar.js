// components\Overviewbar.js

import { useRouter } from 'next/router';
import { Spin } from 'antd';
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

  return (
    <div>
      <div className="grid grid-cols-1 grid-rows-4 gap-4 p-2 sm:grid-rows-2 sm:grid-cols-2 lg:grid-rows-1 lg:grid-cols-4">
        <div
          className={`${
            tab === '1'
              ? 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-white shadow'
              : 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-neutral-100'
          }`}
          onClick={() => handleTabChange('1')}
        >
          <div className="text-black">
            <Spin spinning={loading}>
              <div className="px-5">Value growth</div>
              <div className="grid grid-cols-2 grid-rows-1 px-5">
                <div className="font-bold">
                  {formatCurrency(topBarData.total_value_gain)}
                </div>
                <div className="text-right">
                  {formatCurrency(topBarData.total_value)}
                </div>
              </div>
            </Spin>
          </div>
        </div>
        <div
          className={`${
            tab === '2'
              ? 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-white shadow'
              : 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-neutral-100'
          }`}
          onClick={() => handleTabChange('2')}
        >
          <div className="text-black">
            <Spin spinning={loading}>
              <div className="px-5">Received dividends</div>
              <div className="px-5 font-bold">
                {formatCurrency(topBarData.total_dividends)}
              </div>
            </Spin>
          </div>
        </div>
        <div
          className={`${
            tab === '3'
              ? 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-white shadow'
              : 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-neutral-100'
          }`}
          onClick={() => handleTabChange('3')}
        >
          <div className="text-black">
            <Spin spinning={loading}>
              <div className="px-5">Made expenses</div>
              <div className="px-5 font-bold">
                {formatCurrency(topBarData.transaction_cost)}
              </div>
            </Spin>
          </div>
        </div>
        <div
          className={`${
            tab === '4'
              ? 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-white shadow transition-all'
              : 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-neutral-100'
          }`}
          onClick={() => handleTabChange('4')}
        >
          <div className="text-black">
            <Spin spinning={loading}>
              <div className="px-5">Total gains</div>
              <div className="grid grid-cols-2 grid-rows-1 px-5 font-bold ">
                <div>{formatCurrency(topBarData.total_pl)}</div>
                <div className="text-right">
                  {PercentageFormat(topBarData.total_pl_percentage)}
                </div>
              </div>
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
}
