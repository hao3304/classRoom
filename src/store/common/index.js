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
    }
  },
  actions: {
  },
  mutations: {

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
