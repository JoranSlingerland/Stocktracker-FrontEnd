import { cachedFetch } from '../../../utils/api';
import { InputTransactionData } from '../../../types/types';
import { useFetch } from '../../../hooks/useFetch';

interface GetTableDataBasicBody {
  containerName: 'input_transactions';
  symbol?: string;
}

async function getTableDataBasicInputTransactions({
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

function useTableDataBasicInputTransactions({
  body,
  enabled = true,
  overwrite = false,
}: {
  body: GetTableDataBasicBody;
  enabled?: boolean;
  overwrite?: boolean;
}) {
  const fetchResult = useFetch<GetTableDataBasicBody, InputTransactionData[]>({
    body,
    fetchData: getTableDataBasicInputTransactions,
    enabled,
    overwrite,
  });

  return fetchResult;
}

export { useTableDataBasicInputTransactions };
