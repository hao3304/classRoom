<template>
  <div class="p-problem">
    <Tabs>
      <TabPane
        v-for="(_, index) in ids"
        :label="'题目' + (index + 1)"
        :key="index"
      >
        <div class="p-problem__content"></div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import service from "@/services/base";
export default {
  name: "home",
  data() {
    return {
      ids: []
    };
  },
  methods: {
    render(id) {
      service.problem({ problemId: id }).then(rep => {});
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.ids = vm.$route.query.id.split(",");
      if (vm.ids.length > 0) {
        vm.render(vm.ids[0]);
      }
    });
  }
};
</script>
<style lang="less">
.p-problem {
  height: 100%;
  background-color: #fff;
}
</style>
