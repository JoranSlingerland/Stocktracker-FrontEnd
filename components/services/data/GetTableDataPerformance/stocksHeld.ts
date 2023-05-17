import { apiRequestReducer, cachedFetch } from '../../../utils/api';
import { StocksHeldData } from '../../../types/types';
import { stocksHeldData } from '../../../constants/placeholders';

interface GetTableDataPerformanceBodyStocksHeld extends SharedBody {
  dataType: 'stocks_held';
}

type GetTableDataPerformanceDataStocksHeldAction =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: StocksHeldData[] }
  | { type: 'FETCH_FAILURE'; payload?: StocksHeldData[] }
  | { type: 'FETCH_ABORT' };

const getTableDataPerformanceDataStocksHeldInitialState = ({
  isLoading,
  isError,
}: {
  isLoading?: boolean;
  isError?: boolean;
}) => ({
  isLoading: isLoading || false,
  isError: isError || false,
  data: [stocksHeldData],
});

const getTableDataPerformanceDataStocksHeldReducer = (
  state: {
    isLoading: boolean;
    isError: boolean;
    data: StocksHeldData[];
  },
  action: GetTableDataPerformanceDataStocksHeldAction
): {
  isLoading: boolean;
  isError: boolean;
  data: StocksHeldData[];
} => {
  return apiRequestReducer(state, action);
};

function getTableDataPerformanceStocksHeld({
  dispatcher,
  abortController,
  body,
  fallback_data = [],
}: {
  dispatcher: React.Dispatch<GetTableDataPerformanceDataStocksHeldAction>;
  abortController: AbortController;
  body: GetTableDataPerformanceBodyStocksHeld;
  fallback_data?: StocksHeldData[];
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
  getTableDataPerformanceStocksHeld,
  getTableDataPerformanceDataStocksHeldReducer,
  getTableDataPerformanceDataStocksHeldInitialState,
};
