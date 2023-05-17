import { cachedFetch } from '../../../utils/api';
import { apiRequestReducer } from '../../../utils/api';
import { totalsData } from '../../../constants/placeholders';
import { TotalsData } from '../../../types/types';

// Totals
interface GetTableDataPerformanceBodyTotals extends SharedBody {
  dataType: 'totals';
}

type GetTableDataPerformanceDataAction =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: TotalsData[] }
  | { type: 'FETCH_FAILURE'; payload?: TotalsData[] }
  | { type: 'FETCH_ABORT' };

const getTableDataPerformanceDataTotalsInitialState = ({
  isLoading,
  isError,
}: {
  isLoading?: boolean;
  isError?: boolean;
}) => ({
  isLoading: isLoading || false,
  isError: isError || false,
  data: [totalsData],
});

const getTableDataPerformanceDataTotalsReducer = (
  state: {
    isLoading: boolean;
    isError: boolean;
    data: TotalsData[];
  },
  action: GetTableDataPerformanceDataAction
): {
  isLoading: boolean;
  isError: boolean;
  data: TotalsData[];
} => {
  return apiRequestReducer(state, action);
};

function getTableDataPerformanceTotals({
  dispatcher,
  abortController,
  body,
  fallback_data = [],
}: {
  dispatcher: React.Dispatch<GetTableDataPerformanceDataAction>;
  abortController: AbortController;
  body: GetTableDataPerformanceBodyTotals;
  fallback_data?: TotalsData[];
}) {
  cachedFetch({
    url: `/api/data/get_table_data_performance`,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
    fallback_data,
  });
}

export {
  getTableDataPerformanceTotals,
  getTableDataPerformanceDataTotalsReducer,
  getTableDataPerformanceDataTotalsInitialState,
};
