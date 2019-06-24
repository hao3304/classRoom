<template>
  <Tooltip
    :transfer="true"
    v-if="tooltip"
    :content="tooltip"
    :placement="placement"
  >
    <i
      @click="onClick"
      class="icon-button"
      :class="getClass()"
      style="cursor: pointer"
    ></i>
  </Tooltip>
  <i
    @click="onClick"
    v-else
    class="icon-button"
    :class="getClass()"
    style="cursor: pointer"
  ></i>
</template>

<script>
export default {
  props: ["icon", "tooltip", "type", "placement"],
  name: "iconButton",
  methods: {
    onClick() {
      this.$emit("click");
    },
    getClass() {
      return this.type ? `text-${this.type} ${this.icon}` : `${this.icon}`;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~iview/src/styles/index.less";

.icon-button {
  &.text-primary {
    color: @primary-color;
  }
  &.text-error {
    color: @error-color;
  }

  &.text-info {
    color: @info-color;
  }
  &.text-success {
    color: @success-color;
  }
}
</style>
