import { regularFetch } from '../../utils/api';
import { apiRequestReducer } from '../../utils/api';

interface ListOrchestratorBody {
  days: number | 'all';
}

interface ListOrchestratorData {
  instanceId: string;
  createdTime: string;
  lastUpdatedTime: string;
  runtimeStatus: string;
}

type ListOrchestratorActions =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: ListOrchestratorData[] }
  | { type: 'FETCH_FAILURE'; payload?: ListOrchestratorData[] }
  | { type: 'FETCH_ABORT' };

const listOrchestratorInitialState = ({
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

const listOrchestratorReducer = (
  state: {
    isLoading: boolean;
    isError: boolean;
    data: ListOrchestratorData[];
  },
  action: ListOrchestratorActions
): {
  isLoading: boolean;
  isError: boolean;
  data: ListOrchestratorData[];
} => {
  return apiRequestReducer(state, action);
};

function listOrchestrator({
  body,
  dispatcher,
  abortController,
  background,
}: {
  body: ListOrchestratorBody;
  dispatcher: React.Dispatch<ListOrchestratorActions>;
  abortController: AbortController;
  background?: boolean;
}) {
  regularFetch({
    url: `/api/orchestrator/list`,
    method: 'POST',
    body: body,
    dispatcher: dispatcher,
    controller: abortController,
    background: background,
  });
}

export {
  listOrchestrator,
  listOrchestratorReducer,
  listOrchestratorInitialState,
};

export type { ListOrchestratorData };
