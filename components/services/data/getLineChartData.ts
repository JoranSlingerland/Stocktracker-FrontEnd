import { cachedFetch } from '../../utils/api';

export default function getLineChartData({
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
    dataType: 'total_gains' | 'invested_and_value';
  };
  fallback_data?: any;
}) {
  cachedFetch({
    url: `/api/data/get_linechart_data`,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
    fallback_data,
  });
}
