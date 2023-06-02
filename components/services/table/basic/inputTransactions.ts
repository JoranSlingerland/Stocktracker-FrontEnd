import { getTableDataBasic } from './shared';
import { useFetch } from '../../../hooks/useFetch';

interface GetTableDataBasicQuery {
  containerName: 'input_transactions';
  symbol?: string;
}

function useTableDataBasicInputTransactions({
  query,
  enabled = true,
  overwrite = false,
}: {
  query: GetTableDataBasicQuery;
  enabled?: boolean;
  overwrite?: boolean;
}) {
  const fetchResult = useFetch<
    undefined,
    GetTableDataBasicQuery,
    InputTransactionData[]
  >({
    query,
    fetchData: getTableDataBasic,
    enabled,
    overwrite,
  });

  return fetchResult;
}

export { useTableDataBasicInputTransactions };
