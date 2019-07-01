import axios from "axios";
import Vue from "../main";
import ls from "@/libs/ls";

export const GetRoot = () => {
  return process.env.VUE_APP_BOOT;
};
export const ROOT = GetRoot();
export const baseURL = ROOT + "";

const instance = axios.create({
  baseURL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": ls.get("cookies")
  }
});

instance.interceptors.response.use(
  res => {
    if (
      typeof res.data == "string" &&
      res.data.indexOf("access_token_cookie") > -1
    ) {
      Vue.$router.push("/login");
    } else if (res.data.err === "" || res.data.err == undefined) {
      return res.data;
    } else {
      Vue.$Notice.error({
        title: "警告",
        desc: res.data.err,
        duration: 4
      });
      Vue.$router.push("/login");
      return Promise.reject();
    }
  },
  error => {
    const { response } = error;
    if (!response) {
      Vue.$Notice.error({
        title: "警告",
        desc: error.message,
        duration: 4
      });

      return Promise.reject(error);
    }
    switch (response.status) {
      case 404:
        {
          Vue.$Notice.error({
            title: "警告",
            desc: "未找到服务！",
            duration: 4
          });
        }
        break;
      default:
        Vue.$Notice.error({
          title: "警告",
          desc: response.message,
          duration: 4
        });
    }

    return Promise.reject(error);
  }
);

export default instance;

export const RESTful = function(target) {
  return {
    findAll: params => instance.post(`/rest/${target}/query.json`, params),
    add: params => instance.post(`/rest/${target}`, params),
    remove: id => instance.delete(`/rest/${target}/${id}`),
    update: (id, params) => instance.put(`/rest/${target}/${id}`, params),
    findOne: id => instance.get(`/rest/${target}/${id}`),
    batchDelete: params =>
      instance.post(`/rest/${target}/batch-delete.json`, params),
    batchDeleteInsert: params =>
      instance.post(`/rest/${target}/batch-replace.json`, params)
  };
};
