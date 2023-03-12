// utils\api-utils.js

import { message } from 'antd';
import wretch from 'wretch';
import FormDataAddon from 'wretch/addons/formData';
import hash from 'object-hash';

// Helper functions
function setWithExpiry(key, value, ttl) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
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

function newKey(url, body) {
  body = JSON.parse(JSON.stringify(body));
  delete body.userId;
  return hash(url + JSON.stringify(body));
}

// End of helper functions

// main functions
async function cachedFetch(
  url,
  fallback_data = [],
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

async function ovewriteCachedFetch(
  url,
  fallback_data = [],
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
  url,
  fallback_data = [],
  method = 'GET',
  body = {}
) {
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
  url,
  runningMessage,
  successMessage,
  method = 'GET',
  body = {},
  contentType = 'application/json'
) {
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
    let w = wretch(url);
    if (contentType === 'application/json') {
      w = w.post(body);
    }
    if (contentType === 'multipart/form-data') {
      w = w.addon(FormDataAddon).formData(body).post();
    }

    const response = await w
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

// End of main functions

export { cachedFetch, ovewriteCachedFetch, regularFetch, ApiWithMessage };
