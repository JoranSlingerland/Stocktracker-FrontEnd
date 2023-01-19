// utils\api-utils.js

import { message } from 'antd';

async function cachedFetch(url, hours = 24) {
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

  // check if the url is in the cache
  const cachedResponse = getWithExpiry(url);
  if (cachedResponse) {
    // if it is, return the cached response
    return cachedResponse;
  } else {
    // if not, fetch the url and cache the response
    const response = await fetch(url);
    const data = await response.json();
    setWithExpiry(url, data, hours * 1000 * 60 * 60);
    return data;
  }
}

async function regularFetch(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function ApiWithMessage(url, runningMessage, successMessage) {
  const hide = message.loading(runningMessage, 10);
  const response = await fetch(url);
  try {
    const body = await response.json();
  } catch (error) {
    console.log('error', error);
  }
  if (
    response.status === 200 ||
    response.status === 201 ||
    response.status === 202
  ) {
    hide();
    message.success(successMessage);
  } else {
    hide();
    message.error('Something went wrong :(');
  }
}

export { cachedFetch, regularFetch, ApiWithMessage };