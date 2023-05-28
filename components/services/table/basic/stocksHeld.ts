import { getTableDataBasic } from './shared';
import { StocksHeldData } from '../../../types/types';
import { useFetch } from '../../../hooks/useFetch';

interface GetTableDataBasicQuery {
  containerName: 'stocks_held';
  fullyRealized?: boolean;
  partialRealized?: boolean;
  andOr?: 'and' | 'or';
  symbol?: string;
}

function useTableDataBasicStocksHeld({
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
    StocksHeldData[]
  >({
    query,
    fetchData: getTableDataBasic,
    enabled,
    overwrite,
  });

  return fetchResult;
}

export { useTableDataBasicStocksHeld };
