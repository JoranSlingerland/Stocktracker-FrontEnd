// pages\authenticated\performance.js

import Overviewbar from '../../components/Overviewbar';
import React, { useState, useEffect } from 'react';
import { Divider, Segmented } from 'antd';
import { useRouter } from 'next/router';
import BasicLineGraph from '../../components/PrimeFaceLineGraph';
import PrimeFaceTable from '../../components/PrimeFaceTable';
import PrimeFaceBarChart from '../../components/PrimeFaceBarChart';
import { cachedFetch } from '../../utils/api-utils.js';

const valueGrowthColumns = [
  {
    header: 'Symbol',
    field: 'symbol',
  },
  {
    header: 'Profit / Loss',
    field: 'total_pl',
  },
  {
    header: 'Percentage',
    field: 'total_pl_percentage',
  },
];

const ReceivedDividedColumns = [
  {
    header: 'Symbol',
    field: 'symbol',
  },
  {
    header: 'Dividends',
    field: 'total_dividends',
  },
];

const TransactionCostColumns = [
  {
    header: 'Symbol',
    field: 'symbol',
  },
  {
    header: 'Transaction Costs',
    field: 'transaction_cost',
  },
];

const topBarDataFallBackObject = {
  total_value: '',
  total_value_gain: '',
  total_pl: '',
  total_pl_percentage: '',
  total_dividends: '',
  transaction_cost: '',
};

const totalGainsDataFallBackObject = {
  labels: [],
  datasets: [
    {
      label: 'Gains',
      borderColor: '#0e8505',
      data: [],
    },
  ],
};

const valueGrowthDataFallBackObject = {
  labels: [],
  datasets: [
    {
      label: 'Value',
      borderColor: '#0e8505',
      data: [],
    },
    {
      label: 'Invested',
      borderColor: '#090a09',
      data: [],
    },
  ],
};

export default function performance() {
  // const setup
  const router = useRouter();
  const [valueGrowthData, setvalueGrowthData] = useState(
    valueGrowthDataFallBackObject
  );
  const [valueGrowthDataLoading, setvalueGrowthDataLoading] = useState(true);
  const [dividendData, setdividendData] = useState([]);
  const [loadingDividend, setLoadingDividend] = useState(true);
  const [totalGainsData, settotalGainsData] = useState(
    totalGainsDataFallBackObject
  );
  const [totalGainsDataLoading, settotalGainsDataLoading] = useState(true);
  const [totalTransactionCostData, settotalTransactionCostData] = useState([]);
  const [totalTransactionCostDataLoading, settotalTransactionCostDataLoading] =
    useState(true);
  const [topBarData, settopBarData] = useState(topBarDataFallBackObject);
  const [topBarloading, settopBarLoading] = useState(true);
  const [SingleDayData, setSingleDayData] = useState(null);
  const [SingleDayDataisLoading, setSingleDayDataisLoading] = useState(true);
  const [tab, setTab] = useState((useRouter().query.tab || 1).toString());
  const [date, setDate] = useState(useRouter().query.date || 'max');

  // Query params
  function setQueryParams() {
    setTab(router.query.tab.toString());
    setDate(router.query.date);
  }

  useEffect(() => {
    if (!router.isReady) {
      return;
    } else {
      setQueryParams();
    }
  }, [router.isReady]);

  // Fetch data
  useEffect(() => {
    async function fetchTotalGainsData() {
      cachedFetch(
        `/api/get_linechart_data/total_gains/${date}`,
        24,
        totalGainsDataFallBackObject
      ).then((data) => {
        settotalGainsData(data);
        settotalGainsDataLoading(false);
      });
    }
    fetchTotalGainsData();
  }, [date]);

  useEffect(() => {
    async function fetchDataline() {
      cachedFetch(
        `/api/get_linechart_data/invested_and_value/${date}`,
        24,
        valueGrowthDataFallBackObject
      ).then((data) => {
        setvalueGrowthData(data);
        setvalueGrowthDataLoading(false);
      });
    }
    fetchDataline();
  }, [date]);

  useEffect(() => {
    async function fetchDividendData() {
      cachedFetch(`/api/get_barchart_data/dividend/${date}`, 24, []).then(
        (data) => {
          setdividendData(data);
          setLoadingDividend(false);
        }
      );
    }
    fetchDividendData();
  }, [date]);

  useEffect(() => {
    async function fetchTopBar() {
      cachedFetch(
        `/api/get_topbar_data/${date}`,
        24,
        topBarDataFallBackObject
      ).then((data) => {
        settopBarData(data);
        settopBarLoading(false);
      });
    }
    fetchTopBar();
  }, [date]);

  useEffect(() => {
    async function fetchTransactionCostData() {
      cachedFetch(
        `/api/get_barchart_data/transaction_cost/${date}`,
        24,
        []
      ).then((data) => {
        settotalTransactionCostData(data);
        settotalTransactionCostDataLoading(false);
      });
    }
    fetchTransactionCostData();
  }, [date]);

  useEffect(() => {
    async function fetchTable() {
      cachedFetch(`/api/get_table_data_performance/${date}`).then((data) => {
        setSingleDayData(data);
        setSingleDayDataisLoading(false);
      });
    }
    fetchTable();
  }, [date]);

  // Refresh data
  function handleClick(newdate) {
    setvalueGrowthDataLoading(true);
    settopBarLoading(true);
    setLoadingDividend(true);
    settotalTransactionCostDataLoading(true);
    settotalGainsDataLoading(true);
    setSingleDayDataisLoading(true);
    router.push(`/authenticated/performance?tab=${tab}&date=${newdate}`);
    setDate(newdate);
  }

  function handleTabChange(newTab) {
    setTab(newTab);
    router.push(`/authenticated/performance?tab=${newTab}&date=${date}`);
  }

  // Render
  return (
    <div className="w-full">
      {/* Title */}
      <div className="grid grid-cols-2 grid-rows-1">
        <div className="flex px-5 py-2 text-2xl">
          <h1>Performance</h1>
        </div>
        <div className="flex flex-row-reverse p-3 overflow-auto gap-x-1">
          <Segmented
            options={[
              {
                label: <div onClick={() => handleClick('ytd')}>YTD</div>,
                value: 'ytd',
              },
              {
                label: <div onClick={() => handleClick('week')}>Week</div>,
                value: 'week',
              },
              {
                label: <div onClick={() => handleClick('Month')}>Month</div>,
                value: 'month',
              },
              {
                label: <div onClick={() => handleClick('Year')}>Year</div>,
                value: 'year',
              },
              {
                label: <div onClick={() => handleClick('Max')}>Max</div>,
                value: 'max',
              },
            ]}
            value={date}
            onChange={(e) => handleClick(e)}
          />
        </div>
      </div>
      <div>
        <Overviewbar
          topBarData={topBarData}
          loading={topBarloading}
          handleTabChange={handleTabChange}
        />
      </div>
      <div>
        <div></div>
        <div>
          {tab === '1' && (
            <React.Fragment>
              <div>
                <BasicLineGraph
                  data={valueGrowthData}
                  isloading={valueGrowthDataLoading}
                />
                <Divider />
                <PrimeFaceTable
                  loading={SingleDayDataisLoading}
                  columns={valueGrowthColumns}
                  data={SingleDayData}
                />
              </div>
            </React.Fragment>
          )}
          {tab === '2' && (
            <React.Fragment>
              <PrimeFaceBarChart
                data={dividendData}
                isloading={loadingDividend}
              />
              <Divider />
              <PrimeFaceTable
                loading={SingleDayDataisLoading}
                columns={ReceivedDividedColumns}
                data={SingleDayData}
              />
            </React.Fragment>
          )}
          {tab === '3' && (
            <React.Fragment>
              <PrimeFaceBarChart
                data={totalTransactionCostData}
                isloading={totalTransactionCostDataLoading}
              />
              <Divider />
              <PrimeFaceTable
                loading={SingleDayDataisLoading}
                columns={TransactionCostColumns}
                data={SingleDayData}
              />
            </React.Fragment>
          )}
          {tab === '4' && (
            <React.Fragment>
              <div>
                <BasicLineGraph
                  data={totalGainsData}
                  isloading={totalGainsDataLoading}
                />
                <Divider />
                <PrimeFaceTable
                  loading={SingleDayDataisLoading}
                  columns={valueGrowthColumns}
                  data={SingleDayData}
                />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
