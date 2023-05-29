import { cachedFetch } from '../../../utils/api';

interface SharedQuery {
  allData?: boolean;
  startDate?: string;
  endDate?: string;
}

async function getTableDataPerformance<Query, Fallback>({
  abortController,
  query,
  fallback_data = [],
}: {
  abortController: AbortController;
  query?: Query;
  fallback_data?: Fallback[];
}) {
  const response = await cachedFetch({
    url: `/api/table/performance`,
    method: 'GET',
    query,
    controller: abortController,
    fallback_data,
  });
  return response;
}

export { getTableDataPerformance };

export type { SharedQuery };
