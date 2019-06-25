export default {
  namespaced: true,
  state: {
    modules: [
      {
        id: 1,
        name: "个人中心",
        icon: "icon-yonghuguanli",
        path: "home"
      }
      // {
      //   id: 2,
      //   name: "运营指挥",
      //   icon: "icon-zhihuijiancezhongxin--jichugongnengguanli",
      //   path: "VipMap"
      // },
    ],
    module: 0,
    breadcrumbs: [],
    mapLoad: false,
    keepAlive: ["Dashboard", "VipMap"]
  },
  mutations: {
    set_module(state, payload) {
      state.module = payload;
    },
    set_breadcrumbs(state, payload) {
      state.breadcrumbs = payload;
    },
    set_map_load(state, payload) {
      state.mapLoad = payload;
    },
    set_keep_alive(state, payload) {
      if (!payload || payload.length == 0) {
        state.keepAlive = ["Dashboard", "VipMap"];
      } else {
        if (state.keepAlive.indexOf(payload) == -1) {
          state.keepAlive.push(payload);
        }
      }
    }
  }
};
