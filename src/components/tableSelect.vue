<template>
  <div class="table-select" v-clickoutside="onClick">
    <div class="ivu-select ivu-select-single" @click="onShow">
      <div class="ivu-select-selection">
        <input ref="input" type="hidden" v-model="currentValue" />
        <span class="ivu-select-selected-value" v-if="textValue">
          {{ textValue }}
        </span>
        <span class="ivu-select-placeholder" v-else>{{
          placeholder || ""
        }}</span>
        <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow"></i>
      </div>
    </div>
    <div class="table-content" v-show="show">
      <header>查询过滤</header>
      <div
        class="body"
        :style="{ height: filter.length > 0 ? '400px' : '360px' }"
      >
        <div class="table-content__search" v-if="filter.length > 0">
          <div class="table-content__input">
            <x-filter
              :toolbar="false"
              :width="240"
              ref="xFilter"
              :list="filter"
              @on-filter="onFilter"
              mode="simple"
            ></x-filter>
          </div>
          <div class="table-content__action">
            <Button type="primary" @click="onClear">清空</Button>
          </div>
        </div>
        <Table
          :height="300"
          :loading="loading"
          @on-row-dblclick="onDbClick"
          size="small"
          border
          :columns="columns"
          :data="data"
        ></Table>
        <div style="text-align: center">
          <Page
            :total="total"
            :current="query.page"
            size="small"
            :page-size="query.size"
            @on-page-size-change="onPageSizeChange"
            @on-change="onPageChange"
            show-elevator
            show-total
          ></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clickoutside from "iview/src/directives/clickoutside";
import service from "@/services";
import Emitter from "./emitter";
import xFilter from "./FFilter";
export default {
  directives: { clickoutside },
  props: [
    "columns",
    "value",
    "table",
    "placeholder",
    "text",
    "textField",
    "condition",
    "filter"
  ],
  mixins: [Emitter],
  components: {
    xFilter
  },
  data() {
    return {
      show: false,
      data: [],
      loading: false,
      query: {
        page: 1,
        size: 20,
        count: 1,
        fields: ["*"],
        orders: ["-changed"],
        filters: []
      },
      textValue: this.text,
      total: 0,
      currentValue: this.value + ""
    };
  },
  computed: {
    holder() {
      return this.columns.map(c => c.title).join(",");
    }
  },
  methods: {
    render() {
      this.loading = true;
      if (this.condition) {
        this.query.filters = this.condition;
      }

      service[this.table].findAll(this.query).then(rep => {
        this.data = rep.data;
        this.total = rep.total;
        this.loading = false;
      });
    },
    onClick() {
      this.show = false;
      if (this.filter.length > 0) {
        this.$refs.xFilter && this.$refs.xFilter.reset();
      }
    },
    onPageChange(page) {
      this.query.page = page;
      this.render();
    },
    onPageSizeChange(size) {
      this.query.size = size;
      this.render();
    },
    onDbClick(row) {
      if (this.currentValue == row.id) {
        return (this.show = false);
      }
      this.$emit("input", row.id);
      this.textValue = this.textField ? row[this.textField] : row.name;
      this.currentValue = row.id;
      this.$emit("change", row);
      this.show = false;
    },
    onSearch() {
      this.render();
    },
    onReset() {
      this.query.keywords = "";
      this.render();
    },
    onShow() {
      this.show = true;
    },
    onFilter(filterList) {
      this.query.filters = filterList.map(item => {
        return {
          op: "like",
          field: item.field,
          args: [`%${item.value}%`]
        };
      });
      this.render();
    },
    onClear() {
      this.textValue = "";
      this.$emit("input", "");
      this.show = false;
    }
  },
  watch: {
    show() {
      if (this.show) {
        this.render();
        this.$refs.input.focus();
        this.dispatch("FormItem", "on-form-change", this.currentValue);
      }
    },
    currentValue(value) {
      this.$emit("input", value);
      this.$refs.input.focus();
      this.dispatch("FormItem", "on-form-change", this.currentValue);
    },
    value(v) {
      if (this.currentValue == v) {
        return;
      }
      if (v == "" || v == null || v == undefined) {
        this.textValue = "";
      }
      this.currentValue = v;
      this.$refs.input.focus();
      this.dispatch("FormItem", "on-form-change", this.currentValue);
    },
    text(t) {
      this.textValue = t;
    }
  },
  mounted() {}
};
</script>

<style lang="less">
.table-select {
  position: relative;
  .table-content {
    header {
      background-color: #717971;
      color: #fff;
      padding: 0 10px;
    }
    position: absolute;
    background-color: #fff;
    border: 1px solid #666;
    z-index: 1000;
    left: 0;
    width: 100%;
    .ivu-table-small td {
      height: 30px;
    }
    .body {
      height: 400px;
      overflow-y: auto;
      padding: 10px 10px 0 10px;
    }

    &__search {
      display: flex;
      margin-bottom: 10px;
      &__input {
        flex: 1;
      }
    }

    &__action {
      width: 100px;
      text-align: right;
    }
  }
}
</style>
