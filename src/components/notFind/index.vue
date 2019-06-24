<template>
  <div class="c-notfont">
    <img src="~@/assets/images/none.png" alt="" />
    <p>{{ content || "空空如也" }}</p>
    <div>
      <slot name="button">
        <Button size="small" @click="onClick" type="primary">新增一个</Button>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["content"],
  name: "index",
  methods: {
    onClick() {
      this.$emit("click");
    }
  }
};
</script>

<style lang="less">
.c-notfont {
  position: absolute;
  width: 100px;
  left: 50%;
  margin-left: -50px;
  text-align: center;
  top: 35%;
  p {
    color: #ccc;
    text-align: center;
  }
  div {
    text-align: center;
    margin-top: 5px;
  }
  img {
    width: 60px;
  }
}
</style>
