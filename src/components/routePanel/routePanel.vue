<template>
  <div class="route-panel">
    <not-find v-if="!info" content="请选择起始和终点">
      <div slot="button"></div>
    </not-find>
    <div v-else class="amap-lib-driving">
      <div class="planTitle" index="0">
        <h3 class="planTitle_route" :title="title">
          <b>{{ roads }}</b>
        </h3>
        <p>
          {{ getTime(info.time) }}({{ getDistance(info.distance) }}) |
          <span class="blue">{{ info.policy }}</span>
        </p>
      </div>
      <dl class="plan plan-nobus" style="display: block;">
        <dt class="start">
          <div class="beforedt"></div>
          <div class="afterdt"></div>
          <b>起点</b>
        </dt>
        <dt
          v-for="(step, index) in info.steps"
          :key="index"
          class="route "
          :class="getClass(step.action)"
          index="0"
        >
          <div class="beforedt"></div>
          <div class="afterdt"></div>
          {{ step.instruction }}
        </dt>
        <dt class="end">
          <div class="beforedt"></div>
          <b>终点</b>
        </dt>
      </dl>
    </div>
  </div>
</template>
<script>
export default {
  props: ["info"],
  name: "routePanel",
  data() {
    return {};
  },
  computed: {
    title() {
      if (this.info) {
        const roads = [];
        this.info.steps.forEach(step => {
          if (step.road) {
            roads.push(step.road);
          }
        });
        return roads.join(">");
      } else {
        return "";
      }
    },
    roads() {
      if (this.info) {
        const roads = [];
        this.info.steps.forEach(step => {
          if (step.road) {
            roads.push(step.road);
          }
        });
        if (roads.length <= 4) {
          return roads.join(">");
        } else {
          return `${roads[0]}>${roads[1]}>···>${roads[roads.length - 2]}>${
            roads[roads.length - 1]
          }`;
        }
      } else {
        return "";
      }
    }
  },
  methods: {
    getClass(action) {
      switch (action) {
        case "左转":
          return "turn-left";
        case "右转":
          return "turn-right";
        case "向右前方行驶":
          return "turn-rightup";
        case "向左前方行驶":
          return "turn-leftup";
        case "靠右":
          return "turn-keepright";
        case "靠左":
          return "turn-keepleft";
        default:
          return "turn-advance";
      }
    },
    getTime(time) {
      if (time < 60) {
        return time + "秒";
      } else {
        return Math.round(time / 60) + "分钟";
      }
    },
    getDistance(distance) {
      if (distance < 1000) {
        return distance + "米";
      } else {
        return distance / 1000 + "公里";
      }
    }
  }
};
</script>

<style scoped>
.route-panel {
  padding: 5px;
}
.amap-lib-driving {
  margin: 0;
  padding: 0;
  color: #565656;
  font-family: "Microsoft Yahei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  line-height: 1.5;
  word-wrap: break-word;
  background-color: #fff;
  border: 1px solid silver;
}
.amap-lib-driving ol,
.amap-lib-driving ul {
  list-style: none none;
  margin: 0;
  padding: 0;
}
.amap-call {
  font-size: 12px;
  color: #fafafa;
  cursor: pointer;
  text-decoration: underline;
  background-color: #bbb;
  text-align: right;
  padding: 3px 8px 1px 3px;
}
.amap-lib-driving .planTitle .clearfix a {
  text-decoration: underline;
}
.amap-lib-driving .blue {
  color: #3d93fd;
}
.amap-lib-driving p {
  margin: 0;
}
.amap-lib-driving b,
.amap-lib-driving strong {
  font-weight: 700;
}
.amap-lib-driving dt {
  cursor: pointer;
}
.amap-lib-driving .planTitle {
  position: relative;
  padding: 2px 8px;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  background: #fafafa;
  font-size: 14px;
  cursor: pointer;
}
.amap-lib-driving .planTitle:hover {
  background: #fff;
}
.amap-lib-driving .planTitle.current .sidebar,
.amap-lib-driving .planTitle:hover .sidebar {
  display: block;
}
.amap-lib-driving .planTitle span.red {
  color: #ff4546;
}
.amap-lib-driving .planTitle h3 {
  margin-top: 0;
  font-size: 13px;
  margin-bottom: 1px;
}
.amap-lib-driving .planTitle p {
  font-size: 12px;
  margin-bottom: 1px;
  color: #666;
}
.amap-lib-driving .planTitle ul {
  display: none;
  margin-top: 3px;
}
.amap-lib-driving .planTitle ul li {
  float: left;
}
.amap-lib-driving .planTitle ul li:last-child {
  border-right: none;
}
.amap-lib-driving .planTitle ul li a {
  background-repeat: no-repeat;
  color: #00f;
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  padding-right: 8px;
  text-indent: 20px;
}
.amap-lib-driving .planTitle ul li a.icon-share {
  padding-left: 0;
  background-position: 0 center;
}
.amap-lib-driving .icon-arrow-up {
  background-image: url(https://webapi.amap.com/theme/v1.3/images/newpc/icon/arrow-up.png);
}
.amap-lib-driving .planTitle .sidebar {
  display: none;
  position: absolute;
  width: 30px;
  height: 30px;
  top: 50%;
  right: 0;
  pointer-events: none;
  margin-top: -15px;
}
.amap-lib-driving .planTitle .sidebar div {
  display: block;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  transition: all 300ms ease-in 0s;
  -webkit-transition: all 300ms ease-in 0s;
  -moz-transition: all 300ms ease-in 0s;
  background-image: url(https://webapi.amap.com/theme/v1.3/images/newpc/icon/arrow-down.png);
}
.amap-lib-driving .planTitle .sidebar div.expand {
  background-image: url(https://webapi.amap.com/theme/v1.3/images/newpc/icon/arrow-up.png);
}
.amap-lib-driving .plan {
  display: none;
  font-size: 12px;
  margin: 0;
}
.amap-lib-driving .plan .grey {
  color: #999;
}
.amap-lib-driving .plan .blue {
  color: #3baeca;
}
.amap-lib-driving .plan dt {
  position: relative;
  margin-left: 35px;
  line-height: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 3px;
  padding-top: 3px;
}
.amap-lib-driving .plan dt:hover {
  background: #fafafa;
}
.amap-lib-driving .plan dt span.grey {
  font-weight: 400;
}
.amap-lib-driving .plan dt span.line {
  padding-left: 5px;
  padding-right: 5px;
  display: inline-block;
  line-height: 22px;
  color: #fff;
  background: #3baeca;
  text-indent: 0;
}
.amap-lib-driving .plan dt:first-child {
  border-top: 1px solid #f0f0f0;
}
.amap-lib-driving .plan dt .beforedt {
  left: -30px;
  border-radius: 50%;
  background-color: #fff;
  background-position: center;
  background-repeat: no-repeat;
  text-indent: 0;
  text-align: center;
  font-size: 12px;
  z-index: 10;
}
.amap-lib-driving .beforedt {
  top: 15px;
  left: -22px;
  height: 100%;
  width: 4px;
  z-index: -1;
  position: absolute;
  background-color: #e5e7e8;
}
.amap-lib-driving .afterdt {
  position: absolute;
}
.amap-lib-driving .plan dt.end,
.amap-lib-driving .plan dt.start,
.amap-lib-driving .plan dt.via {
  font-size: 14px;
}
.amap-lib-driving .plan dt.end .beforedt,
.amap-lib-driving .plan dt.start .beforedt,
.amap-lib-driving .plan dt.via .beforedt {
  margin-top: -10px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  color: #fff;
  background-image: url(https://webapi.amap.com/theme/v1.3/images/newpc/diricon.png);
}
.amap-lib-driving .plan dt.start .beforedt {
  background-position: -47px -104px;
}
.amap-lib-driving .plan dt.via .beforedt {
  background-position: -85px -104px;
}
.amap-lib-driving .plan dt.end .beforedt {
  background-position: -126px -104px;
}
.amap-lib-driving .plan dt.end .afterdt {
  height: 0;
}
.amap-lib-driving .afterdt {
  background-color: #e5e7e8;
  left: -22px;
  top: 20px;
  height: 500px;
  width: 4px;
  z-index: 9;
}
.amap-lib-driving > .plan dt > .afterdt {
  height: 100%;
}
.amap-lib-driving .plan dt.walk .beforedt {
  left: -27px;
  width: 10px;
  height: 10px;
  margin-top: -6px;
  border: 2px solid #ddd;
}
.amap-lib-driving .plan dt.bus .beforedt,
.amap-lib-driving .plan dt.subway .beforedt {
  left: -31px;
  width: 24px;
  height: 24px;
  margin-top: -12px;
  background-image: url(https://webapi.amap.com/theme/v1.3/images/newpc/diricon.png);
}
.amap-lib-driving .plan dt.bus .afterdt {
  background-color: #33a7ff;
}
.amap-lib-driving .plan dt.subway .afterdt {
  background-color: #3baeca;
}
.amap-lib-driving .plan dt.bus .beforedt {
  background-position: -164px -102px;
}
.amap-lib-driving .plan dt.subway .beforedt {
  background-position: -243px -101px;
}
.amap-lib-driving .plan-nobus {
  margin: 0;
}
.amap-lib-driving .plan-nobus dt span {
  display: block;
  line-height: 18px;
}
.amap-lib-driving .plan-nobus dt .beforedt {
  left: -31px;
  width: 21px;
  height: 21px;
  margin-top: -12px;
  border: 1px solid #ddd;
  background-image: url(https://webapi.amap.com/theme/v1.3/images/newpc/diricon.png);
}
.amap-lib-driving .plan-nobus dt.end .beforedt,
.amap-lib-driving .plan-nobus dt.start .beforedt,
.amap-lib-driving .plan-nobus dt.via .beforedt {
  border: none;
}
.amap-lib-driving .plan-nobus dt.turn-go .beforedt {
  background-image: url(https://webapi.amap.com/theme/v1.3/images/newpc/icon/turn-go.png);
}
.amap-lib-driving .plan-nobus dt.turn-advance .beforedt {
  background-position: -46px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-left .beforedt {
  background-position: -87px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-right .beforedt {
  background-position: -124px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-keepleft .beforedt {
  background-position: -406px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-keepright .beforedt {
  background-position: -445px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-leftup .beforedt {
  background-position: -165px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-leftdown .beforedt {
  background-position: -246px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-rightup .beforedt {
  background-position: -206px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-rightdown .beforedt {
  background-position: -284px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-leftback .beforedt {
  background-position: -327px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-rightback .beforedt {
  background-position: -365px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-enterRing .beforedt {
  background-position: -561px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-leaveRing .beforedt {
  background-position: -602px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-slow .beforedt {
  background-position: -524px -23px;
}
.amap-lib-driving .plan-nobus dt.turn-crosswalk .beforedt {
  background-position: -126px -184px;
}
.amap-lib-driving .plan-nobus dt.turn-overpass .beforedt {
  background-position: -164px -184px;
}
.amap-lib-driving .plan-nobus dt.turn-underpass .beforedt {
  background-position: -85px -184px;
}
.amap-lib-driving .plan-nobus dt.turn-squarepass .beforedt {
  background-position: -204px -184px;
}
.amap-lib-marker-from,
.amap-lib-marker-mid,
.amap-lib-marker-to {
  position: absolute;
  width: 19px;
  height: 31px;
  color: #e90000;
}
.amap-lib-marker-from {
  background: url(https://webapi.amap.com/theme/v1.3/markers/n/start.png)
    no-repeat;
  cursor: pointer;
}
.amap-lib-marker-to {
  background: url(https://webapi.amap.com/theme/v1.3/markers/n/end.png)
    no-repeat;
  cursor: pointer;
}
.amap-lib-marker-mid {
  background: url(https://webapi.amap.com/theme/v1.3/markers/n/mid.png)
    no-repeat;
}
.amap-combo-close {
  position: absolute;
  top: 11px;
  right: 10px;
  background: url(https://webapi.amap.com/theme/v1.3/images/amap-info.png) -1px -151px
    no-repeat;
  width: 12px;
  height: 12px;
  cursor: pointer;
}
.amap-content-body {
  min-width: 200px;
  max-width: 240px;
  font-family: Helvetica, "Hiragino Sans GB", "Microsoft Yahei", "微软雅黑",
    Arial, sans-serif;
  box-shadow: 0 0 0.5px rgba(0, 0, 100, 0.6);
  background: #fff;
  border-radius: 2px;
  text-align: left;
  border: 1px solid silver;
}
.amap-combo-sharp {
  margin: 0 auto;
  bottom: 1px;
  position: relative;
  background: url(https://webapi.amap.com/theme/v1.3/images/amap-info.png) -5px -564px
    no-repeat;
  width: 18px;
  height: 9px;
}
.amap-lib-infowindow {
  padding: 0;
  position: relative;
  background-color: #fff;
  margin: 8px;
}
.amap-lib-infowindow-title {
  line-height: 22px;
  font-size: 14px;
  border-bottom: 1px #99adce solid;
  padding-right: 15px;
}
.amap-lib-infowindow-content {
  padding-top: 5px;
  overflow: hidden;
  font-size: 12px;
  zoom: 1;
}
@media only screen and (-webkit-min-device-pixel-ratio: 1.5),
  only screen and (min-resolution: 144dpi) {
  .amap-lib-marker-from,
  .amap-lib-marker-mid,
  .amap-lib-marker-to {
    background-size: 100% 100%;
  }
  .amap-lib-marker-from {
    background-image: url(https://webapi.amap.com/theme/v1.3/markers/b/start.png);
  }
  .amap-lib-marker-to {
    background-image: url(https://webapi.amap.com/theme/v1.3/markers/b/end.png);
  }
  .amap-lib-marker-mid {
    background-image: url(https://webapi.amap.com/theme/v1.3/markers/b/mid.png);
  }
}
</style>
