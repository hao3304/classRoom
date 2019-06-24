import axios, { RESTful } from "./axios";
export default RESTful("station");

export const getList = params => axios.post(`/station/list.json`, params);
export const getRealTime = params =>
  axios.post(`/station/realtime.json`, params);
