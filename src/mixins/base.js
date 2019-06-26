import { mapState } from "vuex";
import stationIcon from "@/assets/images/icon/station.png";
const allIcon = require("@/assets/images/icon/all.png");
const areaIcon = require("@/assets/images/icon/area.png");
export default {
  computed: {
    ...mapState(["windowHeight", "winHeight", "winWidth", "windowWidth"]),
    ...mapState("common", ["areas"])
  },
  methods: {
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
