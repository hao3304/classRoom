import axios from "./axios";
export default {
  assignments: () => axios.get(`/api/assignments`),
  problem: p => axios.get(`/api/problem`, { params: p }),
  userInfo: () => axios.get("/api/userInfo"),
  lastSubmit: p => axios.get("/api/lastSubmit", { params: p }),
  submitState: p => axios.get("/api/submitState", { params: p }),
  submit: params => axios.post("/api/submit", params),
  compile: params => axios.post("/ide/compile", params)
};
