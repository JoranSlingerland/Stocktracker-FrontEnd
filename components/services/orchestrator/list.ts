import { regularFetch } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';

interface ListOrchestratorQuery {
  days: number | 'all';
}

interface ListOrchestratorData {
  instanceId: string;
  createdTime: string;
  lastUpdatedTime: string;
  runtimeStatus: string;
}

async function getListOrchestrator({
  query,
  abortController,
}: {
  query?: ListOrchestratorQuery;
  abortController: AbortController;
}) {
  const response = await regularFetch({
    url: `/api/orchestrator/list`,
    method: 'GET',
    query,
    controller: abortController,
  });
  return response;
}

function useListOrchestrator({
  query,
  enabled = true,
  background = false,
}: {
  query: ListOrchestratorQuery;
  enabled?: boolean;
  background?: boolean;
}) {
  const fetchResult = useFetch<
    undefined,
    ListOrchestratorQuery,
    ListOrchestratorData[]
  >({
    query,
    fetchData: getListOrchestrator,
    enabled,
    background,
  });

  return fetchResult;
}

export { useListOrchestrator };

export type { ListOrchestratorData };
