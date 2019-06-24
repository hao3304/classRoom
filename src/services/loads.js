import axios from "./axios";

export const getLoads = params => axios.post(`/loads.json`, params);
