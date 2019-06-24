import axios, { RESTful } from "../axios";
export default RESTful("user");

export const resetPasword = params =>
  axios.post("/user/reset-password.json", params);
