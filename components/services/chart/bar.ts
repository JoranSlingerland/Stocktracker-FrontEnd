import { cachedFetch } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';

interface GetBarchartDataQuery {
  allData: boolean;
  startDate?: string;
  endDate?: string;
  dataType: 'dividend' | 'transaction_cost';
}

interface BarChartData {
  date: string;
  value: number;
  category: string;
}

async function getBarchartData({
  abortController,
  query,
}: {
  abortController: AbortController;
  query?: GetBarchartDataQuery;
}) {
  const response = await cachedFetch({
    url: `/api/chart/bar`,
    method: 'GET',
    controller: abortController,
    query,
  });
  return response;
}

function useBarchartData({
  query,
  enabled = true,
}: {
  query: GetBarchartDataQuery;
  enabled?: boolean;
}) {
  const fetchResult = useFetch<undefined, GetBarchartDataQuery, BarChartData[]>(
    {
      query,
      fetchData: getBarchartData,
      enabled,
    }
  );

  return fetchResult;
}

export { useBarchartData };

export type { BarChartData };
