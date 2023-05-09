import { cachedFetch, overwriteCachedFetch } from '../utils/api';

function getBarchartData({
  dispatcher,
  abortController,
  body,
}: {
  dispatcher: any;
  abortController: AbortController;
  body: {
    userId: string;
    allData: boolean;
    startDate?: string;
    endDate?: string;
    dataType: 'dividend' | 'transaction_cost';
  };
}) {
  cachedFetch({
    url: `/api/data/get_barchart_data`,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
  });
}

function getLineChartData({
  dispatcher,
  abortController,
  body,
  fallback_data = [],
}: {
  dispatcher: any;
  abortController: AbortController;
  body: {
    userId: string;
    allData: boolean;
    startDate?: string;
    endDate?: string;
    dataType: 'total_gains' | 'invested_and_value';
  };
  fallback_data?: any;
}) {
  cachedFetch({
    url: `/api/data/get_linechart_data`,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
    fallback_data,
  });
}

function getPieData({
  dispatcher,
  abortController,
  body,
}: {
  dispatcher: any;
  abortController: AbortController;
  body: {
    userId: string;
    dataType: 'stocks' | 'country' | 'sector' | 'currency';
  };
}) {
  const fallbackObject = {
    labels: [],
    data: [],
    color: [],
  };

  cachedFetch({
    url: `/api/data/get_pie_data`,
    fallback_data: fallbackObject,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
  });
}

function getTableDataBasic({
  dispatcher,
  abortController,
  body,
  overWrite,
}: {
  dispatcher: any;
  abortController: AbortController;
  body: {
    userId: string;
    containerName:
      | 'totals'
      | 'stocks_held'
      | 'input_invested'
      | 'input_transactions';
    fullyRealized?: boolean;
    partialRealized?: boolean;
    andOr?: 'and' | 'or';
  };
  overWrite?: boolean;
}) {
  if (overWrite) {
    overwriteCachedFetch({
      url: `/api/data/get_table_data_basic`,
      method: 'POST',
      body,
      dispatcher,
      controller: abortController,
      background: true,
    });
  } else {
    cachedFetch({
      url: `/api/data/get_table_data_basic`,
      method: 'POST',
      body,
      dispatcher,
      controller: abortController,
    });
  }
}

function getTableDataPerformance({
  dispatcher,
  abortController,
  body,
  fallback_data = [],
}: {
  dispatcher: any;
  abortController: AbortController;
  body: {
    userId: string;
    allData: boolean;
    startDate?: string;
    endDate?: string;
    dataType: 'stocks_held' | 'totals';
  };
  fallback_data?: any;
}) {
  cachedFetch({
    url: `/api/data/get_table_data_performance`,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
    fallback_data,
  });
}

async function getUserData({
  body,
  overWrite,
}: {
  body: {
    userId: string;
  };
  overWrite?: boolean;
}) {
  if (overWrite) {
    return await overwriteCachedFetch({
      url: `/api/data/get_user_data`,
      method: 'POST',
      fallback_data: {},
      body,
    }).then((data) => {
      return data;
    });
  } else {
    return await cachedFetch({
      url: `/api/data/get_user_data`,
      method: 'POST',
      fallback_data: {},
      body,
    }).then((data) => {
      return data;
    });
  }
}

export {
  getBarchartData,
  getLineChartData,
  getPieData,
  getTableDataBasic,
  getTableDataPerformance,
  getUserData,
};
