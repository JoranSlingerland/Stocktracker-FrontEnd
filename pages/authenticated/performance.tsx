import Overviewbar from '../../components/Overviewbar';
import React, { useState, useEffect } from 'react';
import { Divider, Segmented, Typography } from 'antd';
import { useRouter } from 'next/router';
import BasicLineGraph from '../../components/PrimeFaceLineGraph';
import PrimeFaceBarChart from '../../components/PrimeFaceBarChart';
import { cachedFetch } from '../../utils/api-utils';
import AntdTable from '../../components/antdTable';
import {
  formatCurrency,
  formatCurrencyWithColors,
  formatPercentageWithColors,
  formatImageAndText,
} from '../../utils/formatting';
import { UserInfo_Type, UserSettings_Type } from '../../utils/types';
import { SegmentedValue } from 'rc-segmented';
import type { ColumnsType } from 'antd/es/table';

type dataToGet = undefined | string | SegmentedValue;
type tabNumber = undefined | number;

const { Title } = Typography;

const topBarDataFallBackObject = {
  total_value_gain: '',
  total_value_gain_percentage: '',
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

async function fetchDividendData(userInfo: UserInfo_Type, date: dataToGet) {
  const data = await cachedFetch(`/api/data/get_barchart_data`, [], 'POST', {
    userId: userInfo.clientPrincipal.userId,
    dataType: 'dividend',
    dataToGet: date,
  });
  return { data: data, loading: false };
}

async function fetchTransactionCostData(
  userInfo: UserInfo_Type,
  date: dataToGet
) {
  const data = await cachedFetch(`/api/data/get_barchart_data`, [], 'POST', {
    userId: userInfo.clientPrincipal.userId,
    dataType: 'transaction_cost',
    dataToGet: date,
  });
  return { data: data, loading: false };
}

async function fetchTotalGainsData(userInfo: UserInfo_Type, date: dataToGet) {
  const data = await cachedFetch(
    `/api/data/get_linechart_data`,
    totalGainsDataFallBackObject,
    'POST',
    {
      userId: userInfo.clientPrincipal.userId,
      dataType: 'total_gains',
      dataToGet: date,
    }
  );
  return { data: data, loading: false };
}

async function fetchDataline(userInfo: UserInfo_Type, date: dataToGet) {
  const data = await cachedFetch(
    `/api/data/get_linechart_data`,
    valueGrowthDataFallBackObject,
    'POST',
    {
      userId: userInfo.clientPrincipal.userId,
      dataType: 'invested_and_value',
      dataToGet: date,
    }
  );
  return { data: data, loading: false };
}

async function fetchTable(userInfo: UserInfo_Type, date: dataToGet) {
  const data = await cachedFetch(
    `/api/data/get_table_data_performance`,
    [],
    'POST',
    {
      userId: userInfo.clientPrincipal.userId,
      dataToGet: date,
    }
  );
  return { data: data, loading: false };
}

async function fetchTopBar(userInfo: UserInfo_Type, date: dataToGet) {
  const data = await cachedFetch(
    `/api/data/get_topbar_data`,
    topBarDataFallBackObject,
    'POST',
    {
      userId: userInfo.clientPrincipal.userId,
      dataToGet: date,
    }
  );
  return { data: data, loading: false };
}

export default function performance({
  userInfo,
  userSettings,
}: {
  userInfo: UserInfo_Type;
  userSettings: UserSettings_Type;
}) {
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
  const [tab, setTab] = useState<tabNumber>(
    Number(useRouter().query.tab || '1')
  );
  const [date, setDate] = useState<dataToGet>(
    useRouter().query.date?.toString || undefined
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    } else {
      setTab(Number(router.query.tab));
      setDate(router.query.date?.toString());
    }
  }, [router]);

  // useEffects
  useEffect(() => {
    if (userInfo?.clientPrincipal?.userId && date) {
      fetchDividendData(userInfo, date).then(({ data, loading }) => {
        setdividendData(data);
        setLoadingDividend(loading);
      });
      fetchTransactionCostData(userInfo, date).then(({ data, loading }) => {
        settotalTransactionCostData(data);
        settotalTransactionCostDataLoading(loading);
      });
      fetchTotalGainsData(userInfo, date).then(({ data, loading }) => {
        settotalGainsData(data);
        settotalGainsDataLoading(loading);
      });
      fetchDataline(userInfo, date).then(({ data, loading }) => {
        setvalueGrowthData(data);
        setvalueGrowthDataLoading(loading);
      });
      fetchTable(userInfo, date).then(({ data, loading }) => {
        setSingleDayData(data);
        setSingleDayDataisLoading(loading);
      });
      fetchTopBar(userInfo, date).then(({ data, loading }) => {
        settopBarData(data);
        settopBarLoading(loading);
      });
    }
  }, [date, userInfo]);

  // Refresh data
  function handleClick(newdate: dataToGet) {
    setvalueGrowthDataLoading(true);
    settopBarLoading(true);
    setLoadingDividend(true);
    settotalTransactionCostDataLoading(true);
    settotalGainsDataLoading(true);
    setSingleDayDataisLoading(true);
    router.push(`/authenticated/performance?tab=${tab}&date=${newdate}`);
    setDate(newdate);
  }

  function handleTabChange(newTab: tabNumber) {
    setTab(newTab);
    router.push(`/authenticated/performance?tab=${newTab}&date=${date}`);
  }

  // Columns

  const valueGrowthColumns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'meta',
      key: 'meta.name',
      render: (text: any, record: any) =>
        formatImageAndText(record.symbol, text.name, record.meta.logo),
    },
    {
      title: 'Profit / Loss',
      dataIndex: 'unrealized',
      key: 'unrealized.total_pl',
      render: (text) => (
        <div>
          <div>
            {formatCurrencyWithColors({
              value: text.total_pl,
              currency: userSettings.currency,
            })}
          </div>
          <div>{formatPercentageWithColors(text.total_pl_percentage)}</div>
        </div>
      ),
    },
  ];

  const ReceivedDividedColumns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'meta',
      key: 'meta.name',
      render: (text: any, record: any) =>
        formatImageAndText(record.symbol, text.name, record.meta.logo),
    },
    {
      title: 'Dividends',
      dataIndex: 'realized',
      key: 'realized.total_dividends',
      render: (text: { total_dividends: string | number }) =>
        formatCurrency({
          value: text.total_dividends,
          currency: userSettings.currency,
        }),
    },
  ];

  const TransactionCostColumns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'meta',
      key: 'meta.name',
      render: (text: any, record: any) =>
        formatImageAndText(record.symbol, text.name, record.meta.logo),
    },
    {
      title: 'Transaction Costs',
      dataIndex: 'realized',
      key: 'realized.transaction_cost',
      render: (text: { transaction_cost: string | number }) =>
        formatCurrency({
          value: text.transaction_cost,
          currency: userSettings.currency,
        }),
    },
  ];

  // Render
  return (
    <div>
      {/* Title */}
      <div className="flex">
        <div className="flex pt-2">
          <Title level={1}>Performance</Title>
        </div>
        <div className="pt-3 ml-auto mr-0 overflow-auto">
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
                label: <div onClick={() => handleClick('month')}>Month</div>,
                value: 'month',
              },
              {
                label: <div onClick={() => handleClick('year')}>Year</div>,
                value: 'year',
              },
              {
                label: <div onClick={() => handleClick('max')}>Max</div>,
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
          userSettings={userSettings}
        />
      </div>
      <div>
        <div></div>
        <div>
          {tab === 1 && (
            <React.Fragment>
              <div>
                <BasicLineGraph
                  data={valueGrowthData}
                  isloading={valueGrowthDataLoading}
                  userSettings={userSettings}
                />
                <Divider />
                <AntdTable
                  isLoading={SingleDayDataisLoading}
                  columns={valueGrowthColumns}
                  data={SingleDayData}
                  globalSorter={true}
                />
              </div>
            </React.Fragment>
          )}
          {tab === 2 && (
            <React.Fragment>
              <PrimeFaceBarChart
                data={dividendData}
                isloading={loadingDividend}
                userSettings={userSettings}
              />
              <Divider />
              <AntdTable
                isLoading={SingleDayDataisLoading}
                columns={ReceivedDividedColumns}
                data={SingleDayData}
                globalSorter={true}
              />
            </React.Fragment>
          )}
          {tab === 3 && (
            <React.Fragment>
              <PrimeFaceBarChart
                data={totalTransactionCostData}
                isloading={totalTransactionCostDataLoading}
                userSettings={userSettings}
              />
              <Divider />
              <AntdTable
                isLoading={SingleDayDataisLoading}
                columns={TransactionCostColumns}
                data={SingleDayData}
                globalSorter={true}
              />
            </React.Fragment>
          )}
          {tab === 4 && (
            <React.Fragment>
              <div>
                <BasicLineGraph
                  data={totalGainsData}
                  isloading={totalGainsDataLoading}
                  userSettings={userSettings}
                />
                <Divider />
                <AntdTable
                  isLoading={SingleDayDataisLoading}
                  columns={valueGrowthColumns}
                  data={SingleDayData}
                  globalSorter={true}
                />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
