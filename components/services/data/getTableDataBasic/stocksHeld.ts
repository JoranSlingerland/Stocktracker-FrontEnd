import {
  cachedFetch,
  overwriteCachedFetch,
  apiRequestReducer,
  ApiRequestAction,
} from '../../../utils/api';
import { StocksHeldData } from '../../../types/types';

interface GetTableDataBasicBody {
  containerName: 'stocks_held';
  fullyRealized?: boolean;
  partialRealized?: boolean;
  andOr?: 'and' | 'or';
  symbol?: string;
}
const getTableDataBasicStocksHeldInitialState = ({
  isLoading,
  isError,
}: {
  isLoading?: boolean;
  isError?: boolean;
}): { isLoading: boolean; isError: boolean; data: StocksHeldData[] } => ({
  isLoading: isLoading || false,
  isError: isError || false,
  data: [],
});

const getTableDataBasicStocksHeldReducer = (
  state: {
    isLoading: boolean;
    isError: boolean;
    data: StocksHeldData[];
  },
  action: ApiRequestAction<StocksHeldData[]>
): { isLoading: boolean; isError: boolean; data: StocksHeldData[] } => {
  return apiRequestReducer(state, action);
};

function getTableDataBasicStocksHeld({
  dispatcher,
  abortController,
  body,
  overWrite,
}: {
  dispatcher: React.Dispatch<ApiRequestAction<StocksHeldData[]>>;
  abortController: AbortController;
  body: GetTableDataBasicBody;
  overWrite?: boolean;
}) {
  if (overWrite) {
    overwriteCachedFetch({
      url: `/api/data/get_table_data_basic`,
      method: 'POST',
      body,
      dispatcher,
      controller: abortController,
      background: true,
    });
  } else {
    cachedFetch({
      url: `/api/data/get_table_data_basic`,
      method: 'POST',
      body,
      dispatcher,
      controller: abortController,
    });
  }
}

export {
  getTableDataBasicStocksHeld,
  getTableDataBasicStocksHeldReducer,
  getTableDataBasicStocksHeldInitialState,
};
