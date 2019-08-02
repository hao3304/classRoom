<template>
  <div :class="b()">
    <Spin fix v-show="loading"></Spin>
    <Split v-model="split">
      <div slot="left" style="background-color: #fff">
        <div id="course-tree" class="ztree"></div>
      </div>
      <div slot="right" style="height: 100%;overflow: auto">
        <notfind content="请在左边栏目选择课程" v-if="!course">
          <div slot="button"></div>
        </notfind>
        <div v-if="course" :class="b('content')">
          <div class="markdown-preview Light" v-html="course.content"></div>
          <meditor v-show="false"></meditor>
        </div>
      </div>
    </Split>
  </div>
</template>

<script>
import base from "@/mixins/base";
import axios from "axios";
import marked from "marked";
import meditor from "vue-meditor";
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, lang, callback) {
    require("pygmentize-bundled")(
      { lang: lang, format: "html" },
      code,
      function(err, result) {
        callback(err, result.toString());
      }
    );
  },
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

const fileIcon = require("@/assets/images/file.png");
const courseIcon = require("@/assets/images/course.png");
const PATH =
  process.env.NODE_ENV == "development"
    ? "http://localhost:8360"
    : "http://us03.01class.cn";
export default {
  name: "p-course",
  components: { meditor },
  mixins: [base],
  data() {
    return {
      loading: false,
      category: [],
      dialog: false,
      treeData: [],
      split: "200px",
      course: null
    };
  },
  methods: {
    renderTree() {
      const treeData = [];
      this.loading = true;
      axios.get(PATH + "/user/category").then(({ data }) => {
        const setting = {
          data: {
            simpleData: {
              enable: true,
              pIdKey: "pid"
            }
          },
          view: {
            showIcon: true
          },
          callback: {
            onClick: (e, type, node) => {
              if (node.type == "course") {
                this.getCourse(node.id);
              } else {
                this.$treeObj.cancelSelectedNode(node);
              }
            }
          }
        };

        this.treeData = treeData.concat(
          data.data.map(item => {
            item.open = true;
            item.icon = item.type == "category" ? fileIcon : courseIcon;
            return item;
          })
        );
        this.$treeObj = $.fn.zTree.init(
          $("#course-tree"),
          setting,
          this.treeData
        );
        this.loading = false;
      });
    },
    getCourse(id) {
      this.loading = true;
      axios.get(PATH + "/user/course", { params: { id } }).then(({ data }) => {
        this.course = data.data;
        this.course.content = marked(this.course.content);
        this.loading = false;
      });
    }
  },
  mounted() {
    this.renderTree();
  }
};
</script>
<style lang="less">
.p-course {
  height: 100%;
  position: relative;
  #course-tree {
    height: 100%;
  }
  .left-pane,
  .right-pane {
    background-color: #fff;
  }
  &__content {
    padding-left: 40px;
    overflow: hidden;
    background-color: #fff;
  }
  .markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
  }
}
</style>
