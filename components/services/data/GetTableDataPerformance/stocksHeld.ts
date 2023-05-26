import { cachedFetch } from '../../../utils/api';
import { StocksHeldData } from '../../../types/types';
import { stocksHeldData } from '../../../constants/placeholders';
import { useFetch } from '../../../hooks/useFetch';

interface GetTableDataPerformanceBodyStocksHeld extends SharedBody {
  dataType: 'stocks_held';
}

async function getTableDataPerformanceStocksHeld({
  abortController,
  body,
  fallback_data = [],
}: {
  abortController: AbortController;
  body: GetTableDataPerformanceBodyStocksHeld;
  fallback_data?: StocksHeldData[];
}) {
  const response = await cachedFetch({
    url: `/api/data/get_table_data_performance`,
    method: 'POST',
    body,
    controller: abortController,
    fallback_data,
  });
  return response;
}

function useTableDataPerformanceStocksHeld({
  body,
  enabled = true,
  background = false,
}: {
  body: GetTableDataPerformanceBodyStocksHeld;
  enabled?: boolean;
  background?: boolean;
}) {
  const fetchResult = useFetch<
    GetTableDataPerformanceBodyStocksHeld,
    StocksHeldData[]
  >({
    body,
    fetchData: getTableDataPerformanceStocksHeld,
    enabled,
    background,
    overwrite: true,
    initialData: [stocksHeldData],
  });
  return fetchResult;
}

export { useTableDataPerformanceStocksHeld };
