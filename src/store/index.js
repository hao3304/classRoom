import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import app from "./app";
import common from "./common";
import router from "@/router";
import ls from "@/libs/ls";

export default new Vuex.Store({
  state: {
    token: "",
    windowHeight: document.documentElement.clientHeight,
    windowWidth: document.documentElement.clientWidth,
    winHeight: document.documentElement.clientHeight,
    winWidth: document.documentElement.clientWidth
  },
  mutations: {
    set_token(state, payload) {
      state.token = payload;
    },
    logout(state) {
      state.token = null;
      router.replace({ name: "Login" });
      ls.set("token", null);
    },
    set_window_height(state, payload) {
      state.windowHeight = payload;
      state.winHeight = payload;
    },
    set_window_width(state, payload) {
      state.windowWidth = payload;
      state.winWidth = payload;
    }
  },
  modules: {
    app,
    common
  }
});
