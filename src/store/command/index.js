export default {
  namespaced: true,
  state: {
    mapOk: false,
    marginLeft: false,
    marginRight: true,
    leftActive: {
      // id: "Layer",
      // name: "图层",
      // icon: "iconfont icon-023tuceng"
    },
    rightMenus: [
      {
        id: "Events",
        name: "事件",
        icon: "iconfont icon-shijian",
        color: "#e15546"
      },
      {
        id: "Tickets",
        name: "工单",
        icon: "iconfont icon-order",
        color: "#3a70f6"
      },
      // {
      //   id: "Cars",
      //   name: "车辆列表",
      //   icon: "iconfont icon-cheliang-",
      //   color: "#6caf61"
      // },
      {
        id: "Dma",
        name: "分区",
        icon: "iconfont icon-cf-c12",
        color: "#5fcd6b"
      },
      {
        id: "Vip",
        name: "大用户",
        icon: "iconfont icon-vipdakehu",
        color: "#4b99ec"
      },
      // {
      //   id: "YL",
      //   name: "压力点",
      //   icon: "iconfont icon-yali",
      //   color: "#3a70f6"
      // },
      {
        id: "Monitor",
        name: "监测点",
        icon: "iconfont icon-jiance",
        color: "#e15546"
      }
      // {
      //   id: "Annal",
      //   name: "应急联动",
      //   icon: "iconfont icon-yingjizhihui",
      //   color: "#f2a13c"
      // },
      // {
      //   id: "Intercom",
      //   name: "对讲系统",
      //   icon: "iconfont icon-duijiang",
      //   color: "#3a70f6"
      // }
    ],
    label: {
      Tickets: false,
      Devices: false,
      Users: true,
      Videos: false
    },
    rightActive: {},
    mapStyles: [
      {
        id: "normal",
        name: "标准"
      },
      {
        id: "macaron",
        name: "马卡龙"
      },
      {
        id: "graffiti",
        name: "涂鸦"
      },
      {
        id: "whitesmoke",
        name: "远山黛"
      },
      {
        id: "dark",
        name: "幻影黑"
      },
      {
        id: "fresh",
        name: "草色青"
      },
      {
        id: "darkblue",
        name: "极夜蓝"
      },
      {
        id: "blue",
        name: "靛青蓝"
      },
      {
        id: "light",
        name: "月光银"
      },
      {
        id: "grey",
        name: "雅士灰"
      }
    ],
    mapStyle: "normal",
    layers: {
      users: [],
      stations: [],
      trucks: [],
      tickets: [],
      wms: []
    },
    tools: [
      {
        id: "rang",
        name: "测距",
        icon: "iconfont icon-chizi"
      },
      {
        id: "driving",
        name: "路线规划",
        icon: "iconfont icon-youxuanluxian"
      }
    ],
    features: {
      bg: true,
      building: true,
      point: false,
      road: true
    },
    routeInfo: null,
    selectTool: null,
    selectLayers: {
      users: [],
      stations: [],
      trucks: [],
      cameras: [],
      tickets: [],
      videos: [],
      wms: []
    },
    users: [],
    selectUser: {},
    tickets: [],
    selectTicket: {},
    stations: [],
    selectStation: {},
    videos: [],
    selectVideos: {},
    showDemo: false,
    monitors: [],
    selectMonitor: [],
    vips: [],
    selectVip: [],
    dmas: []
  },
  mutations: {
    SET_MAP_OK(state, payload) {
      state.mapOk = payload;
    },
    SET_LEFT(state, payload) {
      state.marginLeft = payload;
    },
    SET_RIGHT(state, payload) {
      state.marginRight = payload;
    },
    SET_LEFT_ACTIVE(state, payload) {
      state.leftActive = payload;
    },
    SET_RIGHT_ACTIVE(state, payload) {
      state.rightActive = payload;
    },
    SET_MAP_STYLE(state, payload) {
      state.mapStyle = payload;
    },
    SET_LAYERS(state, payload) {
      state.layers = Object.assign(state.layers, payload);
      state.selectLayers.users = state.layers.users.map(user => user.role);
      state.selectLayers.tickets = state.layers.tickets.map(
        ticket => ticket.type
      );
      state.selectLayers.stations = state.layers.stations.map(
        station => station.type
      );
      state.selectLayers.trucks = state.layers.trucks.map(truck => truck.type);
      state.selectLayers.videos = state.layers.videos.map(video => video.type);
    },
    SET_SELECT_LAYERS(state, payload) {
      state.selectLayers = payload;
    },
    SET_USERS(state, payload) {
      state.users = payload;
    },
    SET_SELECT_USER(state, payload) {
      state.selectUser = payload;
    },
    SET_STATIONS(state, payload) {
      state.stations = payload;
    },
    SET_SELECT_STATION(state, payload) {
      state.selectStation = payload;
    },
    SET_SELECT_TICKET(state, payload) {
      state.selectTicket = payload;
    },
    SET_LABEL(state, payload) {
      Object.assign(state.label, payload);
    },
    SET_SELECT_TOOL(state, payload) {
      state.selectTool = payload;
    },
    SET_ROUTE_INFO(state, payload) {
      state.routeInfo = payload;
    },
    SET_WMS(state, payload) {
      state.layers.wms = payload;
      state.selectLayers.wms = state.layers.wms.map(w => w.id);
    },
    SET_FEATURE(state, payload) {
      state.features[payload.field] = payload.value;
    },
    SET_MONITORS(state, payload) {
      state.monitors = payload;
    },
    SET_SELECT_MONITOR(state, payload) {
      state.selectMonitor = payload;
    },
    SET_VIPS(state, payload) {
      state.vips = payload;
    },
    SET_SELECT_VIP(state, payload) {
      state.selectVip = payload;
    },
    SET_DMAS(state, payload) {
      state.dmas = payload;
    }
  },
  actions: {
    // GetLayers({ state }, apollo) {}
  }
};
