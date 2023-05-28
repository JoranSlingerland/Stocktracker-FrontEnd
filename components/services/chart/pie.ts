import { cachedFetch } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';

interface GetPieChartDataQuery {
  dataType: 'stocks' | 'country' | 'sector' | 'currency';
}

interface PieChartData {
  labels: string[];
  data: number[];
  color: string[];
}

async function getPieData({
  abortController,
  query,
}: {
  abortController: AbortController;
  query?: GetPieChartDataQuery;
}) {
  const fallback_data = {
    labels: [],
    data: [],
    color: [],
  };

  const response = await cachedFetch({
    url: `/api/chart/pie`,
    fallback_data,
    method: 'GET',
    query,
    controller: abortController,
  });
  return response;
}

function usePieData({
  query,
  enabled,
}: {
  query: GetPieChartDataQuery;
  enabled: boolean;
}) {
  const fetchResult = useFetch<undefined, GetPieChartDataQuery, PieChartData>({
    query,
    fetchData: getPieData,
    enabled,
  });

  return fetchResult;
}

export { usePieData };

export type { PieChartData };
