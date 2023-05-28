import { ApiWithMessage } from '../../utils/api';

interface StartOrchestratorQuery {
  functionName: 'stocktracker_orchestrator';
  daysToUpdate: number | 'all';
}

function startOrchestrator({ query }: { query: StartOrchestratorQuery }) {
  ApiWithMessage({
    url: '/api/orchestrator/start',
    runningMessage: 'Calling Orchestrator',
    successMessage: 'Orchestration called, This will take a while',
    method: 'POST',
    query,
  });
}

export { startOrchestrator };
