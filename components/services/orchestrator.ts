import { ApiWithMessage, regularFetch } from '../utils/api';

function startOrchestrator({
  body,
}: {
  body: {
    functionName: 'stocktracker_orchestrator';
    daysToUpdate: number | 'all';
  };
}) {
  ApiWithMessage(
    '/api/orchestrator/start',
    'Calling Orchestrator',
    'Orchestration called, This will take a while',
    'POST',
    body,
    'multipart/form-data'
  );
}

function fetchOrchestratorList({
  body,
  dispatcher,
  abortController,
  background,
}: {
  body: { days: number | 'all' };
  dispatcher?: any;
  abortController?: AbortController;
  background?: boolean;
}) {
  regularFetch({
    url: `/api/orchestrator/list`,
    method: 'POST',
    body: body,
    dispatcher: dispatcher,
    controller: abortController,
    background: background,
  });
}

function purgeOrchestrator({
  body,
}: {
  body: {
    instanceId: string;
  };
}) {
  ApiWithMessage(
    '/api/orchestrator/purge',
    'Purging orchestrator',
    'Orchestrator purged',
    'POST',
    body,
    'multipart/form-data'
  );
}

function terminateOrchestrator({
  body,
}: {
  body: {
    instanceId: string;
  };
}) {
  ApiWithMessage(
    '/api/orchestrator/terminate',
    'Terminating orchestrator',
    'Orchestrator terminated',
    'POST',
    body,
    'multipart/form-data'
  );
}

export {
  startOrchestrator,
  fetchOrchestratorList,
  purgeOrchestrator,
  terminateOrchestrator,
};
