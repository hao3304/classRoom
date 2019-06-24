<template>
  <div class="wrapper">
    <f-panel>
      <div slot="header" style="padding-left: 10px">
        <x-filter
          ref="xFilter"
          :mode="mode"
          :list="filter"
          :width="160"
          @on-filter="onFilter"
        >
          <Tooltip
            content="新增"
            placement="bottom"
            style="margin-left: 20px;"
            slot="buttons"
          >
            <Button
              type="primary"
              icon="md-add"
              @click="onAdd"
              style="padding: 5px 8px;margin-right: 10px"
            >
              {{ title }}
            </Button>
          </Tooltip>

          <Button
            type="error"
            @click="onDeleteSelected"
            v-if="multiDel"
            :disabled="selection.length == 0"
            style="margin-right: 10px"
            icon="md-remove"
            slot="buttons"
          ></Button>
          <!--<Button  @click="onAdd"  style="margin-right: 10px"  slot="buttons">删除</Button>-->
          <slot name="buttons" slot="buttons"></slot>
          <Tooltip
            content="导出"
            placement="bottom"
            slot="right-block"
            style="margin-right: 10px;"
          >
            <Button
              @click="onExport"
              icon="md-download"
              style="padding: 5px 8px;"
            ></Button>
          </Tooltip>
          <Tooltip
            content="列设置"
            placement="bottom"
            slot="right-block"
            style="margin-right: 10px;"
          >
            <Button
              @click="onShowColumn"
              icon="md-settings"
              style="padding: 5px 8px;"
            ></Button>
          </Tooltip>
          <Tooltip
            content="刷新"
            placement="bottom"
            slot="right-block"
            style="margin-right: 5px;"
          >
            <Button
              @click="onRefresh"
              icon="md-refresh"
              style="padding: 5px 8px;"
            ></Button>
          </Tooltip>

          <slot slot="right-block" name="right-block"></slot>
        </x-filter>
      </div>
      <div slot="body" slot-scope="props">
        <Table
          size="small"
          ref="xTable"
          @on-row-dblclick="onEdit"
          @on-selection-change="onSelectChange"
          :highlight-row="true"
          @on-sort-change="onSortChange"
          @on-row-click="onRowClick"
          :height="props.bodyHeight"
          class="f-table"
          :loading="loading"
          border
          stripe
          :columns="mColumns"
          :data="data"
        ></Table>
      </div>
      <slot slot="footer">
        <f-page
          :total="total"
          @on-page-change="onPage"
          @on-size-change="onSizeChange"
        ></f-page>
      </slot>
    </f-panel>

    <Drawer
      v-model="dialog"
      :title="modalTitle"
      :width="600"
      class="f-drawer"
      :mask-closable="false"
      :draggable="true"
    >
      <div
        class="f-drawer__body"
        :style="{ height: windowHeight - 105 + 'px' }"
        style="overflow-y: auto;padding: 16px"
      >
        <i-form ref="form" :label-width="75" :rules="rules" :model="form">
          <slot name="dialog" :model="form"> </slot>
        </i-form>
      </div>
      <div class="f-drawer__footer">
        <Button @click="onCancel">取消</Button>
        <Button @click="onOk" :loading="formLoading" type="primary"
          >确定</Button
        >
      </div>
    </Drawer>

    <!--<Modal-->
    <!--v-model="dialog"-->
    <!--:title="modalTitle"-->
    <!--fullscreen-->
    <!--&gt;-->
    <!--<i-form ref="form" :label-width="75" :rules="rules" :model="form">-->
    <!--<slot name="dialog" :model="form">-->
    <!--</slot>-->
    <!--</i-form>-->
    <!--<div slot="footer">-->
    <!--<Button @click="onCancel">取消</Button>-->
    <!--<Button @click="onOk" :loading="formLoading" type="primary">确定</Button>-->
    <!--</div>-->
    <!--</Modal>-->

    <x-column
      :name="service"
      @on-select="onSelectColumns"
      :visible.sync="showColumn"
      :columns="columns"
    ></x-column>
  </div>
</template>
<script>
import Service from "@/services";
import xFilter from "./FFilter";
import xColumn from "./xColumn";
import { mapActions } from "vuex";
import batchService from "@/services/batch";
import base from "@/mixins/base";
export default {
  props: {
    title: {
      type: String,
      default: "-"
    },
    columns: {
      type: Array,
      default: () => []
    },
    service: String,
    model: {
      type: Function,
      default: () => {}
    },
    rules: Object,
    filter: {
      type: Array,
      default: () => []
    },
    mode: String,
    height: {
      type: Number,
      default: 400
    },
    page: {
      type: Boolean,
      default: true
    },
    loads: {
      type: Boolean,
      default: false
    },
    orders: {
      type: Array,
      default: () => []
    },
    multiDel: {
      type: Boolean,
      default: false
    }
  },
  components: {
    xFilter,
    xColumn
  },
  mixins: [base],
  computed: {
    mColumns() {
      if (
        this.localColumns.length > 0 &&
        this.localColumns[0].key === "index"
      ) {
        let columns = this.localColumns;
        columns[0]["render"] = (h, { index }) => {
          return h("div", (this.query.page - 1) * this.query.size + index + 1);
        };
        return columns;
      } else {
        return this.localColumns;
      }
    },
    modalTitle() {
      if (this.action == "add") {
        return "新增" + this.title;
      } else {
        return "编辑" + this.title;
      }
    }
  },
  data() {
    return {
      query: {
        page: 1,
        size: 20,
        count: 1,
        fields: ["*"],
        orders: this.orders.length > 0 ? this.orders : ["weight", "-changed"],
        filters: []
      },
      dialog: false,
      formLoading: false,
      data: [],
      total: 0,
      loading: false,
      form: this.model(),
      showColumn: false,
      localColumns: [],
      action: null,
      updateId: null,
      selection: []
    };
  },
  methods: {
    ...mapActions("common", ["init"]),
    onAdd() {
      this.$refs.form.resetFields();
      this.form = this.model();
      this.dialog = true;
      this.action = "add";
      this.$emit("on-add");
    },
    onOk() {
      this.$emit("on-dialog-ok");
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.action == "update") {
            this.update();
          } else {
            this.save();
          }
        } else {
          this.$Message.warning("请填写完整！");
        }
      });
    },
    save() {
      this.formLoading = true;
      Service[this.service]
        .add(this.form)
        .then(rep => {
          console.log(rep);
          this.dialog = false;
          this.$Message.success("添加成功！");
          this.render();
          this.formLoading = false;
          this.$emit("on-save", rep);
          if (this.loads) {
            this.init();
          }
        })
        .catch(() => {
          this.formLoading = false;
        });
    },
    update() {
      this.formLoading = true;
      Service[this.service]
        .update(this.updateId, this.form)
        .then(rep => {
          console.log(rep);
          this.dialog = false;
          this.$Message.success("编辑成功！");
          this.render();
          this.formLoading = false;
          this.$emit("on-update", rep);
          if (this.loads) {
            this.init();
          }
        })
        .catch(() => {
          this.formLoading = false;
        });
    },
    onCancel() {
      this.dialog = false;
      this.$emit("on-dialog-cancel");
    },
    onPage(page) {
      // this.query.page = page.pageNumber;
      // this.query.size = page.pageSize;
      this.query.page = page;
      this.render();
    },
    onSizeChange(size) {
      this.query.page = 1;
      this.query.size = size;
      this.render();
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
    render() {
      this.loading = true;
      Service[this.service].findAll(this.query).then(rep => {
        this.data = rep.data;
        this.total = rep.total || rep.data.length;
        this.loading = false;
        this.$emit("render");
      });
    },
    onEdit(data) {
      this.$emit("on-edit", data);
      const values = JSON.parse(JSON.stringify(data));
      delete values["_rowKey"];
      delete values["_index"];
      this.form = { ...values };
      this.dialog = true;
      this.action = "update";
      this.updateId = values.id;
    },
    onDelete(id, str) {
      this.$Confirm({
        title: "提示",
        content: str ? str : "确定要删除当前选择数据吗？",
        loading: true,
        onOk: () => {
          Service[this.service]
            .remove(id)
            .then(() => {
              this.$Modal.remove();
              this.$Message.success("删除成功！");
              this.$nextTick(() => {
                this.render();
                this.$emit("on-delete");
              });
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    onDeleteSelected() {
      this.$Confirm({
        title: "提示",
        content: "确定要删除当前选择的数据吗？",
        loading: true,
        onOk: () => {
          batchService
            .batchDelete(this.service, { id: this.selection.map(s => s.id) })
            .then(() => {
              this.selection = [];
              this.$Modal.remove();
              this.$Message.success("删除成功！");
              this.$nextTick(() => {
                this.render();
                this.$emit("on-delete");
              });
            })
            .catch(() => {
              this.loading = false;
            });
          // Service[this.service]
          //   .remove(id)
          //   .then(() => {
          //     this.$Modal.remove();
          //     this.$Message.success('删除成功！');
          //     this.render();
          //     this.$emit('on-delete');
          //     if (this.loads) {
          //       this.init();
          //     }
          //   })
          //   .catch(() => {
          //     this.loading = false;
          //   });
        }
      });
    },
    onSortChange(data) {
      this.query.orders = [`${data.order == "desc" ? "-" : ""}${data.key}`];
      this.render();
    },
    onRefresh() {
      this.query = {
        page: 1,
        size: 20,
        count: 1,
        fields: ["*"],
        orders: this.orders.length > 0 ? this.orders : ["weight", "-changed"],
        filters: []
      };
      if (this.$refs["xFilter"]) {
        this.$refs.xFilter.reset();
      }
      this._clearSortOn();
      this.render();
      this.$emit("refresh");
    },
    _clearSortOn() {
      $(this.$refs.xTable.$el)
        .find(".ivu-table-sort .on")
        .removeClass("on");
    },
    onShowColumn() {
      this.showColumn = true;
    },
    onSelectColumns(columns) {
      this.localColumns = columns;
    },
    onSelectChange(selection) {
      this.selection = selection;
    },
    initColumns() {
      const local = this.$ls.get(this.service, null);
      if (local) {
        this.localColumns = this.columns.filter(column => {
          if (!column.key) {
            return true;
          } else {
            return local.indexOf(column.key) > -1;
          }
        });
      } else {
        this.localColumns = this.columns;
      }
    },
    onExport() {
      this.$refs.xTable.exportCsv({
        filename: "export",
        original: false
      });
    },
    onRowClick(row, index) {
      this.$emit("on-row-click", row, index);
    },
    doFilter(filter) {
      const target = this.query.filters.find(
        item => item.field == filter.field
      );
      if (target) {
        target.args = filter.args;
        target.op = filter.op;
      } else {
        this.query.filters.push(filter);
      }

      this.render();
    },
    addFilter(filter) {
      this.$refs.xFilter.addFilter(filter);
    }
  },
  created() {
    if (this.service) {
      this.initColumns();
      this.render();
    }
  }
};
</script>

<style lang="less">
.wrapper {
  height: 100%;
}
</style>
