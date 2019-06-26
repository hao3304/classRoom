<template>
  <div class="p-problem">
    <Tabs>
      <TabPane
        v-for="(_, index) in ids"
        :label="'题目' + (index + 1)"
        :key="index"
      >
        <div></div>
      </TabPane>
    </Tabs>
    <div class="p-problem__content">
      <Split v-model="split" min="500px" max="600px">
        <div slot="left" >
          <div style="overflow: hidden;padding: 10px 20px;" v-html="problem"></div>
        </div>
        <div slot="right" style="height: 100%">
            <f-editor ref="editor"></f-editor>
        </div>
      </Split>
    </div>

  </div>
</template>

<script>
import service from "@/services/base";
import marked from 'marked'
export default {
  name: "home",
  data() {
    return {
      ids: [],
      split: 0.5,
      problem: null
    };
  },
  watch: {
    split() {
      this.$refs.editor.resize();
    }
  },
  methods: {
    render(id) {
      service.problem({ problemId: id }).then(rep => {
        this.problem = rep.data
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.ids = vm.$route.query.id.split(",");
      if (vm.ids.length > 0) {
        vm.render(vm.ids[0]);
      }
    });
  },
  mounted() {
    if(this.ids.length > 0) {
      this.render(this.ids[0])
    }
  }
};
</script>
<style lang="less">
.p-problem {
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .ivu-tabs-bar {
    margin-bottom: 0;
  }
  &__content {
    flex:1;

  }
}
</style>
