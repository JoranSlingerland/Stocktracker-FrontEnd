// utils\api-utils.js

import { message } from 'antd';
import wretch from 'wretch';

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
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}
// End of helper functions

// main functions
async function cachedFetch(
  url,
  hours = 24,
  fallback_data = {},
  method = 'GET',
  body = {},
  key = ''
) {
  if (key === '') {
    key = url;
  }
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
  hours = 24,
  fallback_data = {},
  method = 'GET',
  body = {},
  key = ''
) {
  if (key === '') {
    key = url;
  }
  const response = await regularFetch(url, fallback_data, method, body);
  if (response === fallback_data) {
    return response;
  }
  setWithExpiry(key, response, hours * 1000 * 60 * 60);
  return response;
}

async function regularFetch(
  url,
  fallback_data = {},
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
      .post(body)
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
  body = {}
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
  }
  if (method === 'POST') {
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
  }
}

// End of main functions

export { cachedFetch, ovewriteCachedFetch, regularFetch, ApiWithMessage };
