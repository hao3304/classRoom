import axios from "./axios";
export default {
  assignments: () => axios.get(`/assignments`),
  problem: p => axios.get(`/problem`, { params: p }),
  userInfo: ()=> axios.get('/userInfo')
};
