import { cachedFetch, ApiRequestAction } from '../../../utils/api';
import { apiRequestReducer } from '../../../utils/api';
import { totalsData } from '../../../constants/placeholders';
import { TotalsData } from '../../../types/types';

// Totals
interface GetTableDataPerformanceBodyTotals extends SharedBody {
  dataType: 'totals';
}

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
  action: ApiRequestAction<TotalsData[]>
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
  dispatcher: React.Dispatch<ApiRequestAction<TotalsData[]>>;
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
