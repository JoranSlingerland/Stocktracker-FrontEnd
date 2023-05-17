import { ApiWithMessage } from '../../utils/api';

interface PurgeOrchestratorBody {
  instanceId: string;
}

function purgeOrchestrator({ body }: { body: PurgeOrchestratorBody }) {
  ApiWithMessage(
    '/api/orchestrator/purge',
    'Purging orchestrator',
    'Orchestrator purged',
    'POST',
    body,
    'multipart/form-data'
  );
}

export { purgeOrchestrator };
