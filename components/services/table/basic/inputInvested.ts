import { useFetch } from '../../../hooks/useFetch';
import { getTableDataBasic } from './shared';
import { InputInvestedData } from '../../../types/types';

interface GetTableDataBasicQuery {
  containerName: 'input_invested';
}

function useTableDataBasicInputInvested({
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
    InputInvestedData[]
  >({
    query,
    fetchData: getTableDataBasic,
    enabled,
    overwrite,
  });

  return fetchResult;
}

export { useTableDataBasicInputInvested };
