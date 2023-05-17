import { cachedFetch } from '../../utils/api';
import { apiRequestReducer } from '../../utils/api';

interface GetPieChartDataBody {
  dataType: 'stocks' | 'country' | 'sector' | 'currency';
}

interface PieChartData {
  labels: string[];
  data: number[];
  color: string[];
}

type PieChartDataActions =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: PieChartData }
  | { type: 'FETCH_FAILURE'; payload?: PieChartData }
  | { type: 'FETCH_ABORT' };

const pieChartDataInitialState = ({
  isLoading,
  isError,
}: {
  isLoading?: boolean;
  isError?: boolean;
}): { isLoading: boolean; isError: boolean; data: PieChartData } => ({
  isLoading: isLoading || false,
  isError: isError || false,
  data: {
    labels: [],
    data: [],
    color: [],
  },
});

const pieChartDataReducer = (
  state: { isLoading: boolean; isError: boolean; data: PieChartData },
  action: PieChartDataActions
): { isLoading: boolean; isError: boolean; data: PieChartData } => {
  return apiRequestReducer(state, action);
};

function getPieData({
  dispatcher,
  abortController,
  body,
}: {
  dispatcher: React.Dispatch<PieChartDataActions>;
  abortController: AbortController;
  body: GetPieChartDataBody;
}) {
  const fallbackObject = {
    labels: [],
    data: [],
    color: [],
  };

  cachedFetch({
    url: `/api/data/get_pie_data`,
    fallback_data: fallbackObject,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
  });
}

export { getPieData, pieChartDataReducer, pieChartDataInitialState };

export type { PieChartData };
