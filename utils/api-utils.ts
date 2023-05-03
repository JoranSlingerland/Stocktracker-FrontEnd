import { message } from 'antd';
import wretch from 'wretch';
import FormDataAddon from 'wretch/addons/formData';
import hash from 'object-hash';

// Helper functions
function setWithExpiry(key: string, value: any, ttl: number) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
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
async function cachedFetch(
  url: string,
  fallback_data: any = [],
  method = 'GET',
  body = {},
  hours = 24
) {
  const key = newKey(url, body);
  const cachedResponse = getWithExpiry(key);
  if (cachedResponse) {
    return cachedResponse;
  } else {
    const response = await regularFetch(url, fallback_data, method, body);
    if (response === fallback_data) {
      return response;
    }

    setWithExpiry(key, response, hours * 1000 * 60 * 60);
    return response;
  }
}

async function overwriteCachedFetch(
  url: string,
  fallback_data: any = [],
  method = 'GET',
  body = {},
  hours = 24
) {
  const key = newKey(url, body);
  const response = await regularFetch(url, fallback_data, method, body);
  if (response === fallback_data) {
    return response;
  }
  setWithExpiry(key, response, hours * 1000 * 60 * 60);
  return response;
}

async function regularFetch(
  url: string,
  fallback_data = [],
  method = 'GET',
  body = {}
): Promise<any> {
  if (method === 'GET') {
    const response = await wretch(url)
      .get()
      .json()
      .catch(() => {
        return fallback_data;
      });
    return response;
  }
  if (method === 'POST') {
    const response = await wretch(url)
      .addon(FormDataAddon)
      .formData(body)
      .post()
      .json()
      .catch(() => {
        return fallback_data;
      });
    return response;
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
      // response is a json object
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

export { cachedFetch, overwriteCachedFetch, regularFetch, ApiWithMessage };
