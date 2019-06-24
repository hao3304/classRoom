export default {
  namespaced: true,
  state: {
    rightActive: null,
    rightMenu: [
      {
        id: "Tickets",
        name: "工单列表",
        icon: "iconfont icon-order",
        color: "#3a70f6"
      },
      {
        id: "Devices",
        name: "在线设备",
        icon: "iconfont icon-huabanfuben",
        color: "#5fcd6b"
      },
      {
        id: "Users",
        name: "人员列表",
        icon: "iconfont icon-yonghuguanli",
        color: "#4b99ec"
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
    }
  }
};
