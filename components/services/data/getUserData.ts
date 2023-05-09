import { cachedFetch, overwriteCachedFetch } from '../../utils/api';

export default async function getUserData({
  body,
  overWrite,
}: {
  body: {
    userId: string;
  };
  overWrite?: boolean;
}) {
  if (overWrite) {
    return await overwriteCachedFetch({
      url: `/api/data/get_user_data`,
      method: 'POST',
      fallback_data: {},
      body,
    }).then((data) => {
      return data;
    });
  } else {
    return await cachedFetch({
      url: `/api/data/get_user_data`,
      method: 'POST',
      fallback_data: {},
      body,
    }).then((data) => {
      return data;
    });
  }
}
