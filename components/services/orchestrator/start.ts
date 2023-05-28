import { ApiWithMessage } from '../../utils/api';

interface StartOrchestratorQuery {
  functionName: 'stocktracker_orchestrator';
  daysToUpdate: number | 'all';
}

function startOrchestrator({ query }: { query: StartOrchestratorQuery }) {
  ApiWithMessage(
    '/api/orchestrator/start',
    'Calling Orchestrator',
    'Orchestration called, This will take a while',
    'POST',
    {},
    query
  );
}

export { startOrchestrator };
