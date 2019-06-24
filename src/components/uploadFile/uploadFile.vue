<template>
  <div class="upload-file">
    <Upload
      v-if="!file.src"
      :show-upload-list="false"
      :action="action"
      :on-success="handleSuccess"
      :headers="getHeaders()"
    >
      <Button icon="ios-cloud-upload-outline" size="small">上传</Button>
    </Upload>
    <a v-if="file.src" :href="file.src">{{ file.name }}</a>
    <Icon v-if="file.src" type="md-close" @click="onReset" />
  </div>
</template>

<script>
import { baseURL } from "@/services/axios";
import { mapState } from "vuex";
export default {
  props: ["value", "name"],
  name: "uploadFile",
  data() {
    return {
      action: baseURL + "/upload",
      file: {
        name: this.name || "",
        src: this.value
      }
    };
  },
  watch: {
    value() {
      if (!this.value) {
        this.file = {
          name: "",
          src: ""
        };
      } else {
        this.file = {
          name: "附件",
          src: baseURL + "/download/" + this.value
        };
      }
    }
  },
  computed: {
    ...mapState(["token"])
  },
  methods: {
    getHeaders() {
      return {
        "X-AUTH-TOKEN": this.token
      };
    },
    handleSuccess(res, file) {
      if (res.code == 0) {
        this.$emit("input", res.response.id);
        this.file.src = baseURL + "/download/" + res.response.id;
        this.file.name = file.name;
      } else {
        this.$Message.warning(res.message);
      }
    },
    onReset() {
      this.file.name = "";
      this.file.src = "";
      this.$emit("input", "");
    }
  }
};
</script>

<style lang="less">
.upload-file {
  .ivu-icon-md-close {
    margin-left: 4px;
  }
  .ivu-icon-md-close:hover {
    border-radius: 2px;
    background-color: #ff5722;
    color: #fff;
    cursor: pointer;
  }
}
</style>
