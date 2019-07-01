<template>
  <div class="f-editor" :style="{ height: height + 'px' }" ref="editor"></div>
</template>

<script>
import * as monaco from "monaco-editor";
export default {
  props: ["code", "height"],
  name: "editor",
  data() {
    return {
      val: this.code
    };
  },
  watch: {
    height() {
      this.resize();
    }
  },
  methods: {
    render() {
      this.$editor = monaco.editor.create(this.$refs.editor, {
        value: this.val,
        language: "cpp",
        theme: "vs-dark",
        contextmenu: false
      });

      this.$editor.onDidChangeModelContent(event => {
        const code = this.$editor.getValue();
        this.$emit("input", code);
      });
    },
    resize() {
      if (this.$editor) {
        this.$editor.layout();
      }
    },
    getContent() {
      return this.$editor.getModel().getValue();
    }
  },
  mounted() {
    setTimeout(() => {
      this.render();
    }, 200);
    window.onresize = () => {
      this.$editor.layout();
    };
  }
};
</script>

<style scoped lang="less">
.f-editor {
  height: 100%;
}
</style>
