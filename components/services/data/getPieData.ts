import { cachedFetch } from '../../utils/api';

const fallbackObject = {
  labels: [],
  data: [],
  color: [],
};

export default function getPieData({
  dispatcher,
  abortController,
  body,
}: {
  dispatcher: any;
  abortController: AbortController;
  body: {
    userId: string;
    dataType: 'stocks' | 'country' | 'sector' | 'currency';
  };
}) {
  cachedFetch({
    url: `/api/data/get_pie_data`,
    fallback_data: fallbackObject,
    method: 'POST',
    body,
    dispatcher,
    controller: abortController,
  });
}
