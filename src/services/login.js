import axios from "./axios";
export default {
  login: params => axios.post(`/auth/login.json`, params),
  logout: () => axios.get(`/login`)
};
