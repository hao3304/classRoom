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
          <div  slot="left" style="overflow-y: auto; overflow-x: hidden;padding: 10px 20px;height: 100%" v-html="problem"></div>
        <Split slot="right" mode="vertical" v-model="vSplit">
          <f-panel slot="top" :header="false"  style="height: 100%">
            <div slot="body" slot-scope="param">
              <f-editor ref="editor" :height="param.bodyHeight"></f-editor>
            </div>
          </f-panel>
          <f-panel slot="bottom" style="height: 100%">
            <div slot="header" class="p-problem__toolbar">
              <Button size="small" @click="onSubmit" icon="md-checkmark" type="primary">提交</Button>
            </div>
            <div slot="body"></div>
          </f-panel>
        </Split>
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
        split: 0.4,
        vSplit: 0.7,
        problem: null,
        repoId: null
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
      },
      onSubmit() {
        this.$Modal.confirm({
          title: '提示',
          content: '确定要提交当前代码吗？',
          onOk: ()=> {
            service.submit({
              repoId: this.repoId,
              codes: [
                {
                  id: this.ids[0],
                  language: 'C',
                  code: this.$refs.editor.getContent()
                }
              ]
            }).then(rep=> {
              debugger
            })

          }
        })
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.ids = vm.$route.query.id.split(",");
        vm.repoId = vm.$route.query.repoId;
        if (vm.ids.length > 0) {
          vm.render(vm.ids[0]);
        }
      });
    },
    mounted() {
      if(this.ids.length > 0) {
        this.render(this.ids[0])
      }
      service.submitState({submitId: this.$route.query.id}).then(rep=> {
        debugger
      })
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

    &__toolbar {
      padding-top: 5px;
      padding-left: 10px;
    }


  }
</style>
