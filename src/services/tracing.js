import axios from "./axios";

export const getHistory = params => axios.post(`/tracing/history.json`, params);
export const getRealTime = params =>
  axios.post(`/tracing/realtime.json`, params);
