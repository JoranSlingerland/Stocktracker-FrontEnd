import {
  cachedFetch,
  overwriteCachedFetch,
  apiRequestReducer,
} from '../../../utils/api';
import { InputTransactionData } from '../../../types/types';

interface GetTableDataBasicBody {
  containerName: 'input_transactions';
  symbol?: string;
}

type GetTableDataBasicActions =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: InputTransactionData[] }
  | { type: 'FETCH_FAILURE'; payload?: InputTransactionData[] }
  | { type: 'FETCH_ABORT' };

const getTableDataBasicInputTransactionsInitialState = ({
  isLoading,
  isError,
  data = [],
}: {
  isLoading?: boolean;
  isError?: boolean;
  data?: InputTransactionData[];
}): { isLoading: boolean; isError: boolean; data: InputTransactionData[] } => ({
  isLoading: isLoading || false,
  isError: isError || false,
  data: data,
});

const getTableDataBasicInputTransactionsReducer = (
  state: {
    isLoading: boolean;
    isError: boolean;
    data: InputTransactionData[];
  },
  action: GetTableDataBasicActions
): { isLoading: boolean; isError: boolean; data: InputTransactionData[] } => {
  return apiRequestReducer(state, action);
};

function getTableDataBasicInputTransactions({
  dispatcher,
  abortController,
  body,
  overWrite,
}: {
  dispatcher: React.Dispatch<GetTableDataBasicActions>;
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
  getTableDataBasicInputTransactions,
  getTableDataBasicInputTransactionsReducer,
  getTableDataBasicInputTransactionsInitialState,
};
