import { message } from 'antd';
import wretch from 'wretch';
import FormDataAddon from 'wretch/addons/formData';
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

function newKey(url: string, body: any) {
  body = JSON.parse(JSON.stringify(body));
  delete body.userId;
  return hash(url + JSON.stringify(body));
}

// End of helper functions

// main functions
async function regularFetch({
  url,
  dispatcher,
  fallback_data = [],
  method = 'GET',
  body = {},
  controller,
  background = false,
}: {
  url: string;
  dispatcher?: any;
  fallback_data?: any;
  method?: 'GET' | 'POST';
  body?: any;
  controller?: AbortController;
  background?: boolean;
}): Promise<{ response: any; error: boolean }> {
  controller = controller || new AbortController();
  if (dispatcher && !background) {
    dispatcher({ type: 'FETCH_INIT' });
  }
  let error = false;
  if (method === 'GET') {
    var response = await wretch(url)
      .addon(AbortAddon())
      .signal(controller)
      .get()
      .onAbort(() => {
        if (dispatcher) {
          dispatcher({ type: 'FETCH_ABORT', payload: fallback_data });
        }
        error = true;
      })
      .json()
      .catch(() => {
        if (dispatcher) {
          dispatcher({ type: 'FETCH_FAILURE', payload: fallback_data });
        }
        error = true;
      });
  }
  if (method === 'POST') {
    var response = await wretch(url)
      .addon(FormDataAddon)
      .addon(AbortAddon())
      .signal(controller)
      .formData(body)
      .post()
      .onAbort(() => {
        if (dispatcher) {
          dispatcher({ type: 'FETCH_ABORT', payload: fallback_data });
        }
        error = true;
      })
      .json()
      .catch(() => {
        if (dispatcher) {
          dispatcher({ type: 'FETCH_FAILURE', payload: fallback_data });
        }
        error = true;
      });
  }
  if (error) {
    return { response: fallback_data, error: error };
  }
  if (dispatcher) {
    dispatcher({ type: 'FETCH_SUCCESS', payload: response });
  }
  return { response, error };
}

async function cachedFetch({
  url,
  dispatcher,
  fallback_data = [],
  method = 'GET',
  body = {},
  hours = 24,
  controller,
  background = false,
  overwrite = false,
}: {
  url: string;
  dispatcher?: any;
  fallback_data?: any;
  method?: 'GET' | 'POST';
  body?: any;
  hours?: number;
  controller?: AbortController;
  background?: boolean;
  overwrite?: boolean;
}): Promise<{ response: any; error: boolean }> {
  if (dispatcher && !background) {
    dispatcher({ type: 'FETCH_INIT' });
  }

  const key = newKey(url, body);
  let response = getWithExpiry(key);
  let error = false;
  if (response && !overwrite) {
    if (dispatcher) {
      dispatcher({ type: 'FETCH_SUCCESS', payload: response });
    }
    return { response, error };
  } else {
    const { response, error } = await regularFetch({
      url,
      dispatcher,
      fallback_data,
      method,
      body,
      controller,
      background,
    });
    if (error) {
      return { response: fallback_data, error };
    }
    setWithExpiry(key, response, hours * 1000 * 60 * 60);
    return { response, error };
  }
}

async function ApiWithMessage(
  url: string,
  runningMessage: string,
  successMessage: string,
  method: 'GET' | 'POST' = 'GET',
  body: any = {},
  contentType: 'application/json' | 'multipart/form-data' = 'application/json'
): Promise<any> {
  const hide = message.loading(runningMessage, 10);
  if (method === 'GET') {
    const response = await wretch(url)
      .get()
      .json(() => {
        hide();
        message.success(successMessage);
      })
      .catch(() => {
        hide();
        message.error('Something went wrong :(');
      });
    return response;
  }
  if (method === 'POST') {
    if (contentType === 'application/json') {
      const response = await wretch(url)
        .post(body)
        .json(() => {
          hide();
          message.success(successMessage);
        })
        .catch(() => {
          hide();
          message.error('Something went wrong :(');
        });
      return response;
    }
    if (contentType === 'multipart/form-data') {
      const response = await wretch(url)
        .addon(FormDataAddon)
        .formData(body)
        .post()
        .json(() => {
          hide();
          message.success(successMessage);
        })
        .catch(() => {
          hide();
          message.error('Something went wrong :(');
        });
      return response;
    }
  }
}

// End of main functions

export { ApiWithMessage, regularFetch, cachedFetch };
