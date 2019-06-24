<template>
  <div class="f-slider">
    <div class="f-slider__arrow" @click="onExpand">
      <i v-show="!sliderExpand" class="icon-expand8 iconfont rotate180"></i>
      <i v-show="sliderExpand" class="icon-expand8 iconfont "></i>
    </div>
    <GeminiScrollbar class="f-slider__menu">
      <div class="f-slider__collapse">
        <i class="iconfont icon-menu"></i>
      </div>
      <SideMenu
        @itemClick="onSelect"
        v-if="sliderMenu.length > 0"
        :data="sliderMenu"
        :border="false"
        :collapsed="sliderExpand"
      ></SideMenu>
    </GeminiScrollbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { routes } from "@/router";
export default {
  name: "FSlider",
  data() {
    return {
      menus: []
    };
  },
  computed: {
    ...mapState("app", ["sliderMenu", "sliderExpand", "selectModuleTitle"])
  },
  methods: {
    ...mapMutations("app", ["add_tab", "set_slider_expand"]),
    onSelect(menu) {
      this.$router.push({ name: menu.path, params: menu.params });
      // let m;
      // if (menu.path.indexOf("http") > -1) {
      //   m = {
      //     text: menu.text,
      //     path: menu.path
      //   };
      // } else {
      //   const route = routes.find(route => route.name == menu.path);
      //   m = {
      //     text: menu.text,
      //     path: route ? route.path : "/404"
      //   };
      // }
      // this.add_tab(m);
    },
    onExpand() {
      this.set_slider_expand(!this.sliderExpand);
    }
  },
  mounted() {
    window.eventBus.$on("add_tab", payload => {
      this.add_tab(payload);
    });
  }
};
</script>

<style lang="less">
@import "~@/styles/theme";
.f-slider {
  width: @SliderWidth;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #222d32;
  display: flex;
  flex-direction: column;

  &__menu {
    width: 100%;
    flex: 1;
  }
  &__arrow {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #444;
    text-align: center;
    color: #bbb;
    font-size: 18px;
    cursor: pointer;
    .rotate180 {
      transform: rotate(180deg);
      display: inline-block;
    }
    &:hover {
      color: #fff;
    }
  }

  &__collapse {
    height: 33px;
    line-height: 33px;
    display: none;
    text-align: center;
    background-color: #333;
    cursor: pointer;
    i {
      color: #bbb;
    }
    &:hover {
      i {
        color: #fff;
      }
    }
  }

  .sidemenu {
    .panel-with-icon {
      padding-left: 20px;
    }

    .accordion-header-selected .panel-title,
    .accordion-header-selected .panel-icon {
      color: #fff !important;
    }
  }

  .sidemenu li {
    cursor: pointer;
    .tree-icon {
      display: none;
    }
    .tree-title {
      padding-left: 24px;
    }
  }
  .sidemenu .panel-icon {
    margin-top: -12px;
    height: 20px;
    left: 15px;
  }

  .sidemenu .accordion .panel-title {
    color: #b8c7ce;
  }
  .sidemenu .accordion .accordion-header {
    background: #222d32;
    color: #b8c7ce;
    padding-left: 20px;
  }
  .sidemenu .accordion .accordion-body {
    background: #2c3b41;
    color: #8aa4af;
  }
  .sidemenu .accordion .accordion-header-selected {
    background: #1e282c;
    &:before {
      content: " ";
      width: 3px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      background-color: #3c8dbc;
    }
  }
  .sidemenu .tree-node-hover {
    background: #2c3b41;
    color: #fff;
  }
  .sidemenu .tree-node-selected {
    background: #2c3b41;
    color: #fff;
  }
  .sidemenu .accordion-header .panel-tool {
    display: none;
  }
  .sidemenu .accordion-header::after,
  .sidemenu .tree-node-nonleaf::after {
    display: inline-block;
    vertical-align: top;
    border-style: solid;
    transform: rotate(45deg);
    width: 6px;
    height: 6px;
    content: "";
    position: absolute;
    right: 15px;
    top: 50%;
    margin-top: -4px;
    border-width: 0 1px 1px 0;
  }
  .sidemenu .accordion-header-selected::after {
    transform: rotate(-135deg);
  }
  .sidemenu .tree-node-nonleaf::after {
    transform: rotate(-135deg);
  }
  .sidemenu .tree-node-nonleaf-collapsed::after {
    transform: rotate(45deg);
  }
  .sidemenu-collapsed .accordion-header::after {
    display: none;
  }
  .sidemenu-tooltip .accordion {
    border-color: #1e282c;
  }
}
</style>
