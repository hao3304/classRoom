import axios from "./axios";
export default {
  batchDelete: (type, params) =>
    axios.post(`/rest/${type}/batch-delete.json`, params),
  batchDeleteInsert: (type, params) =>
    axios.post("/rest/${type}/batch-delete-insert.json", params)
};
