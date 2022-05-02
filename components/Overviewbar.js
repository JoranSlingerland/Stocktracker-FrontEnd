import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { Spin } from 'antd';

const Tabs = ({ router }) => {
  const [topBarData, settopBarData] = useState([
    {
      date: '',
      total_cost: '',
      total_value: '',
      total_invested: '',
      total_pl: '',
      total_pl_percentage: '',
    },
  ]);

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/get_table_data/single_day_totals`);
      const topBarData = await response.json();
      settopBarData(topBarData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const {
    query: { tab },
  } = router;
  const isTabOne = tab === '1' || tab == null;
  const isTabTwo = tab === '2';
  const isTabThree = tab === '3';
  const isTabFour = tab === '4';
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
              query: { tab: '1' },
            }}
          >
            <div>
              <div className="px-5">Value</div>
              <Spin spinning={loading}>
                <div className="px-5 font-bold">
                  {formatCurrency(topBarData[0].total_value)}
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
              query: { tab: '2' },
            }}
          >
            <div>
              <div className="px-5">Received dividends</div>
              <div className="px-5 font-bold">Coming soon</div>
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
              query: { tab: '3' },
            }}
          >
            <div>
              <div className="px-5">Made expenses</div>
              <div className="px-5 font-bold">Coming soon</div>
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
              query: { tab: '4' },
            }}
          >
            <div>
              <div className="px-5">Total gains</div>
              <Spin spinning={loading}>
                <div className="grid grid-cols-2 grid-rows-1 px-5 font-bold ">
                  <div>{formatCurrency(topBarData[0].total_pl)}</div>
                  <div className="text-right">
                    {formatPercentage(topBarData[0].total_pl_percentage)}
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
