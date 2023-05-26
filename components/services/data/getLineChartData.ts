import { cachedFetch } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';

interface GetLineChartDataBody {
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
  body,
}: {
  abortController: AbortController;
  body: GetLineChartDataBody;
  fallback_data?: LineChartData;
}) {
  const fallback_data = {
    labels: [],
    datasets: [],
  };

  const response = await cachedFetch({
    url: `/api/data/get_linechart_data`,
    method: 'POST',
    body,
    controller: abortController,
    fallback_data,
  });
  return response;
}

function useLineChartData({
  body,
  enabled = true,
}: {
  body: GetLineChartDataBody;
  enabled?: boolean;
}) {
  const fetchResult = useFetch<GetLineChartDataBody, LineChartData>({
    body,
    enabled,
    fetchData: getLineChartData,
  });

  return fetchResult;
}

export { useLineChartData };

export type { LineChartData };
