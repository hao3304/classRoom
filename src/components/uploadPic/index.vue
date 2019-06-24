<template>
  <div>
    <div v-if="type == 1">
      <div
        class="demo-upload-list"
        v-for="(item, index) in uploadList"
        :key="index"
      >
        <template v-if="item.status === 'finished'">
          <img :src="item.url" />
          <div class="demo-upload-list-cover">
            <Icon
              type="ios-eye-outline"
              @click.native="handleView(item.name)"
            ></Icon>
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemove(item)"
            ></Icon>
          </div>
        </template>
        <template v-else>
          <Progress
            v-if="item.showProgress"
            :percent="item.percentage"
            hide-info
          ></Progress>
        </template>
      </div>
      <Upload
        v-if="uploadList.length == 0"
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['jpg', 'jpeg', 'png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        type="drag"
        :headers="getHeaders()"
        :action="action"
        style="display: inline-block;width:58px;"
      >
        <div style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
      </Upload>
    </div>
    <div v-if="type == 2">
      <div
        class="demo-upload-list"
        style="width: 100%;height: 124px;"
        v-for="(item, index) in uploadList"
        :key="index"
      >
        <template v-if="item.status === 'finished'">
          <img :src="item.url" />
          <div class="demo-upload-list-cover">
            <Icon
              type="ios-eye-outline"
              @click.native="handleView(item.name)"
            ></Icon>
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemove(item)"
            ></Icon>
          </div>
        </template>
        <template v-else>
          <Progress
            v-if="item.showProgress"
            :percent="item.percentage"
            hide-info
          ></Progress>
        </template>
      </div>
      <Upload
        v-if="uploadList.length == 0"
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['jpg', 'jpeg', 'png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        type="drag"
        :headers="getHeaders()"
        :action="action"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>点击或者拖拽上传图片</p>
        </div>
      </Upload>
    </div>

    <Modal title="预览" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%" />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { baseURL } from "@/services/axios";
import { mapState } from "vuex";
export default {
  name: "upload-pic",
  props: {
    value: {
      default: "",
      type: String
    },
    type: {
      default: 1,
      type: Number
    }
  },
  computed: {
    ...mapState(["token"])
  },
  watch: {
    value() {
      if (this.value) {
        this.uploadList = [
          {
            status: "finished",
            name: this.value,
            url: this.getImage(this.value)
          }
        ];
      } else {
        this.uploadList = [];
      }
    }
  },
  data() {
    return {
      action: baseURL + "/upload",
      defaultList: [],
      imgName: "",
      visible: false,
      uploadList: []
    };
  },
  methods: {
    getHeaders() {
      return {
        "X-AUTH-TOKEN": this.token
      };
    },
    getImage(id) {
      return baseURL + `/image/${id}/600/600`;
    },
    handleView(name) {
      this.imgName = this.getImage(name);
      this.visible = true;
    },
    handleRemove() {
      this.uploadList = [];
      this.defaultList = [];
      this.$emit("input", "");
    },
    handleSuccess(res, file) {
      if (res.code == 0) {
        this.$emit("input", res.response.id);
        this.uploadList = [
          {
            status: "finished",
            name: file.name,
            url: this.getImage(res.response.id)
          }
        ];
      } else {
        this.$Message.warning(res.message);
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "Up to five pictures can be uploaded."
        });
      }
      return check;
    }
  },
  mounted() {
    if (this.value) {
      this.uploadList = [
        {
          status: "finished",
          name: this.value,
          url: this.getImage(this.value)
        }
      ];
    }
  }
};
</script>

<style scoped>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
