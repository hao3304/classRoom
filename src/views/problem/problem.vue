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
        <div
          slot="left"
          style="overflow-y: auto; overflow-x: hidden;padding: 10px 20px;height: 100%"
          v-html="problem"
        ></div>
        <Split slot="right" mode="vertical" v-model="vSplit">
          <f-panel slot="top" :header="false" style="height: 100%">
            <div slot="body" slot-scope="param">
              <f-editor
                ref="editor"
                :code="code"
                :height="param.bodyHeight"
              ></f-editor>
            </div>
          </f-panel>
          <f-panel slot="bottom" style="height: 100%">
            <div slot="header" class="p-problem__toolbar">
              <Button
                :loading="loading"
                size="small"
                @click="onBuild"
                icon="md-play"
                type="success"
                >编译</Button
              >
              <Button
                size="small"
                style="margin-left: 10px"
                @click="onSubmit"
                icon="md-checkmark"
                type="primary"
                >提交</Button
              >
            </div>
            <div slot="body" slot-scope="params" id="terminal"></div>
          </f-panel>
        </Split>
      </Split>
    </div>
  </div>
</template>

<script>
import service from "@/services/base";
import "jquery.terminal";
import "jquery.terminal/css/jquery.terminal.min.css";
export default {
  name: "problem",
  data() {
    return {
      ids: [],
      split: 0.4,
      vSplit: 0.7,
      problem: null,
      repoId: null,
      assignmentId: null,
      Terminal: null,
      socketOpen: false,
      isBind: false,
      stdout: [],
      type: 0,
      loading: false,
      code: ""
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
        this.problem = rep.data;
        this.$nextTick(() => {
          if (this.$refs.editor) {
            this.$refs.editor.resize();
          }
        });
      });
      this.renderTerminal();
      service
        .lastSubmit({ assignmentId: this.assignmentId, problemId: id })
        .then(rep => {
          this.$refs.editor.setContent(rep.data);
        });
    },
    renderTerminal() {
      let self = this;
      self.terminalShow = false;
      if (this.Terminal) {
        this.Terminal.clear();
      } else {
        this.Terminal = $("#terminal").terminal(
          function(command) {
            if (command !== "") {
              if (self.socketOpen) {
                self.socket.emit("send", command);
              }
            } else {
              this.echo("");
              if (self.isBind == false) {
                self.terminalShow = false;
                self.Terminal.clear();
              }
            }
          },
          {
            greetings: "你好，欢迎使用零一在线编程教室！",
            name: "js_demo",
            height: "200px",
            prompt: "> "
          }
        );
      }
    },
    onBuild() {
      const code = this.$refs.editor.getContent();
      if (code) {
        this.loading = true;
        this.socket.close();
        this.stdout = [];
        this.type = 0;
        if (this.Terminal) {
          this.Terminal.clear();
        }
        service
          .compile({ code: code })
          .then(({ data }) => {
            this.loading = false;
            this.onSocket(data);
            // if (data.errno == 0) {
            //   this.onSocket(data);
            // } else {
            //   // this.stdout = [data.errmsg];
            //   this.type = 1;
            // }
          })
          .catch(() => {
            this.loading = false;
            this.$Message.error("编译错误！");
          });
      }
    },
    onSocket(file) {
      this.socketOpen = true;
      this.socket.connect();
      if (!this.isBind) {
        this.socket.on(
          "data",
          function(data) {
            data = data.replace(/\n/g, "<br\>");
            this.Terminal.echo(
              `<p style="color:#C3E88D;font-size: 13px">${data}</p>`,
              { raw: true }
            );
            this.type = 0;
            this.tLoading = false;
          }.bind(this)
        );
        this.socket.on("close", data => {
          this.socket.close();
          this.socketOpen = false;
          this.isBind = false;
          this.socket.removeAllListeners();
          this.Terminal.echo(
            `<p style="color:red;font-size: 14px">程序已运行结束，按回车退出。</p>`,
            { raw: true }
          ).focus();
        });
      }

      this.isBind = true;

      this.socket.emit("build", file);
    },
    onSubmit() {
      this.$Modal.confirm({
        title: "提示",
        content: "确定要提交当前代码吗？",
        onOk: () => {
          service
            .submit({
              repoId: this.repoId + "",
              assignmentId: this.assignmentId,
              codes: [
                {
                  id: this.ids[0],
                  language: "CPP",
                  code: this.$refs.editor.getContent()
                }
              ]
            })
            .then(() => {
              this.$Message.success("提交成功！");
            });
        }
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.ids = vm.$route.query.id.split(",");
      vm.repoId = vm.$route.query.repoId;
      vm.assignmentId = vm.$route.query.assignmentId;
      if (vm.ids.length > 0) {
        vm.render(vm.ids[0]);
      }
    });
  },
  mounted() {
    if (this.ids.length > 0) {
      this.render(this.ids[0]);
    }
    this.socket = io("http://ide.joyoj.org");
    this.socket.close();

    // service.submitState({submitId: this.$route.query.id}).then(rep=> {
    //   debugger
    // })
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
    flex: 1;
  }

  &__toolbar {
    padding-top: 5px;
    padding-left: 10px;
  }

  #terminal {
    height: 100%;
  }
}
</style>
