import asyncRetry from 'async-retry';
import axios from 'axios';

import { getBaseUrl } from './config';

const defaultRetryOptions = {
  retries: 2,
  factor: 1.35,
  minTimeout: 50,
  randomize: true
};

export async function getStockData(ticker) {
  const response = await asyncRetry(
    () => axios.get(`${getBaseUrl()}/lists/stocks/${ticker}`),
    defaultRetryOptions
  );
  return response.data;
}

export async function getStockDataKey(ticker, key) {
  const response = await asyncRetry(
    () => axios.get(`${getBaseUrl()}/lists/stocks/${ticker}/${encodeURIComponent(key)}`), 
    defaultRetryOptions
  );
  return response.data;
}

export async function getBlogStats(blogName) {
  const response = await asyncRetry(
    () => axios.get(`${getBaseUrl()}/blogs/stats/${blogName}`),
    defaultRetryOptions
  );

  return response.data;
}

export async function getBlogList() {
  const response = await asyncRetry(
    () => axios.get(`${getBaseUrl()}/blogs/list/page?number=${0}`),
    defaultRetryOptions
  );

  return response.data;
}