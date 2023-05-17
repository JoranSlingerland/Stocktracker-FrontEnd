import { ApiWithMessage } from '../../utils/api';

interface TerminateOrchestratorBody {
  instanceId: string;
}

function terminateOrchestrator({ body }: { body: TerminateOrchestratorBody }) {
  ApiWithMessage(
    '/api/orchestrator/terminate',
    'Terminating orchestrator',
    'Orchestrator terminated',
    'POST',
    body,
    'multipart/form-data'
  );
}

export { terminateOrchestrator };
