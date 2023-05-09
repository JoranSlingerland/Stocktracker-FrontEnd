import { cachedFetch } from '../../utils/api';

export default function getTableDataPerformance({
  dispatcher,
  abortController,
  body,
  fallback_data = [],
}: {
  dispatcher: any;
  abortController: AbortController;
  body: {
    userId: string;
    allData: boolean;
    startDate?: string;
    endDate?: string;
    dataType: 'stocks_held' | 'totals';
  };
  fallback_data?: any;
}) {
  cachedFetch({
    url: `/api/data/get_table_data_performance`,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
    fallback_data,
  });
}
