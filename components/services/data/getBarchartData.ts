import { cachedFetch } from '../../utils/api';

export default function getBarchartData({
  dispatcher,
  abortController,
  body,
}: {
  dispatcher: any;
  abortController: AbortController;
  body: {
    userId: string;
    allData: boolean;
    startDate?: string;
    endDate?: string;
    dataType: 'dividend' | 'transaction_cost';
  };
}) {
  cachedFetch({
    url: `/api/data/get_barchart_data`,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
  });
}
