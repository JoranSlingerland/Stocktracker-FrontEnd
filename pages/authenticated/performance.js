import Overviewbar from '../../components/Overviewbar';
import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { withRouter } from 'next/router';
// import BasicLineGraph from '../../components/BasicLineGraph';
import PrimeFaceTable from '../../components/PrimeFaceTable';
import PrimeFaceBarChart from '../../components/PrimeFaceBarChart';

const Tabs = ({ router }) => {
  const {
    query: { tab, date },
  } = router;
  const isTabOne = tab === '1' || tab == null;
  const isTabTwo = tab === '2';
  const isTabThree = tab === '3';
  const isTabFour = tab === '4';

  const isDateMax = date === 'max' || date == null;
  const isDateYear = date === 'year';
  const isDateMonth = date === 'month';
  const isDateWeek = date === 'week';
  const isDateYTD = date === 'ytd';

  const [valueGrowthData, setvalueGrowthData] = useState([]);
  const [loading, setvalueGrowthDataLoading] = useState(true);

  const [dividendData, setdividendData] = useState([]);
  const [loadingDividend, setLoadingDividend] = useState(true);

  const [totalGainsData, settotalGainsData] = useState([]);
  const [totalGainsDataLoading, settotalGainsDataLoading] = useState(true);

  const [totalTransactionCostData, settotalTransactionCostData] = useState([]);
  const [totalTransactionCostDataLoading, settotalTransactionCostDataLoading] =
    useState(true);

  async function fetchTotalGainsData() {
    const response = await fetch(`/api/get_linechart_data/total_gains/${date}`);
    const data = await response.json();
    settotalGainsData(data);
    settotalGainsDataLoading(false);
  }

  async function fetchDataline() {
    const response = await fetch(
      `/api/get_linechart_data/invested_and_value/${date}`
    );
    const valueGrowthData = await response.json();
    setvalueGrowthData(valueGrowthData);
    setvalueGrowthDataLoading(false);
  }

  async function fetchDividendData() {
    const response = await fetch(`/api/get_barchart_data/dividend/${date}`);
    const dividendData = await response.json();
    setdividendData(dividendData);
    setLoadingDividend(false);
  }
  const [topBarData, settopBarData] = useState({
    total_value: '',
    total_value_gain: '',
    total_pl: '',
    total_pl_percentage: '',
    total_dividends: '',
    transaction_cost: '',
  });

  async function fetchTopBar() {
    const response = await fetch(`/api/get_topbar_data/${date}`);
    const topBarData = await response.json();
    settopBarData(topBarData);
    settopBarLoading(false);
  }

  async function fetchTransactionCostData() {
    const response = await fetch(
      `/api/get_barchart_data/transaction_cost/${date}`
    );
    const totalTransactionCostData = await response.json();
    settotalTransactionCostData(totalTransactionCostData);
    settotalTransactionCostDataLoading(false);
  }

  const [topBarloading, settopBarLoading] = useState(true);

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

  function handleClick(newdate) {
    setvalueGrowthDataLoading(true);
    settopBarLoading(true);
    setLoadingDividend(true);
    settotalTransactionCostDataLoading(true);
    settotalGainsDataLoading(true);
    setSingleDayDataisLoading(true);
    router.push(`/authenticated/performance?tab=${tab}&date=${newdate}`);
    date = newdate;
    fetchDataline();
    fetchTopBar();
    fetchDividendData();
    fetchTransactionCostData();
    fetchTotalGainsData();
    fetchTable();
  }

  const [SingleDayData, setSingleDayData] = useState(null);
  const [SingleDayDataisLoading, setSingleDayDataisLoading] = useState(true);

  async function fetchTable() {
    const response = await fetch(`/api/get_table_data_performance/${date}`);
    const SingleDayData = await response.json();
    setSingleDayData(SingleDayData);
    setSingleDayDataisLoading(false);
  }

  useEffect(() => {
    fetchDataline();
    fetchTopBar();
    fetchTable();
    fetchTotalGainsData();
    fetchDividendData();
    fetchTransactionCostData();
  }, []);
  return (
    <div className="w-full">
      {/* Title */}
      <div className="grid grid-cols-2 grid-rows-1">
        <div className="flex px-5 py-2 text-2xl">
          <h1>Performance</h1>
        </div>
        <div className="flex flex-row-reverse p-3 gap-x-1">
          <div
            onClick={() => handleClick('max')}
            className={`${
              isDateMax
                ? 'h-6 px-2 rounded-full bg-slate-300'
                : 'h-6 px-2 rounded-full bg-slate-100'
            }`}
          >
            Max
          </div>
          <div
            onClick={() => handleClick('year')}
            className={`${
              isDateYear
                ? 'h-6 px-2 rounded-full bg-slate-300'
                : 'h-6 px-2 rounded-full bg-slate-100'
            }`}
          >
            Year
          </div>
          <div
            onClick={() => handleClick('month')}
            className={`${
              isDateMonth
                ? 'h-6 px-2 rounded-full bg-slate-300'
                : 'h-6 px-2 rounded-full bg-slate-100'
            }`}
          >
            Month
          </div>
          <div
            onClick={() => handleClick('week')}
            className={`${
              isDateWeek
                ? 'h-6 px-2 rounded-full bg-slate-300'
                : 'h-6 px-2 rounded-full bg-slate-100'
            }`}
          >
            Week
          </div>
          <div
            onClick={() => handleClick('ytd')}
            className={`${
              isDateYTD
                ? 'h-6 px-2 rounded-full bg-slate-300'
                : 'h-6 px-2 rounded-full bg-slate-100'
            }`}
          >
            YTD
          </div>
        </div>
      </div>
      <div>
        <Overviewbar topBarData={topBarData} loading={topBarloading} />
      </div>
      <div>
        <div>
          {isTabOne && (
            <React.Fragment>
              <div>
                {/* <BasicLineGraph data={valueGrowthData} isloading={loading} /> */}
                <Divider />
                <PrimeFaceTable
                  loading={SingleDayDataisLoading}
                  columns={valueGrowthColumns}
                  data={SingleDayData}
                />
              </div>
            </React.Fragment>
          )}
          {isTabTwo && (
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
          {isTabThree && (
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
          {isTabFour && (
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
};

export default withRouter(Tabs);
