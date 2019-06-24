import { mapState } from "vuex";
import stationIcon from "@/assets/images/icon/station.png";
import { GetArea } from "@/graphqls/loads.graphql";
const allIcon = require("@/assets/images/icon/all.png");
const areaIcon = require("@/assets/images/icon/area.png");
import { GetDmas } from "@/graphqls/dma.graphql";
export default {
  computed: {
    ...mapState(["windowHeight", "winHeight", "winWidth", "windowWidth"]),
    ...mapState("common", ["areas"])
  },
  methods: {
    GetStationTree(type, nocheck = false) {
      return new Promise((resolve, reject) => {
        this.$apollo
          .query({
            query: GetArea,
            variables: {
              units: type ? [type] : []
            }
          })
          .then(rep => {
            const areas = JSON.parse(JSON.stringify(rep.data.areas));
            const loop = parent => {
              parent.icon = areaIcon;
              parent.iconCls = "f-icon-area";
              parent.isHidden = !parent.status;
              parent._type = "area";
              parent.nocheck = nocheck;
              if (parent.children && parent.children.length > 0) {
                parent.children.forEach(child => loop(child));
              }
              if (parent.stations && parent.stations.length > 0) {
                parent.stations.forEach(station => {
                  station.icon = stationIcon;
                  station.iconCls = "f-icon-station";
                  station._type = "station";
                  station.nocheck = nocheck;
                  station.isParent = nocheck;
                  if (!parent.children) {
                    parent.children = [];
                  }
                  parent.children.push(station);
                });
              }
            };
            areas.forEach(area => loop(area));
            resolve(areas);
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    GetAreaTree() {
      const areas = JSON.parse(JSON.stringify(this.areas));
      const loop = parent => {
        parent.icon = areaIcon;
        parent.isHidden = !parent.status;
        if (parent.children && parent.children.length > 0) {
          parent.children.forEach(child => loop(child));
        }
      };
      areas.forEach(area => loop(area));

      const treeData = [
        {
          id: null,
          name: "全部区域",
          icon: allIcon,
          open: true,
          children: areas
        }
      ];

      return treeData;
    },
    GetDmaTree(noTrans) {
      return new Promise((resolve, reject) => {
        this.$apollo
          .query({
            query: GetDmas,
            client: "rhenium"
          })
          .then(({ data }) => {
            if (!noTrans) {
              const tableData = this._getDmaTree(data.dmas);
              resolve(tableData);
            } else {
              resolve(data.dmas);
            }
          });
      });
    },
    _getDmaTree(data) {
      const treeData = [
        {
          id: null,
          parent: null,
          name: "根节点",
          icon: allIcon,
          open: true
        }
      ];

      data.forEach(item => {
        item.icon = areaIcon;
        item.open = true;
        item.name = item.o_station.name;
        treeData.push(item);
      });
      return treeData;
    },
    $Confirm(config) {
      this.$Modal.confirm(config);
      this.$nextTick(() => {
        document
          .querySelector(
            ".ivu-modal-wrap:not(.ivu-modal-hidden) .ivu-modal-confirm .ivu-modal-confirm-footer .ivu-btn-primary"
          )
          .focus();
      });
    }
  },
  mounted() {
    if (this.baseTime) clearInterval(this.baseTime);
    this.baseTime = setInterval(() => {
      if (this.busRun) {
        this.busRun.call(this);
      }
    }, 30000);
  },
  beforeDestroy() {
    clearInterval(this.baseTime);
  }
};
