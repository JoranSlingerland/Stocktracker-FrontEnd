import Overviewbar from '../../components/Overviewbar';
import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { withRouter } from 'next/router';
import BasicLineGraph from '../../components/BasicLineGraph';
import PrimeFaceTable from '../../components/PrimeFaceTable';

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
  const [loading, setLoading] = useState(true);

  async function fetchDataline() {
    const response = await fetch(
      `/api/get_linechart_data/invested_and_value/${date}`
    );
    const valueGrowthData = await response.json();
    setvalueGrowthData(valueGrowthData);
    setLoading(false);
  }
  useEffect(() => {
    fetchDataline();
    fetchTopBar();
  }, []);

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

  const [topBarloading, settopBarLoading] = useState(true);

  async function fetchTopBar() {
    const response = await fetch(`/api/get_table_data/single_day_totals`);
    const topBarData = await response.json();
    settopBarData(topBarData);
    settopBarLoading(false);
  }

  const valueGrowthColumns = [
    {
      header: 'Name',
      field: 'name',
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

  function handleClick(newdate) {
    setLoading(true);
    router.push(`/authenticated/performance?tab=1&date=${newdate}`);
    date = newdate;
    fetchDataline();
  }

  const [SingleDayData, setSingleDayData] = useState(null);
  const [SingleDayDataisLoading, setSingleDayDataisLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/get_table_data/single_day/`);
      const SingleDayData = await response.json();
      setSingleDayData(SingleDayData);
      setSingleDayDataisLoading(false);
    }
    fetchData();
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
                <BasicLineGraph data={valueGrowthData} isloading={loading} />
                <Divider />
                <PrimeFaceTable
                  loading={SingleDayDataisLoading}
                  columns={valueGrowthColumns}
                  data={SingleDayData}
                />
              </div>
            </React.Fragment>
          )}
          {isTabTwo && <React.Fragment>This is tab two content</React.Fragment>}
          {isTabThree && (
            <React.Fragment>This is tab three content</React.Fragment>
          )}
          {isTabFour && (
            <React.Fragment>This is tab four content</React.Fragment>
          )}
        </div>
      </div>
      {/* Content */}
    </div>
  );
};

export default withRouter(Tabs);
