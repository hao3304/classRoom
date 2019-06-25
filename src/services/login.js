import axios from "./axios";
export default {
  login: params => axios.post(`/loginUser`, params),
  register: params => axios.post(`/register`, params),
  logout: () => axios.post(`/logout`)
};
