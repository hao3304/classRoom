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
          class="p-problem__desc"
          style="overflow-y: auto; overflow-x: hidden;padding: 0 15px;height: 100%"
        >
          <h3>{{problem.title}}</h3>
          <Divider orientation="left">描述</Divider>
          <div class="desc" v-html="problem.description"></div>
          <Divider orientation="left">输入</Divider>
          <div class="desc" v-html="problem.inputDescription"></div>
          <Divider orientation="left">输出</Divider>
          <div class="desc" v-html="problem.outputDescription"></div>
        </div>
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

              <div class="result" v-show="result">
                判题结果：<Tag :color="result == 'Fail' ? 'error' : 'success'"
                  >{{ result }} <span v-if="log">: {{ log }}</span></Tag
                >
              </div>
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
      problem: {},
      repoId: null,
      assignmentId: null,
      Terminal: null,
      socketOpen: false,
      isBind: false,
      stdout: [],
      type: 0,
      loading: false,
      code: "",
      result: "",
      log: ""
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
                  language: "C++",
                  code: this.$refs.editor.getContent()
                }
              ]
            })
            .then(rep => {
              this.getSubmitState(rep.submitId);
              this.Message.success("提交成功,请等待判题结果。");
            });r
        }
      });
    },
    getSubmitState(submitId) {
      service.submitState({ submitId }).then(rep => {
        if (rep && rep.data && rep.data.judgeProgress) {
          this.result = rep.data.judgeProgress[0].state;
          this.log = rep.data.judgeProgress[0].log;
          if (this.result == "Judging") {
            setTimeout(() => {
              this.getSubmitState(submitId);
            }, 2000);
          }
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
    height: 30px;
    display: flex;
    align-items: center;
    .result {
      display: flex;
      align-items: center;
      margin-left: 20px;
    }
  }

  &__desc {
    h1, h2, h3, h4 {
      color: #111111;
      font-weight: 400;
      margin-top: 1em;
    }

    h1, h2, h3, h4, h5 {
      font-family: Georgia, Palatino, serif;
    }
    h1, h2, h3, h4, h5, p , dl{
      margin-bottom: 16px;
      padding: 0;
    }
    h1 {
      font-size: 48px;
      line-height: 54px;
    }
    h2 {
      font-size: 36px;
      line-height: 42px;
    }
    h1, h2 {
      border-bottom: 1px solid #EFEAEA;
      padding-bottom: 10px;
    }
    h3 {
      font-size: 24px;
      line-height: 30px;
    }
    h4 {
      font-size: 21px;
      line-height: 26px;
    }
    h5 {
      font-size: 18px;
      list-style: 23px;
    }
    a {
      color: #0099ff;
      margin: 0;
      padding: 0;
      vertical-align: baseline;
    }
    a:hover {
      text-decoration: none;
      color: #ff6600;
    }
    a:visited {
      /*color: purple;*/
    }
    ul, ol {
      padding: 0;
      padding-left: 24px;
      margin: 0;
    }
    li {
      line-height: 24px;
    }
    p, ul, ol {
      font-size: 16px;
      line-height: 24px;
    }

    ol ol, ul ol {
      list-style-type: lower-roman;
    }

    /*pre {
        padding: 0px 24px;
        max-width: 800px;
        white-space: pre-wrap;
    }
    code {
        font-family: Consolas, Monaco, Andale Mono, monospace;
        line-height: 1.5;
        font-size: 13px;
    }*/

    code, pre {
      border-radius: 3px;
      background-color:#f7f7f7;
      color: inherit;
    }

    code {
      font-family: Consolas, Monaco, Andale Mono, monospace;
      margin: 0 2px;
    }

    pre {
      line-height: 1.7em;
      overflow: auto;
      padding: 6px 10px;
      border-left: 5px solid #6CE26C;
    }

    pre > code {
      border: 0;
      display: inline;
      max-width: initial;
      padding: 0;
      margin: 0;
      overflow: initial;
      line-height: inherit;
      font-size: .85em;
      white-space: pre;
      background: 0 0;

    }

    code {
      color: #666555;
    }


    /** markdown preview plus 对于代码块的处理有些问题, 所以使用统一的颜色 */
    /*code .keyword {
      color: #8959a8;
    }

    code .number {
      color: #f5871f;
    }

    code .comment {
      color: #998
    }*/

    aside {
      display: block;
      float: right;
      width: 390px;
    }
    blockquote {
      border-left:.5em solid #eee;
      padding: 0 0 0 2em;
      margin-left:0;
    }
    blockquote  cite {
      font-size:14px;
      line-height:20px;
      color:#bfbfbf;
    }
    blockquote cite:before {
      content: '\2014 \00A0';
    }

    blockquote p {
      color: #666;
    }
    hr {
      text-align: left;
      color: #999;
      height: 2px;
      padding: 0;
      margin: 16px 0;
      background-color: #e7e7e7;
      border: 0 none;
    }

    dl {
      padding: 0;
    }

    dl dt {
      padding: 10px 0;
      margin-top: 16px;
      font-size: 1em;
      font-style: italic;
      font-weight: bold;
    }

    dl dd {
      padding: 0 16px;
      margin-bottom: 16px;
    }

    dd {
      margin-left: 0;
    }

    /* Code below this line is copyright Twitter Inc. */

    button,
    input,
    select,
    textarea {
      font-size: 100%;
      margin: 0;
      vertical-align: baseline;
      *vertical-align: middle;
    }
    button, input {
      line-height: normal;
      *overflow: visible;
    }
    button::-moz-focus-inner, input::-moz-focus-inner {
      border: 0;
      padding: 0;
    }
    button,
    input[type="button"],
    input[type="reset"],
    input[type="submit"] {
      cursor: pointer;
      -webkit-appearance: button;
    }
    input[type=checkbox], input[type=radio] {
      cursor: pointer;
    }
    /* override default chrome & firefox settings */
    input:not([type="image"]), textarea {
      -webkit-box-sizing: content-box;
      -moz-box-sizing: content-box;
      box-sizing: content-box;
    }

    input[type="search"] {
      -webkit-appearance: textfield;
      -webkit-box-sizing: content-box;
      -moz-box-sizing: content-box;
      box-sizing: content-box;
    }
    input[type="search"]::-webkit-search-decoration {
      -webkit-appearance: none;
    }
    label,
    input,
    select,
    textarea {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 13px;
      font-weight: normal;
      line-height: normal;
      margin-bottom: 18px;
    }
    input[type=checkbox], input[type=radio] {
      cursor: pointer;
      margin-bottom: 0;
    }
    input[type=text],
    input[type=password],
    textarea,
    select {
      display: inline-block;
      width: 210px;
      padding: 4px;
      font-size: 13px;
      font-weight: normal;
      line-height: 18px;
      height: 18px;
      color: #808080;
      border: 1px solid #ccc;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
    }
    select, input[type=file] {
      height: 27px;
      line-height: 27px;
    }
    textarea {
      height: auto;
    }
    /* grey out placeholders */
    :-moz-placeholder {
      color: #bfbfbf;
    }
    ::-webkit-input-placeholder {
      color: #bfbfbf;
    }
    table {
      border: solid #ccc 1px;
      -moz-border-radius: 6px;
      -webkit-border-radius: 6px;
      border-radius: 6px;
      /*-webkit-box-shadow: 0 1px 1px #ccc;
      -moz-box-shadow: 0 1px 1px #ccc;
      box-shadow: 0 1px 1px #ccc;   */
    }
    table tr:hover {
      background: #fbf8e9;
      -o-transition: all 0.1s ease-in-out;
      -webkit-transition: all 0.1s ease-in-out;
      -moz-transition: all 0.1s ease-in-out;
      -ms-transition: all 0.1s ease-in-out;
      transition: all 0.1s ease-in-out;
    }
    table td, .table th {
      border-left: 1px solid #ccc;
      border-top: 1px solid #ccc;
      padding: 10px;
      text-align: left;
    }

    table th {
      background-color: #dce9f9;
      background-image: -webkit-gradient(linear, left top, left bottom, from(#ebf3fc), to(#dce9f9));
      background-image: -webkit-linear-gradient(top, #ebf3fc, #dce9f9);
      background-image:    -moz-linear-gradient(top, #ebf3fc, #dce9f9);
      background-image:     -ms-linear-gradient(top, #ebf3fc, #dce9f9);
      background-image:      -o-linear-gradient(top, #ebf3fc, #dce9f9);
      background-image:         linear-gradient(top, #ebf3fc, #dce9f9);
      /*-webkit-box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;
      -moz-box-shadow:0 1px 0 rgba(255,255,255,.8) inset;
      box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;*/
      border-top: none;
      text-shadow: 0 1px 0 rgba(255,255,255,.5);
      padding: 5px;
    }

    table td:first-child, table th:first-child {
      border-left: none;
    }

    table th:first-child {
      -moz-border-radius: 6px 0 0 0;
      -webkit-border-radius: 6px 0 0 0;
      border-radius: 6px 0 0 0;
    }
    table th:last-child {
      -moz-border-radius: 0 6px 0 0;
      -webkit-border-radius: 0 6px 0 0;
      border-radius: 0 6px 0 0;
    }
    table th:only-child{
      -moz-border-radius: 6px 6px 0 0;
      -webkit-border-radius: 6px 6px 0 0;
      border-radius: 6px 6px 0 0;
    }
    table tr:last-child td:first-child {
      -moz-border-radius: 0 0 0 6px;
      -webkit-border-radius: 0 0 0 6px;
      border-radius: 0 0 0 6px;
    }
    table tr:last-child td:last-child {
      -moz-border-radius: 0 0 6px 0;
      -webkit-border-radius: 0 0 6px 0;
      border-radius: 0 0 6px 0;
    }
  }

  #terminal {
    height: 100%;
  }
}
</style>
