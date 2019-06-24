export default {
  namespaced: true,
  state: {
    modules: [
      {
        id: 1,
        name: "系统总览",
        icon: "icon-dashboard",
        path: "Dashboard"
      },
      // {
      //   id: 2,
      //   name: "运营指挥",
      //   icon: "icon-zhihuijiancezhongxin--jichugongnengguanli",
      //   path: "VipMap"
      // },
      {
        id: 3,
        name: "大用户管理",
        icon: "icon-vipdakehu",
        children: [
          {
            id: 31,
            name: "实时数据",
            path: "VipMonitor"
          },
          {
            id: 35,
            name: "数据预警",
            path: "VipEvent"
          },
          {
            id: 32,
            name: "用户档案",
            path: "VipList"
          },
          {
            id: 33,
            name: "智能决策",
            path: "VipAnalysis"
          },
          {
            id: 34,
            name: "业务工单",
            path: "VipTicket"
          }
        ]
      },
      {
        id: 4,
        name: "分区管理",
        icon: "icon-quyu",
        children: [
          {
            id: 42,
            name: "区域监控",
            path: "DmaMonitor"
          },
          {
            id: 43,
            name: "分区档案",
            path: "Dma"
          },
          {
            id: 44,
            name: "智能决策",
            path: "DmaAnalysis"
          },
          {
            id: 45,
            name: "业务工单",
            path: "DmaTicket"
          }
        ]
      },
      {
        id: 5,
        name: "压力管理",
        icon: "icon-yali",
        children: [
          {
            id: 51,
            name: "实时数据",
            path: "MonitorRealtime"
          },
          {
            id: 64,
            name: "站点档案",
            path: "MonitorList"
          },
          {
            id: 53,
            name: "智能决策"
          },
          {
            id: 54,
            name: "业务工单"
          }
        ]
      },
      {
        id: 6,
        name: "表具管理",
        icon: "icon-biaojucaokong",
        children: [
          {
            id: 61,
            name: "表具档案",
            path: "Flowmeter"
          },
          {
            id: 62,
            name: "智能决策",
            path: "MeterAnalysis"
          },
          {
            id: 63,
            name: "业务工单",
            path: "MeterTicket"
          }
          // {
          //   id: 64,
          //   name: "表型管理",
          //   path: "ModelFlowmeter"
          // }
        ]
      },
      {
        name: "系统设置",
        icon: "icon-shezhi",
        id: 7,
        level: 3,
        children: [
          {
            id: 71,
            name: "平台监控",
            icon: "iconfont icon-jiankong",
            children: [
              {
                id: 727,
                name: "数据标签",
                path: "Tag"
              },
              {
                id: 711,
                name: "数据队列",
                path: "Queue"
              },
              {
                id: 712,
                name: "平台服务",
                path: "Building"
              },
              {
                id: 713,
                name: "平台作业",
                path: "Corn"
              }
            ]
          },
          {
            id: 72,
            name: "物联管理",
            icon: "iconfont icon-wulianwang",
            children: [
              {
                id: 721,
                name: "设备模板",
                path: "Model"
              },
              // {
              //   id: 722,
              //   name: "站点管理",
              //   path: "Station"
              // },
              // {
              //   id: 6707,
              //   name: '站点列表',
              //   path: 'StationList'
              // },
              {
                id: 724,
                name: "区域管理",
                path: "Area"
              },
              {
                id: 726,
                name: "数据类型",
                path: "Unit"
              },
              {
                id: 735,
                name: "数据字典",
                path: "Dict"
              }
            ]
          },
          {
            id: 73,
            name: "基础管理",
            icon: "iconfont icon-yonghuguanli",
            children: [
              {
                id: 731,
                name: "部门管理",
                path: "Dep"
              },
              {
                id: 732,
                name: "用户管理",
                path: "User"
              },
              {
                id: 733,
                name: "角色管理",
                path: "Role"
              }
              // {
              //   id: 6751,
              //   name: "菜单管理",
              //   path: "Menu"
              // }
            ]
          },
          {
            id: 74,
            name: "业务应用",
            icon: "iconfont icon-liuchengmoxing",
            children: [
              {
                id: 741,
                name: "流程管理",
                path: "Process"
              },
              {
                id: 725,
                name: "报警设置",
                path: "AlarmConfig"
              },
              {
                id: 736,
                name: "系统管理",
                path: "System"
              }
            ]
          },
          {
            id: 75,
            name: "日志审计",
            icon: "iconfont icon-rizhi",
            children: [
              {
                id: 751,
                name: "登录日志",
                path: "LoginLog"
              },
              {
                id: 752,
                name: "对象操作",
                path: "Building"
              },
              {
                id: 753,
                name: "在线人员",
                path: "Online"
              }
            ]
          }
        ]
      }
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
