<template>
  <Modal
    class="map-position"
    @on-visible-change="onChange"
    :footer-hide="type == 'simple'"
    fullscreen
    v-model="dialog"
    title="绘制区域"
  >
    <div v-if="show" class="map-position__container">
      <h5 class="map-position__tip" v-show="isDrawing">
        鼠标点击地图开始绘制地图,双击鼠标结束绘制
      </h5>
      <div class="map-position__map" ref="map">
        <Spin fix v-if="loading"></Spin>
      </div>
    </div>

    <div v-if="show" class="map-position__search">
      <input
        class="ivu-input"
        id="map_search"
        type="text"
        v-model="str"
        placeholder="请输入关键字：（选定后搜索）"
      />
    </div>

    <div slot="footer">
      <Button type="warning" @click="onReset" v-show="value">清空</Button>
      <Button @click="onCancel">取消</Button>
      <Button type="primary" @click="onClick">确定</Button>
    </div>
  </Modal>
</template>

<script>
/* global AMap*/
import base from "@/mixins/base";
import { mapState } from "vuex";
export default {
  name: "mapPosition",
  mixins: [base],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    search: {
      type: String,
      default: ""
    },
    value: {
      type: String
    }
  },
  computed: {
    ...mapState("common", ["system"])
  },
  watch: {
    show() {
      this.dialog = this.show;
      if (this.dialog) {
        setTimeout(() => {
          this.render();
        }, 200);
      }
    },
    value(v) {
      this.val = v;
    }
  },
  data() {
    return {
      map: null,
      dialog: this.show,
      loading: true,
      str: this.search,
      isDrawing: false,
      val: this.value,
      polygon: null
    };
  },
  methods: {
    render() {
      let center = [120.76034545898439, 30.749507460819707];
      if (this.system.geo_center) {
        center = this.system.geo_center.split(",").map(s => parseFloat(s));
      }
      if (this.position) {
        const latlng = this.position.split(",");
        center[0] = parseFloat(latlng[0]);
        center[1] = parseFloat(latlng[1]);
      }

      const map = (this.map = new AMap.Map(this.$refs.map, {
        center: center,
        zoom: 14,
        resizeEnable: true,
        expandZoomRange: true,
        zooms: [3, 20]
      }));

      AMap.plugin(
        ["AMap.MapType", "AMap.Scale", "AMap.Autocomplete", "AMap.PlaceSearch"],
        function() {
          //异步加载插件
          map.addControl(new AMap.MapType());
          map.addControl(new AMap.Scale());
          const autoOptions = {
            city: process.env.VUE_APP_CITY,
            input: "map_search"
          };
          const autocomplete = new AMap.Autocomplete(autoOptions);
          const placeSearch = new AMap.PlaceSearch({
            city: process.env.VUE_APP_CITY,
            map: map
          });

          AMap.event.addListener(autocomplete, "select", function(e) {
            //TODO 针对选中的poi实现自己的功能
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);
          });
          if (this.search) {
            this.str = this.search;
            placeSearch.search(this.search);
          }
        }.bind(this)
      );
      if (!this.val) {
        //通过插件方式引入 AMap.MouseTool 工具
        map.plugin(["AMap.MouseTool"], () => {
          //在地图中添加MouseTool插件
          const mouseTool = new AMap.MouseTool(map);
          this.isDrawing = true;

          //用鼠标工具画多边形
          mouseTool.polygon();
          //添加事件
          AMap.event.addListener(mouseTool, "draw", e => {
            mouseTool.close(true);
            this.isDrawing = false;
            this.drawPolygon(e.obj.getPath());
          });
        });
      } else {
        const ll = this.value.split(";");
        const path = [];

        ll.forEach(l => {
          const latlng = l.split(",");
          path.push(
            new AMap.LngLat(parseFloat(latlng[0]), parseFloat(latlng[1]))
          );
        });

        this.drawPolygon(path);
      }

      this.loading = false;
    },
    onCancel() {
      this.$emit("update:show", false);
    },
    onChange(v) {
      this.$emit("update:show", v);
    },
    setCenter(position) {
      const latlng = position.split(",");
      const center = new AMap.LngLat(
        parseFloat(latlng[0]),
        parseFloat(latlng[1])
      );
      this.map.setZoomAndCenter(16, center);
    },
    onClick() {
      if (this.polygon) {
        this.val = this.polygon.toString();
        this.$emit("input", this.val);
      } else {
        this.$emit("input", null);
      }
      this.onCancel();
    },
    drawPolygon(path) {
      this.polygon = new AMap.Polygon({
        path: path,
        borderWeight: 2, // 线条宽度，默认为 1
        fillOpacity: 0.4,
        lineJoin: "round" // 折线拐点连接处样式
      });
      this.map.add(this.polygon);

      this.map.plugin(["AMap.PolyEditor"], () => {
        // 实例化多边形编辑器，传入地图实例和要进行编辑的多边形实例
        const polylineEditor = new AMap.PolyEditor(this.map, this.polygon);
        // 开启编辑模式
        polylineEditor.open();
      });
    },
    onReset() {
      this.$emit("input", null);
      this.val = null;
      this.onCancel();
    }
  },
  mounted() {
    if (this.dialog) this.render();
  }
};
</script>

<style lang="less">
@import "~iview/src/styles/index";
.amap-sug-result {
  z-index: 3000;
}
.map-position {
  overflow: hidden;
  .ivu-modal-body {
    padding: 0;
  }

  &__tip {
    position: absolute;
    bottom: 10px;
    width: 100%;
    left: 0;
    text-align: center;
    z-index: 1000;
    color: @primary-color;
    font-size: 24px;
  }

  &__container {
    height: 100%;
    display: flex;
  }

  &__info {
    width: 220px;
    border-left: 1px solid #ddd;
    padding: 0 20px;

    h5 {
      color: #333;
      font-size: 12px;
      font-weight: bold;
      margin: 4px 0;
    }
  }

  &__map {
    flex: 1;
    position: relative;
  }

  &__search {
    position: absolute;
    width: 300px;
    top: 20px;
    left: 20px;
    input {
      width: 100%;
    }
  }

  &__header {
    padding: 10px 0;
    font-size: 16px;
  }
}
</style>
