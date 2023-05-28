import { ApiWithMessage } from '../../utils/api';

interface TerminateOrchestratorQuery {
  instanceId: string;
}

function terminateOrchestrator({
  query,
}: {
  query: TerminateOrchestratorQuery;
}) {
  ApiWithMessage(
    '/api/orchestrator/terminate',
    'Terminating orchestrator',
    'Orchestrator terminated',
    'POST',
    {},
    query
  );
}

export { terminateOrchestrator };
