<template>
  <div class="f-tab">
    <div class="f-tab__header">
      <Breadcrumb>
        <BreadcrumbItem v-for="b in breadcrumb" :key="b">{{
          b
        }}</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="f-tab__body">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { routes } from "@/router";
export default {
  name: "FTab",
  computed: {
    ...mapState(["windowHeight"]),
    ...mapState("app", ["breadcrumb"])
  },
  methods: {}
};
</script>

<style lang="less">
.f-tab {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &__header {
    height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #e5e5e5;
    line-height: 50px;
    padding: 0 20px;
  }
  &__body {
    flex: 1;
  }
}
</style>
