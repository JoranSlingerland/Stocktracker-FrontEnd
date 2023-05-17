import { regularFetch } from '../utils/api';

function fetchOrchestratorList({
  body,
  dispatcher,
  abortController,
  background,
}: {
  body: { days: number | 'all' };
  dispatcher: any;
  abortController: AbortController;
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

export { fetchOrchestratorList };
