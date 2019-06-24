<template>
  <div class="f-bottom-tab">
    <div class="f-bottom-tab__button active">日分析</div>
    <div class="f-bottom-tab__button ">月分析</div>
  </div>
</template>

<script>
export default {
  name: "FButtomTab"
};
</script>

<style lang="less">
.f-bottom-tab {
  height: 36px;
  background-color: #f3f3f3;
  display: flex;
  align-items: center;
  border-top: 1px solid #d3d3d3;
  &__button {
    display: inline-block;
    padding: 0 10px;
    background-color: #f6f6f6;
    margin-left: 5px;
    line-height: 32px;
    height: 32px;
    margin-top: -4px;
    position: relative;
    border: 1px solid #d3d3d3;
    border-top: 0;
    font-size: 14px;
    color: #575765;
    cursor: pointer;
    &:hover {
      background-color: #e2e2e2;
    }
    &.active {
      font-weight: bold;
      cursor: default;
      background-color: #fff;
      &:before {
        content: " ";
        height: 3px;
        position: absolute;
        top: 0;
        right: -1px;
        left: -1px;
        background-color: #3c8dbc;
      }
    }
  }
}
</style>
