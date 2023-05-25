import { cachedFetch } from '../../../utils/api';
import useFetch from '../../../hooks/useFetch';

interface GetTableDataBasicBody {
  containerName: 'input_invested';
}

async function getTableDataBasicInputInvested({
  abortController,
  body,
  overwrite,
}: {
  abortController: AbortController;
  body: GetTableDataBasicBody;
  overwrite?: boolean;
}) {
  const response = await cachedFetch({
    url: `/api/data/get_table_data_basic`,
    method: 'POST',
    body,
    controller: abortController,
    overwrite,
  });
  return response;
}

function useTableDataBasicInputInvested({
  body,
  enabled = true,
  overwrite = false,
}: {
  body: GetTableDataBasicBody;
  enabled?: boolean;
  overwrite?: boolean;
}) {
  const fetchResult = useFetch<GetTableDataBasicBody, any[]>({
    body,
    fetchData: getTableDataBasicInputInvested,
    enabled,
    overwrite,
  });

  return fetchResult;
}

export { useTableDataBasicInputInvested };
