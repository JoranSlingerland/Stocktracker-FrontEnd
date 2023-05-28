import { cachedFetch } from '../../../utils/api';

async function getTableDataBasic<Query>({
  abortController,
  query,
  overwrite,
}: {
  abortController: AbortController;
  query?: Query;
  overwrite?: boolean;
}) {
  const response = await cachedFetch({
    url: `/api/table/basic`,
    method: 'GET',
    query,
    controller: abortController,
    overwrite,
  });
  return response;
}

export { getTableDataBasic };
