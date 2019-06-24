<template>
  <div class="f-page">
    <!--<Pagination-->
    <!--:total="total"-->
    <!--displayMsg="显示 {from} 到 {to}，共 {total} 记录"-->
    <!--:pageSize="limit"-->
    <!--:pageNumber="page"-->
    <!--:layout="layout"-->
    <!--@pageChange="onPageChange"-->
    <!--&gt;-->
    <!--<template slot-scope="scope">-->
    <!--<div style="margin: 0 5px;">-->
    <!--第-->
    <!--<InputNumber-->
    <!--size="small"-->
    <!--:max="Math.round(total / limit)"-->
    <!--:min="1"-->
    <!--v-model="page"-->
    <!--style="width: 50px;text-align: center"-->
    <!--/>-->
    <!--页，共 {{ Math.round(total / limit) }} 页-->
    <!--</div>-->
    <!--</template>-->
    <!--</Pagination>-->
    <Pagination
      :total="total"
      :page-size="limit"
      :current.sync="page"
      show-elevator
      show-sizer
      show-total
      @on-change="onPageChange"
      @on-page-size-change="onSizeChange"
    ></Pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 20
    }
  },
  name: "FPage",
  watch: {
    limit() {
      this.page = 1;
    }
  },
  data() {
    return {
      layout: [
        "list",
        "sep",
        "first",
        "prev",
        "sep",
        "tpl",
        "sep",
        "next",
        "last",
        "info"
      ],
      page: 1,
      limit: this.size
    };
  },
  methods: {
    onPageChange(event) {
      // this.limit = event.pageSize;
      // this.page = event.pageNumber;
      // this.$emit("on-page-change", event);
      this.page = event;
      this.$emit("on-page-change", event);
    },
    onSizeChange(size) {
      this.limit = size;
      this.page = 1;
      this.$emit("on-size-change", size);
    },
    reset() {
      this.limit = this.size;
      this.page = 1;
    }
  }
};
</script>

<style lang="less">
.f-page {
  border-top: 1px solid #dcdee2;
  text-align: right;
  padding: 5px 10px;
}
</style>
