import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { Spin } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

const Tabs = ({ router, topBarData, loading }) => {
  const formatCurrency = (value) => {
    return value.toLocaleString('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  const formatPercentage = (value) => {
    return value.toLocaleString('nl-NL', {
      style: 'percent',
      minimumFractionDigits: 2,
    });
  };

  const {
    query: { tab, date },
  } = router;
  const isTabOne = tab === '1' || tab == null;
  const isTabTwo = tab === '2';
  const isTabThree = tab === '3';
  const isTabFour = tab === '4';

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
            isTabOne
              ? 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-slate-300'
              : 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-slate-100'
          }`}
        >
          <Link
            href={{
              pathname: '/authenticated/performance/',
              query: { tab: '1', date: date },
            }}
          >
            <div>
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
          </Link>
        </div>
        <div
          className={`${
            isTabTwo
              ? 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-slate-300'
              : 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-slate-100'
          }`}
        >
          <Link
            href={{
              pathname: '/authenticated/performance/',
              query: { tab: '2', date: date },
            }}
          >
            <div>
              <Spin spinning={loading}>
                <div className="px-5">Received dividends</div>
                <div className="px-5 font-bold">
                  {formatCurrency(topBarData.total_dividends)}
                </div>
              </Spin>
            </div>
          </Link>
        </div>
        <div
          className={`${
            isTabThree
              ? 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-slate-300'
              : 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-slate-100'
          }`}
        >
          <Link
            href={{
              pathname: '/authenticated/performance/',
              query: { tab: '3', date: date },
            }}
          >
            <div>
              <Spin spinning={loading}>
                <div className="px-5">Made expenses</div>
                <div className="px-5 font-bold">
                  {formatCurrency(topBarData.transaction_cost)}
                </div>
              </Spin>
            </div>
          </Link>
        </div>
        <div
          className={`${
            isTabFour
              ? 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-slate-300'
              : 'grid h-12 grid-cols-1 grid-rows-2 rounded-full bg-slate-100'
          }`}
        >
          <Link
            href={{
              pathname: '/authenticated/performance/',
              query: { tab: '4', date: date },
            }}
          >
            <div>
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
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Tabs);
