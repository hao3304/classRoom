import { iotClient, iotAdminClient, rheniumClient } from "../../apollo";
import { loads, GetSchema } from "@/graphqls/loads.graphql";
import ls from "@/libs/ls";

export default {
  namespaced: true,
  state: {
    system: {},
    areas: [],
    deps: [],
    dicts: [],
    models: [],
    units: [],
    roles: [],
    users: [],
    ticket_types: [],
    me: {},
    types: {
      iot: []
    },
    dmaLevel: [
      {
        id: 1,
        name: "一级分区"
      },
      {
        id: 2,
        name: "二级分区"
      },
      {
        id: 3,
        name: "三级分区"
      }
    ],
    filedType: [
      {
        id: "string",
        name: "字符串"
      },
      {
        id: "int",
        name: "整型"
      },
      {
        id: "float64",
        name: "浮点型"
      },
      {
        id: "date",
        name: "日期"
      },
      {
        id: "time",
        name: "时间"
      },
      {
        id: "dict",
        name: "字典"
      },
      {
        id: "uid",
        name: "用户"
      },
      {
        id: "cuid",
        name: "当前用户"
      },
      {
        id: "now",
        name: "当前时间"
      },
      {
        id: "position",
        name: "定位"
      },
      {
        id: "picture",
        name: "拍照"
      },
      {
        id: "upload",
        name: "上传文件"
      },
      {
        id: "hidden",
        name: "隐藏域"
      }
    ],
    eventStatus: [
      {
        name: "待办事件",
        id: "pending"
      },
      {
        name: "在办事件",
        id: "working"
      },
      {
        name: "审核中",
        id: "auditing"
      },
      {
        name: "办结事件",
        id: "closed"
      }
    ],
    ticketStatus: [
      {
        name: "新建",
        id: "pending"
      },
      {
        name: "处理",
        id: "working"
      },
      {
        name: "审核",
        id: "auditing"
      },
      {
        name: "完成",
        id: "closed"
      }
    ],
    ticketState: [
      {
        id: 1,
        name: "新建"
      },
      {
        id: 2,
        name: "处理"
      },
      {
        id: 3,
        name: "审核"
      },
      {
        id: 100,
        name: "结束"
      }
    ],
    unitType: [
      {
        name: "开关量",
        id: 1
      },
      {
        name: "模拟量",
        id: 2
      },
      {
        name: "脉冲量",
        id: 3
      },
      {
        name: "报警量",
        id: 4
      },
      {
        name: "统计量",
        id: 5
      }
    ],
    modelType: [
      {
        id: 1,
        name: "站点模版"
      },
      {
        id: 2,
        name: "设备模版"
      }
    ]
  },
  actions: {
    async init({ commit }) {
      try {
        const rst = await iotClient.query({
          query: loads
        });

        const api = [rheniumClient.query({ query: GetSchema })];
        if (rst.data.me.admin) {
          api.push(
            iotAdminClient.query({
              query: GetSchema
            })
          );
        }
        const schemas = await Promise.all(api);
        if (api.length > 1) {
          commit("SET_TYPES", {
            iot: schemas[1].data.__schema.types,
            rhenium: schemas[0].data.__schema.types
          });
        } else {
          commit("SET_TYPES", {
            rhenium: schemas[0].data.__schema.types
          });
        }

        commit("SET_INIT", rst);
      } catch (e) {
        throw e;
      }
    }
  },
  mutations: {
    SET_INIT(state, { data }) {
      state.areas = data.areas;
      state.deps = data.deps;
      state.dicts = data.dicts;
      state.models = data.models;
      state.units = data.units;
      state.me = data.me;
      state.roles = data.roles;
      state.users = data.users.data;
      state.ticket_types = data.ticket_types;
      state.system = data.system_config;
    },
    SET_TYPES(state, payload) {
      state.types = payload;
    }
  },
  getters: {
    getDict: state => key => {
      const dict = state.dicts.find(dict => dict.id == key);
      return dict ? dict.values : [];
    },
    getDictVal: state => {
      return function(key, value) {
        const target = state.dicts.find(dict => dict.id == key);
        const values = target ? target.values : [];
        const dict = values.find(v => v.value == value);
        return dict ? dict.name : "-";
      };
    }
  }
};
