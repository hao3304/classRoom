export default {
  namespaced: true,
  state: {
    rightActive: 0,
    rightMenu: [
      // {
      //   id: 1,
      //   name: "综合查询",
      //   icon: "ivu-icon ivu-icon-md-search",
      //   color: "rgb(58, 112, 246)"
      // },
      {
        id: 2,
        name: "监控中心",
        icon: "ivu-icon ivu-icon-md-podium",
        color: "rgb(108, 175, 97)"
      },
      {
        id: 3,
        name: "站点列表",
        icon: "iconfont icon-shoucang1",
        color: "rgb(95, 205, 107)"
      }
    ],
    stations: [],
    monitorStation: ""
  },
  mutations: {
    set_right_active(state, payload) {
      state.rightActive = payload;
    },
    set_stations(state, payload) {
      state.stations = payload;
    },
    set_monitor_station(state, payload) {
      state.monitorStation = payload;
    }
  }
};
