import { cachedFetch, ApiRequestAction } from '../../utils/api';
import { apiRequestReducer } from '../../utils/api';

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

const barChartDataInitialState = ({
  isLoading,
  isError,
}: {
  isLoading?: boolean;
  isError?: boolean;
}) => ({
  isLoading: isLoading || false,
  isError: isError || false,
  data: [],
});

const barChartDataReducer = (
  state: { isLoading: boolean; isError: boolean; data: BarChartData[] },
  action: ApiRequestAction<BarChartData[]>
): { isLoading: boolean; isError: boolean; data: BarChartData[] } => {
  return apiRequestReducer(state, action);
};

function getBarchartData({
  dispatcher,
  abortController,
  body,
}: {
  dispatcher: React.Dispatch<ApiRequestAction<BarChartData[]>>;
  abortController: AbortController;
  body: GetBarchartDataBody;
}) {
  cachedFetch({
    url: `/api/data/get_barchart_data`,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
  });
}

export { getBarchartData, barChartDataReducer, barChartDataInitialState };

export type { BarChartData };
