<template>
  <div class="f-panel-h" :class="{ collapsed: collapsed }">
    <Split v-model="spl" v-if="split <= 0.5">
      <div slot="left" class="split-pane split-pane-left" v-show="spl != 0">
        <slot name="left" :collapsed="collapsed"></slot>
        <div class="navbar-collapse" @click="onCollapse" v-show="!collapsed">
          <div class="navbar-collapse-bg"></div>
          <i class="iconfont icon-expand8 navbar-collapse-arrow__left"></i>
        </div>
      </div>
      <div slot="right" class="split-pane split-pane-right">
        <slot name="right" :collapsed="collapsed"></slot>
        <div class="navbar-collapse" @click="onCollapse" v-show="collapsed">
          <div class="navbar-collapse-bg"></div>
          <i class="iconfont icon-expand8 "></i>
        </div>
      </div>
    </Split>
  </div>
</template>

<script>
export default {
  name: "TowHorizontal",
  props: {
    split: {
      type: Number,
      default: 0.15
    }
  },
  data() {
    return {
      spl: this.split,
      collapsed: false
    };
  },
  methods: {
    onCollapse() {
      this.collapsed = !this.collapsed;
      this.init();
    },
    init() {
      this.spl = this.collapsed ? 0 : this.split;
    }
  }
};
</script>

<style lang="less">
.f-panel-h {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .ivu-split-trigger-bar-con.vertical {
    display: none;
  }
  .ivu-split-trigger-bar-con {
    z-index: 101;
  }

  &.collapsed {
    .ivu-split-horizontal > .ivu-split-trigger-con {
      display: none;
    }
    .split-pane-right {
      padding-left: 0;
    }
  }
  .split-pane {
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
  }
  .split-pane-right {
    padding-left: 5px;
    .navbar-collapse {
      position: absolute;
      top: 50%;
      width: 20px;
      height: 50px;
      line-height: 50px;
      z-index: 200;
      left: 0;
      margin-top: -25px;
      cursor: pointer;

      &-bg {
        left: 0;
        position: absolute;
        border-bottom: 9px solid transparent;
        border-right: none;
        border-left: 13px solid #f7f7f7;
        border-top: 9px solid transparent;
        height: 100%;
        transition: all 0.2s ease;
      }

      &:hover {
        .navbar-collapse-bg {
          border-bottom: 8px solid transparent;
          border-right: none;
          border-left: 20px solid #f7f7f7;
          border-top: 8px solid transparent;
        }
        .iconfont {
          left: 0;
        }
      }

      .iconfont {
        z-index: 100;
        position: absolute;
        transition: all 0.2s ease;
        left: -5px;
      }
    }
  }

  .split-pane-left {
    .navbar-collapse {
      position: absolute;
      top: 50%;
      width: 20px;
      height: 50px;
      line-height: 50px;
      z-index: 9;
      right: 0;
      margin-top: -25px;
      cursor: pointer;

      &-arrow__left {
        transform: rotate(180deg);
      }

      &-bg {
        right: 0;
        position: absolute;
        left: auto;
        border-bottom: 9px solid transparent;
        border-left: none;
        border-right: 13px solid #f7f7f7;
        border-top: 9px solid transparent;
        height: 100%;
        transition: all 0.2s ease;
      }

      &:hover {
        .navbar-collapse-bg {
          border-bottom: 8px solid transparent;
          border-left: none;
          border-right: 20px solid #f7f7f7;
          border-top: 8px solid transparent;
        }
        .iconfont {
          right: 0;
        }
      }

      .iconfont {
        z-index: 100;
        position: absolute;
        transition: all 0.2s ease;
        right: -5px;
      }
    }
  }
}
</style>
