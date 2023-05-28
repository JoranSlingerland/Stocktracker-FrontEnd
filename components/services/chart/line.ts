import { cachedFetch } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';

interface GetLineChartDataQuery {
  allData: boolean;
  startDate?: string;
  endDate?: string;
  dataType: 'total_gains' | 'invested_and_value';
}

interface DataSets {
  label: string;
  data: number[];
}

interface LineChartData {
  labels: string[];
  datasets: DataSets[];
}

async function getLineChartData({
  abortController,
  query,
}: {
  abortController: AbortController;
  query?: GetLineChartDataQuery;
}) {
  const fallback_data = {
    labels: [],
    datasets: [],
  };

  const response = await cachedFetch({
    url: `/api/chart/line`,
    method: 'GET',
    query,
    controller: abortController,
    fallback_data,
  });
  return response;
}

function useLineChartData({
  query,
  enabled = true,
}: {
  query: GetLineChartDataQuery;
  enabled?: boolean;
}) {
  const fetchResult = useFetch<undefined, GetLineChartDataQuery, LineChartData>(
    {
      query,
      enabled,
      fetchData: getLineChartData,
    }
  );

  return fetchResult;
}

export { useLineChartData };

export type { LineChartData };
