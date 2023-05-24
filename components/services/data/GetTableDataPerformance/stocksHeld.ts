import {
  apiRequestReducer,
  cachedFetch,
  ApiRequestAction,
} from '../../../utils/api';
import { StocksHeldData } from '../../../types/types';
import { stocksHeldData } from '../../../constants/placeholders';

interface GetTableDataPerformanceBodyStocksHeld extends SharedBody {
  dataType: 'stocks_held';
}

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
  action: ApiRequestAction<StocksHeldData[]>
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
  dispatcher: React.Dispatch<ApiRequestAction<StocksHeldData[]>>;
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
