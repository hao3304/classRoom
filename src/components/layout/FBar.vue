<template>
  <div :class="b()">
    <div :class="b('left')">
      当前区域：
      <strong style="width: 60px;overflow: hidden;" :class="b('now')">{{
        getName(selectName) || "显示全部"
      }}</strong>
      <a
        href="javascript:;"
        @click="onLeft"
        :class="b('arrow', { visible: !!left })"
        ><Icon type="md-arrow-dropleft"
      /></a>
    </div>
    <div :class="b('center')">
      <ul :style="{ width: totalWidth + 'px', left: -left + 'px' }">
        <li
          :class="{ active: active.indexOf(item.id) > -1 }"
          v-for="(item, index) in data"
          @click="onSelect(item)"
          @mouseenter="onMouseEnter($event, item)"
          @mouseleave="onMouseLeave"
          :key="item.id"
        >
          <span
            >{{ item.name
            }}<Icon
              v-if="item.children && item.children.length > 0"
              type="md-arrow-dropup"
          /></span>
        </li>
      </ul>
    </div>
    <div :class="b('right', { all: active.length > 0 })">
      <a
        :class="b('now')"
        v-if="active.length > 0"
        href="javascript:;"
        @click="onReset"
        >显示全部</a
      >
      <a
        href="javascript:;"
        @click="onRight"
        :class="b('arrow', { visible: rightVisible })"
        ><Icon type="md-arrow-dropright"
      /></a>
    </div>

    <div
      :class="b('child')"
      v-show="children.length > 0 && showChildren"
      :style="{ left: childLeft + 'px' }"
      @mouseenter="onMouseEnterChild"
      @mouseleave="
        enterChild = false;
        showChildren = false;
      "
    >
      <ul>
        <li
          v-for="child in children"
          @click="onSelectChild(child)"
          :class="{ active: active.indexOf(child.id) > -1 }"
          :key="child.id"
        >
          {{ child.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import base from "@/mixins/base";
import { mouseEvent } from "@/components/common";
export default {
  props: {
    data: {
      default: () => [],
      type: Array
    }
  },
  mixins: [base],
  data() {
    return {
      left: 0,
      totalWidth: 0,
      rightVisible: true,
      active: [],
      selectName: "",
      children: [],
      childLeft: 0,
      enterChild: false,
      showChildren: false
    };
  },
  watch: {
    data() {
      this.$nextTick(() => this.init());
    },
    windowWidth() {
      this.$nextTick(() => this.init());
    },
    active() {
      this.$nextTick(() => this.init());
    }
  },
  name: "f-bar",
  methods: {
    init() {
      this.totalWidth = 0;
      this.wrapperWith = $(this.$el)
        .find(".f-bar__center")
        .width();
      this.$items = $(this.$el).find(".f-bar__center li");
      this.$items.each((i, item) => {
        this.totalWidth += item.offsetWidth;
      });
      if (this.totalWidth > this.wrapperWith) {
        this.rightVisible = true;
      } else {
        this.rightVisible = false;
      }

      if (!this.bindEvent) {
        mouseEvent.wheel({
          target: $(this.$el).find(".f-bar__center")[0],
          callback: (e, direction) => {
            this.children = [];
            if (direction < 0) {
              this.onRight();
            } else {
              this.onLeft();
            }
          }
        });
        this.bindEvent = true;
      }
    },
    getNextWidth() {
      let nowWidth = 0;
      const total = this.wrapperWith + this.left;

      for (let i = 0; i < this.$items.length; i++) {
        const item = this.$items[i];
        let temp = nowWidth;
        if (total >= nowWidth) {
          nowWidth += item.offsetWidth;
        }
      }
      return nowWidth - this.wrapperWith;
    },
    getPreWidth() {
      let result = this.left;
      if (this.left > 0) {
        let nowWidth = 0,
          temp = 0,
          cut = false;
        for (let i = 0; i < this.$items.length; i++) {
          const item = this.$items[i];
          if (this.left > nowWidth) {
            temp = nowWidth;
            nowWidth += item.offsetWidth;
          } else {
            if (!cut) {
              result = temp;
            }
            cut = true;
          }
        }
      }
      return this.left - result;
    },
    onLeft() {
      this.left = this.left - this.getPreWidth();
    },
    onRight() {
      if (!this.rightVisible) return;
      this.left = this.getNextWidth();
      if (this.totalWidth == this.left + this.wrapperWith) {
        this.rightVisible = false;
      } else {
        this.rightVisible = true;
      }
    },
    onSelect(item) {
      this.active = [item.id];
      this.selectName = item.name;
      this.$nextTick(() => this.init());
      this.$emit("on-select", this.active);
    },
    onMouseEnter(e, item) {
      this.children = item.children || [];
      this.pid = item.id;
      this.showChildren = true;
      this.childLeft =
        e.target.offsetLeft -
        this.left +
        $(this.$el)
          .find(".f-bar__left")
          .width();
    },
    onMouseEnterChild() {
      this.enterChild = true;
      this.showChildren = true;
    },
    onMouseLeave() {
      if (this.enterChild === false) {
        this.showChildren = false;
      }
    },
    getName(name) {
      if (name) {
        if (name.length >= 10) {
          return name.slice(0, 9) + "...";
        } else {
          return name;
        }
      } else {
        return null;
      }
    },
    onReset() {
      this.selectName = "";
      this.active = [];
      this.$emit("on-select", this.active);
    },
    onSelectChild(child) {
      this.active = [this.pid, child.id];
      this.selectName = child.name;
      this.$emit("on-select", [child.id]);
    }
  },
  mounted() {
    if (this.data.length > 0) this.$nextTick(() => this.init());
  }
};
</script>

<style lang="less">
.f-bar {
  background-color: #eff3f9;
  border: 1px solid #e3e7ef;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  position: relative;
  &__center {
    flex: 1;
    overflow: hidden;
    position: relative;
    height: 100%;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    > ul {
      white-space: nowrap;
      width: 100%;
      height: 100%;
      position: absolute;
      transition: all 0.2s;
      top: 0;
      li {
        height: 100%;
        line-height: 38px;
        list-style: none;
        display: inline-block;

        color: #7e8ca6;
        position: relative;
        padding: 0 2px;
        cursor: pointer;
        span {
          padding: 4px 8px;
        }
        &:hover {
          span {
            background-color: #3b5ffe;
            color: #fff;
            border-radius: 5px;
          }
        }

        &.active {
          span {
            background-color: #3b5ffe;
            color: #fff;
            font-weight: bold;
            border-radius: 5px;
          }
        }
      }
    }
  }

  &__child {
    position: absolute;
    background-color: #fff;
    width: 100px;
    z-index: 1000;
    bottom: 39px;
    border: 1px solid #3c8dbc;
    ul {
      li {
        list-style: none;
        color: #7e8ca6;
        padding: 4px 10px;
        cursor: pointer;
        border-bottom: 1px solid #ddd;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:hover {
          background-color: #3b5ffe;
          color: #fff;
        }

        &.active {
          background-color: #3b5ffe;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }

  &__left {
    display: flex;
    height: 100%;
    transition: all 0.2s;
    align-items: center;
    box-shadow: 2px 0 6px -2px rgba(0, 0, 0, 0.2);
  }

  &__right {
    display: flex;
    height: 100%;
    align-items: center;
    width: 30px;
    justify-content: flex-end;
    box-shadow: -2px 0 6px -2px rgba(0, 0, 0, 0.2);
    &--all {
      width: 80px;
    }
  }

  &__arrow {
    font-size: 20px;
    display: flex;
    height: 100%;
    align-items: center;
    cursor: default;
    i {
      color: #bbb;
    }

    &--visible {
      cursor: pointer;
      i {
        color: #213152;
      }

      &:hover {
        i {
          color: #3b5ffe;
        }
      }
    }
  }
}
</style>
