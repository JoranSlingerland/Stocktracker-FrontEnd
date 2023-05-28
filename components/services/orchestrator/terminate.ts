import { ApiWithMessage } from '../../utils/api';

interface TerminateOrchestratorQuery {
  instanceId: string;
}

function terminateOrchestrator({
  query,
}: {
  query: TerminateOrchestratorQuery;
}) {
  ApiWithMessage({
    url: '/api/orchestrator/terminate',
    runningMessage: 'Terminating orchestrator',
    successMessage: 'Orchestrator terminated',
    method: 'POST',
    query,
  });
}

export { terminateOrchestrator };
