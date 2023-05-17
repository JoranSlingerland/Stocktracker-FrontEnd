import { cachedFetch, overwriteCachedFetch } from '../utils/api';

function getTableDataBasic({
  dispatcher,
  abortController,
  body,
  overWrite,
}: {
  dispatcher: any;
  abortController: AbortController;
  body: {
    containerName:
      | 'totals'
      | 'stocks_held'
      | 'input_invested'
      | 'input_transactions';
    fullyRealized?: boolean;
    partialRealized?: boolean;
    andOr?: 'and' | 'or';
    symbol?: string;
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

async function getUserData({ overWrite }: { overWrite?: boolean }) {
  if (overWrite) {
    return await overwriteCachedFetch({
      url: `/api/data/get_user_data`,
      method: 'POST',
      fallback_data: {},
    }).then((data) => {
      return data;
    });
  } else {
    return await cachedFetch({
      url: `/api/data/get_user_data`,
      method: 'POST',
      fallback_data: {},
    }).then((data) => {
      return data;
    });
  }
}

export { getTableDataBasic, getTableDataPerformance, getUserData };
