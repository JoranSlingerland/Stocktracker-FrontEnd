import { ApiWithMessage } from '../../utils/api';

interface StartOrchestratorBody {
  functionName: 'stocktracker_orchestrator';
  daysToUpdate: number | 'all';
}

function startOrchestrator({ body }: { body: StartOrchestratorBody }) {
  ApiWithMessage(
    '/api/orchestrator/start',
    'Calling Orchestrator',
    'Orchestration called, This will take a while',
    'POST',
    body,
    'multipart/form-data'
  );
}

export { startOrchestrator };
