import { ApiWithMessage } from '../../utils/api';

interface PurgeOrchestratorQuery {
  instanceId: string;
}

function purgeOrchestrator({ query }: { query: PurgeOrchestratorQuery }) {
  ApiWithMessage({
    url: '/api/orchestrator/purge',
    runningMessage: 'Purging orchestrator',
    successMessage: 'Orchestrator purged',
    method: 'DELETE',
    query,
  });
}

export { purgeOrchestrator };
