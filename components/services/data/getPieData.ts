import { cachedFetch } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';

interface GetPieChartDataBody {
  dataType: 'stocks' | 'country' | 'sector' | 'currency';
}

interface PieChartData {
  labels: string[];
  data: number[];
  color: string[];
}

async function getPieData({
  abortController,
  body,
}: {
  abortController: AbortController;
  body: GetPieChartDataBody;
}) {
  const fallback_data = {
    labels: [],
    data: [],
    color: [],
  };

  const response = await cachedFetch({
    url: `/api/data/get_pie_data`,
    fallback_data,
    method: 'POST',
    body,
    controller: abortController,
  });
  return response;
}

function usePieData({
  body,
  enabled,
}: {
  body: GetPieChartDataBody;
  enabled: boolean;
}) {
  const fetchResult = useFetch<GetPieChartDataBody, PieChartData>({
    body,
    fetchData: getPieData,
    enabled,
  });

  return fetchResult;
}

export { usePieData };

export type { PieChartData };
