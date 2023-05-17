import { cachedFetch } from '../../utils/api';
import { apiRequestReducer } from '../../utils/api';

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

type LineChartDataActions =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: LineChartData }
  | { type: 'FETCH_FAILURE'; payload?: LineChartData }
  | { type: 'FETCH_ABORT' };

const lineChartDataInitialState = ({
  isLoading,
  isError,
}: {
  isLoading?: boolean;
  isError?: boolean;
}): { isLoading: boolean; isError: boolean; data: LineChartData } => ({
  isLoading: isLoading || false,
  isError: isError || false,
  data: {
    labels: [],
    datasets: [],
  },
});

const lineChartDataReducer = (
  state: { isLoading: boolean; isError: boolean; data: LineChartData },
  action: LineChartDataActions
): { isLoading: boolean; isError: boolean; data: LineChartData } => {
  return apiRequestReducer(state, action);
};

function getLineChartData({
  dispatcher,
  abortController,
  body,
  fallback_data = {
    labels: [],
    datasets: [],
  },
}: {
  dispatcher: React.Dispatch<LineChartDataActions>;
  abortController: AbortController;
  body: GetLineChartDataBody;
  fallback_data?: LineChartData;
}) {
  cachedFetch({
    url: `/api/data/get_linechart_data`,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
    fallback_data,
  });
}

export { getLineChartData, lineChartDataReducer, lineChartDataInitialState };

export type { LineChartData };
