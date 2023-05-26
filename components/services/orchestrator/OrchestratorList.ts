import { regularFetch } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';

interface ListOrchestratorBody {
  days: number | 'all';
}

interface ListOrchestratorData {
  instanceId: string;
  createdTime: string;
  lastUpdatedTime: string;
  runtimeStatus: string;
}

async function getListOrchestrator({
  body,
  abortController,
  background,
}: {
  body: ListOrchestratorBody;
  abortController: AbortController;
  background?: boolean;
}) {
  const response = await regularFetch({
    url: `/api/orchestrator/list`,
    method: 'POST',
    body: body,
    controller: abortController,
    background: background,
  });
  return response;
}

function useListOrchestrator({
  body,
  enabled = true,
  background = false,
}: {
  body: ListOrchestratorBody;
  enabled?: boolean;
  background?: boolean;
}) {
  const fetchResult = useFetch<ListOrchestratorBody, ListOrchestratorData[]>({
    body,
    fetchData: getListOrchestrator,
    enabled,
    background,
  });

  return fetchResult;
}

export { useListOrchestrator };

export type { ListOrchestratorData };
