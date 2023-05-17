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

export { getTableDataBasic };
