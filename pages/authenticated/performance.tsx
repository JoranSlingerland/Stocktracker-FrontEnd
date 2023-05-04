import Overviewbar from '../../components/Overviewbar';
import React, { useState, useEffect, useReducer } from 'react';
import { Divider, Segmented, Typography } from 'antd';
import { useRouter } from 'next/router';
import BasicLineGraph from '../../components/PrimeFaceLineGraph';
import PrimeFaceBarChart from '../../components/PrimeFaceBarChart';
import {
  cachedFetch_2,
  apiRequestReducer,
  initialState,
} from '../../utils/api-utils';
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

export default function performance({
  userInfo,
  userSettings,
}: {
  userInfo: UserInfo_Type;
  userSettings: UserSettings_Type;
}) {
  // const setup
  const router = useRouter();
  const [valueGrowthData, valueGrowthDataReducer] = useReducer(
    apiRequestReducer,
    initialState({
      fallback_data: valueGrowthDataFallBackObject,
      isLoading: true,
    })
  );
  const [dividendData, dividendDataReducer] = useReducer(
    apiRequestReducer,
    initialState({ fallback_data: [], isLoading: true })
  );
  const [totalGainsData, totalGainsDataReducer] = useReducer(
    apiRequestReducer,
    initialState({
      fallback_data: totalGainsDataFallBackObject,
      isLoading: true,
    })
  );
  const [totalTransactionCostData, totalTransactionCostDataReducer] =
    useReducer(
      apiRequestReducer,
      initialState({ fallback_data: [], isLoading: true })
    );
  const [topBarData, topBarDataReducer] = useReducer(
    apiRequestReducer,
    initialState({ fallback_data: topBarDataFallBackObject, isLoading: true })
  );
  const [SingleDayData, SingleDayDataReducer] = useReducer(
    apiRequestReducer,
    initialState({ isLoading: true })
  );
  const [tab, setTab] = useState<tabNumber>(
    Number(useRouter().query.tab || '1')
  );
  const [date, setDate] = useState<dataToGet>(
    useRouter().query.date?.toString || undefined
  );

  // useEffects
  useEffect(() => {
    if (!router.isReady) {
      return;
    } else {
      setTab(Number(router.query.tab));
      setDate(router.query.date?.toString());
    }
  }, [router]);

  useEffect(() => {
    if (userInfo?.clientPrincipal?.userId && date) {
      const abortController = new AbortController();
      cachedFetch_2({
        url: `/api/data/get_barchart_data`,
        method: 'POST',
        body: {
          userId: userInfo.clientPrincipal.userId,
          dataType: 'dividend',
          dataToGet: date,
        },
        dispatcher: dividendDataReducer,
        controller: abortController,
      });

      cachedFetch_2({
        url: `/api/data/get_barchart_data`,
        method: 'POST',
        body: {
          userId: userInfo.clientPrincipal.userId,
          dataType: 'transaction_cost',
          dataToGet: date,
        },
        dispatcher: totalTransactionCostDataReducer,
        controller: abortController,
      });

      cachedFetch_2({
        url: `/api/data/get_linechart_data`,
        method: 'POST',
        fallback_data: totalGainsDataFallBackObject,
        body: {
          userId: userInfo.clientPrincipal.userId,
          dataType: 'total_gains',
          dataToGet: date,
        },
        dispatcher: totalGainsDataReducer,
        controller: abortController,
      });

      cachedFetch_2({
        url: `/api/data/get_linechart_data`,
        method: 'POST',
        fallback_data: valueGrowthDataFallBackObject,
        body: {
          userId: userInfo.clientPrincipal.userId,
          dataType: 'invested_and_value',
          dataToGet: date,
        },
        dispatcher: valueGrowthDataReducer,
        controller: abortController,
      });

      cachedFetch_2({
        url: `/api/data/get_table_data_performance`,
        method: 'POST',
        body: {
          userId: userInfo.clientPrincipal.userId,
          dataToGet: date,
        },
        dispatcher: SingleDayDataReducer,
        controller: abortController,
      });

      cachedFetch_2({
        url: `/api/data/get_topbar_data`,
        method: 'POST',
        fallback_data: topBarDataFallBackObject,
        body: {
          userId: userInfo.clientPrincipal.userId,
          dataToGet: date,
        },
        dispatcher: topBarDataReducer,
        controller: abortController,
      });
      return () => {
        abortController.abort();
      };
    }
  }, [date, userInfo]);

  // Refresh data
  function handleClick(newdate: dataToGet) {
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
          topBarData={topBarData.data}
          loading={topBarData.isLoading}
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
                  data={valueGrowthData.data}
                  isloading={valueGrowthData.isLoading}
                  userSettings={userSettings}
                />
                <Divider />
                <AntdTable
                  isLoading={SingleDayData.isLoading}
                  columns={valueGrowthColumns}
                  data={SingleDayData.data}
                  globalSorter={true}
                />
              </div>
            </React.Fragment>
          )}
          {tab === 2 && (
            <React.Fragment>
              <PrimeFaceBarChart
                data={dividendData.data}
                isloading={dividendData.isLoading}
                userSettings={userSettings}
              />
              <Divider />
              <AntdTable
                isLoading={SingleDayData.isLoading}
                columns={ReceivedDividedColumns}
                data={SingleDayData.data}
                globalSorter={true}
              />
            </React.Fragment>
          )}
          {tab === 3 && (
            <React.Fragment>
              <PrimeFaceBarChart
                data={totalTransactionCostData.data}
                isloading={totalTransactionCostData.isLoading}
                userSettings={userSettings}
              />
              <Divider />
              <AntdTable
                isLoading={SingleDayData.isLoading}
                columns={TransactionCostColumns}
                data={SingleDayData.data}
                globalSorter={true}
              />
            </React.Fragment>
          )}
          {tab === 4 && (
            <React.Fragment>
              <div>
                <BasicLineGraph
                  data={totalGainsData.data}
                  isloading={totalGainsData.isLoading}
                  userSettings={userSettings}
                />
                <Divider />
                <AntdTable
                  isLoading={SingleDayData.isLoading}
                  columns={valueGrowthColumns}
                  data={SingleDayData.data}
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
