import { message } from 'antd';
import wretch from 'wretch';
import QueryStringAddon from 'wretch/addons/queryString';
import AbortAddon from 'wretch/addons/abort';
import hash from 'object-hash';

// Helper functions
function setWithExpiry(key: string, value: any, ttl: number) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  sessionStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key: string) {
  const itemStr = sessionStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    sessionStorage.removeItem(key);
    return null;
  }
  return item.value;
}

function newKey(url: string, method: string, body: object, query: object) {
  let body_string = '';
  let query_string = '';
  if (body) {
    body_string = JSON.stringify(body);
  }
  if (query) {
    query_string = JSON.stringify(query);
  }

  return hash(url + body_string + query_string + method);
}

// End of helper functions

// main functions
async function regularFetch({
  url,
  fallback_data = [],
  method = 'GET',
  query = undefined,
  body = undefined,
  controller,
}: {
  url: string;
  fallback_data?: any;
  method: 'GET' | 'POST' | 'DELETE';
  query?: any;
  body?: any;
  controller?: AbortController;
}): Promise<{ response: any; error: boolean }> {
  controller = controller || new AbortController();
  let error = false;

  const w = wretch()
    .url(url)
    .addon(AbortAddon())
    .addon(QueryStringAddon)
    .signal(controller)
    .query(query);

  if (method === 'GET') {
    response = await w
      .get()
      .onAbort(() => {
        error = true;
      })
      .json()
      .catch(() => {
        error = true;
      });
  } else if (method === 'POST') {
    var response = await w
      .json(body)
      .post()
      .onAbort(() => {
        error = true;
      })
      .json()
      .catch(() => {
        error = true;
      });
  } else if (method === 'DELETE') {
    var response = await w
      .json(body)
      .delete()
      .onAbort(() => {
        error = true;
      })
      .json()
      .catch(() => {
        error = true;
      });
  } else {
    error = true;
  }

  if (error) {
    return { response: fallback_data, error: error };
  }
  return { response, error };
}

async function cachedFetch({
  url,
  fallback_data = [],
  method = 'GET',
  query = undefined,
  body = undefined,
  hours = 24,
  controller,
  overwrite = false,
}: {
  url: string;
  fallback_data?: any;
  method: 'GET' | 'POST' | 'DELETE';
  query?: any;
  body?: any;
  hours?: number;
  controller?: AbortController;
  overwrite?: boolean;
}): Promise<{ response: any; error: boolean }> {
  const key = newKey(url, method, body, query);
  let response = getWithExpiry(key);
  let error = false;
  if (response && !overwrite) {
    return { response, error };
  } else {
    const { response, error } = await regularFetch({
      url,
      fallback_data,
      method,
      body,
      controller,
      query,
    });
    if (error) {
      return { response: fallback_data, error };
    }
    setWithExpiry(key, response, hours * 1000 * 60 * 60);
    return { response, error };
  }
}

async function ApiWithMessage({
  url,
  runningMessage,
  successMessage,
  method = 'GET',
  body = undefined,
  query = undefined,
}: {
  url: string;
  runningMessage: string;
  successMessage: string;
  method: 'GET' | 'POST' | 'DELETE';
  body?: any;
  query?: any;
}): Promise<void> {
  const hide = message.loading(runningMessage, 10);

  const response = await regularFetch({
    url,
    method,
    body,
    query,
  });

  if (response.error) {
    hide();
    message.error('Something went wrong :(');
  } else {
    hide();
    message.success(successMessage);
  }
}

// End of main functions

export { ApiWithMessage, regularFetch, cachedFetch };
