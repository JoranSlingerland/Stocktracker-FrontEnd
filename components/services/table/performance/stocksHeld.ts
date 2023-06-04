import { stocksHeldData } from '../../../constants/placeholders';
import { useFetch } from '../../../hooks/useFetch';
import { SharedQuery, getTableDataPerformance } from './shared';

interface GetTableDataPerformanceQueryStocksHeld extends SharedQuery {
  containerName: 'stocks_held';
}

function useTableDataPerformanceStocksHeld({
  query,
  enabled = true,
  background = false,
}: {
  query: GetTableDataPerformanceQueryStocksHeld;
  enabled?: boolean;
  background?: boolean;
}) {
  const fetchResult = useFetch<
    undefined,
    GetTableDataPerformanceQueryStocksHeld,
    StocksHeldData[]
  >({
    query,
    fetchData: getTableDataPerformance,
    enabled,
    background,
    initialData: [stocksHeldData],
  });
  return fetchResult;
}

export { useTableDataPerformanceStocksHeld };
