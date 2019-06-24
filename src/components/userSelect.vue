<template>
  <div class="user-select" v-clickoutside="onClick">
    <div class="ivu-select ivu-select-single" @click="onShow">
      <div class="ivu-select-selection">
        <input ref="input" type="hidden" v-model="currentValue" />
        <span class="ivu-select-selected-value" v-if="textValue">
          {{ textValue }}
        </span>
        <span class="ivu-select-placeholder" v-else>{{
          placeholder || ""
        }}</span>
        <i
          class="ivu-icon ivu-icon-ios-close ivu-select-arrow"
          style="display: none;"
        ></i>
        <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow"></i>
      </div>
    </div>
    <div class="table-content" v-show="show">
      <header style="height: 1px"></header>
      <div class="body">
        <div class="table-content__search">
          <div class="table-content__input">
            <x-filter
              :toolbar="false"
              :width="260"
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
          :height="280"
          :loading="$apollo.queries.users.loading"
          @on-row-dblclick="onDbClick"
          size="small"
          border
          :columns="columns"
          :data="users.data"
        ></Table>
        <div style="text-align: center">
          <page
            :total="users.total"
            :current="query.page"
            size="small"
            :page-size="query.size"
            @on-page-size-change="onPageSizeChange"
            @on-change="onPageChange"
            show-elevator
            show-total
          ></page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clickoutside from "iview/src/directives/clickoutside";
import Emitter from "./emitter";
import xFilter from "./FFilter";
import { GetUsers } from "@/graphqls/user.graphql";
import types from "@/types";
const { userModel } = types;
const Query = () => {
  return {
    limit: 20,
    page: 1,
    count: true,
    orders: ["id"],
    sn: null,
    name: null,
    where: null,
    roles: null,
    uids: null
  };
};

export default {
  directives: { clickoutside },
  props: [
    "value",
    "table",
    "placeholder",
    "text",
    "textField",
    "condition",
    "roles"
  ],
  mixins: [Emitter],
  components: {
    xFilter
  },
  data() {
    return {
      show: false,
      loading: false,
      query: Query(),
      textValue: this.text,
      total: 0,
      currentValue: this.value,
      columns: [
        {
          title: userModel.name,
          key: "name"
        },
        {
          title: userModel.account,
          key: "account"
        },
        {
          title: userModel.job,
          key: "job"
        },
        {
          title: userModel.mobile,
          key: "mobile"
        }
      ],
      filter: [
        {
          type: "input",
          placeholder: "请输入用户名称模糊查询",
          field: "name",
          name: "名称"
        }
      ],
      users: {
        data: [],
        total: 0
      }
    };
  },
  computed: {
    holder() {
      return this.columns.map(c => c.title).join(",");
    }
  },
  apollo: {
    users: {
      query: GetUsers,
      variables() {
        this.query.roles = this.roles.map(r => r.id);
        return this.query;
      },
      skip() {
        return !this.show;
      }
    }
  },
  methods: {
    render() {
      this.loading = true;

      if (this.condition) {
        this.query.condition = this.condition;
      }

      // service[this.table].findAll(this.query).then(rep => {
      //   this.data = rep.data;
      //   this.total = rep.total;
      //   this.loading = false;
      // });
    },
    onClick(e) {
      this.show = false;
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
.user-select {
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
