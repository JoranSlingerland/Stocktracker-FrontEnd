import {
  cachedFetch,
  overwriteCachedFetch,
  apiRequestReducer,
  ApiRequestAction,
} from '../../../utils/api';
import { InputInvestedData } from '../../../types/types';

interface GetTableDataBasicBody {
  containerName: 'input_invested';
}

const getTableDataBasicInputInvestedInitialState = ({
  isLoading,
  isError,
}: {
  isLoading?: boolean;
  isError?: boolean;
}): { isLoading: boolean; isError: boolean; data: InputInvestedData[] } => ({
  isLoading: isLoading || false,
  isError: isError || false,
  data: [],
});

const getTableDataBasicInputInvestedReducer = (
  state: {
    isLoading: boolean;
    isError: boolean;
    data: InputInvestedData[];
  },
  action: ApiRequestAction<InputInvestedData[]>
): { isLoading: boolean; isError: boolean; data: InputInvestedData[] } => {
  return apiRequestReducer(state, action);
};

function getTableDataBasicInputInvested({
  dispatcher,
  abortController,
  body,
  overWrite,
}: {
  dispatcher: React.Dispatch<ApiRequestAction<InputInvestedData[]>>;
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
  getTableDataBasicInputInvested,
  getTableDataBasicInputInvestedReducer,
  getTableDataBasicInputInvestedInitialState,
};
