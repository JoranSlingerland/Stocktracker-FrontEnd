import { cachedFetch } from '../../../utils/api';
import { TotalsData } from '../../../types/types';
import { totalsData } from '../../../constants/placeholders';
import { useFetch } from '../../../hooks/useFetch';

// Totals
interface GetTableDataPerformanceBodyTotals extends SharedBody {
  dataType: 'totals';
}

async function getTableDataPerformanceTotals({
  abortController,
  body,
  fallback_data = [],
}: {
  abortController: AbortController;
  body: GetTableDataPerformanceBodyTotals;
  fallback_data?: TotalsData[];
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

function useTableDataPerformanceTotals({
  body,
  enabled = true,
  background = false,
}: {
  body: GetTableDataPerformanceBodyTotals;
  enabled?: boolean;
  background?: boolean;
}) {
  const fetchResult = useFetch<GetTableDataPerformanceBodyTotals, TotalsData[]>(
    {
      body,
      fetchData: getTableDataPerformanceTotals,
      enabled,
      background,
      overwrite: true,
      initialData: [totalsData],
    }
  );
  return fetchResult;
}

export { useTableDataPerformanceTotals };
