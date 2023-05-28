import { ApiWithMessage } from '../../utils/api';

interface PurgeOrchestratorQuery {
  instanceId: string;
}

function purgeOrchestrator({ query }: { query: PurgeOrchestratorQuery }) {
  ApiWithMessage(
    '/api/orchestrator/purge',
    'Purging orchestrator',
    'Orchestrator purged',
    'DELETE',
    {},
    query
  );
}

export { purgeOrchestrator };
