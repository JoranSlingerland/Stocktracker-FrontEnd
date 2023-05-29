import { TotalsData } from '../../../types/types';
import { totalsData } from '../../../constants/placeholders';
import { useFetch } from '../../../hooks/useFetch';
import { SharedQuery, getTableDataPerformance } from './shared';

// Totals
interface GetTableDataPerformanceQueryTotals extends SharedQuery {
  containerName: 'totals';
}

function useTableDataPerformanceTotals({
  query,
  enabled = true,
  background = false,
}: {
  query: GetTableDataPerformanceQueryTotals;
  enabled?: boolean;
  background?: boolean;
}) {
  const fetchResult = useFetch<
    undefined,
    GetTableDataPerformanceQueryTotals,
    TotalsData[]
  >({
    query,
    fetchData: getTableDataPerformance,
    enabled,
    background,
    initialData: [totalsData],
  });
  return fetchResult;
}

export { useTableDataPerformanceTotals };
