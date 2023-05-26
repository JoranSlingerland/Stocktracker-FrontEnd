import { cachedFetch } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';

interface GetBarchartDataBody {
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
  body,
}: {
  abortController: AbortController;
  body: GetBarchartDataBody;
}) {
  const response = await cachedFetch({
    url: `/api/data/get_barchart_data`,
    method: 'POST',
    body,
    controller: abortController,
  });
  return response;
}

function useBarchartData({
  body,
  enabled = true,
}: {
  body: GetBarchartDataBody;
  enabled?: boolean;
}) {
  const fetchResult = useFetch<GetBarchartDataBody, BarChartData[]>({
    body,
    fetchData: getBarchartData,
    enabled,
  });

  return fetchResult;
}

export { useBarchartData };

export type { BarChartData };
