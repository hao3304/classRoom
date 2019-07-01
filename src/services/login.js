import axios from "./axios";
export default {
  login: params => axios.post(`/api/loginUser`, params),
  register: params => axios.post(`/api/register`, params),
  logout: () => axios.post(`/api/logout`)
};
