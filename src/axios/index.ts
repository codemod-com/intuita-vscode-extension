import axios from 'axios';
import axiosRetry from 'axios-retry';

const client = axios.create();
axiosRetry(client);

export const DEFAULT_RETRY_COUNT = 3;
export default client;
