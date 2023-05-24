import { cachedFetch, overwriteCachedFetch } from '../../../utils/api';
import { StocksHeldData } from '../../../types/types';
import useFetch from '../../../hooks/useFetch';

interface GetTableDataBasicBody {
  containerName: 'stocks_held';
  fullyRealized?: boolean;
  partialRealized?: boolean;
  andOr?: 'and' | 'or';
  symbol?: string;
}

async function getTableDataBasicStocksHeld({
  abortController,
  body,
  overWrite,
}: {
  abortController: AbortController;
  body: GetTableDataBasicBody;
  overWrite?: boolean;
}) {
  if (overWrite) {
    const response = await overwriteCachedFetch({
      url: `/api/data/get_table_data_basic`,
      method: 'POST',
      body,
      controller: abortController,
      background: true,
    });
    return response;
  } else {
    const response = await cachedFetch({
      url: `/api/data/get_table_data_basic`,
      method: 'POST',
      body,
      controller: abortController,
    });
    return response;
  }
}

function useTableDataBasicStocksHeld({
  body,
  enabled = true,
  overWrite = false,
}: {
  body: GetTableDataBasicBody;
  enabled?: boolean;
  overWrite?: boolean;
}) {
  const fetchResult = useFetch<GetTableDataBasicBody, StocksHeldData[]>({
    body,
    fetchData: getTableDataBasicStocksHeld,
    enabled,
    overWrite,
  });

  return fetchResult;
}

export { useTableDataBasicStocksHeld };
