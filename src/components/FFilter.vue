<template>
  <div>
    <div class="f-filter">
      <div v-if="list.length > 0" class="f-filter__prepend">
        <!--<Select style="width: 100%" v-model="dataType" @on-change="onSelectChange">-->
        <!--<Option v-for="(l, index) in list" :value="l.field" :key="index">{{l.name}}</Option>-->
        <!--</Select>-->
        <Dropdown placement="bottom-start" @on-click="onSelectChange">
          <a href="javascript:void(0)">
            <Icon type="md-arrow-dropdown" />
          </a>
          <DropdownMenu slot="list">
            <DropdownItem
              v-for="(l, index) in list"
              :name="l.field"
              :key="index"
            >
              {{ l.name }}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <span class="f-filter__prepend-name" v-show="selectData.name">
          {{ selectData.name }}：
        </span>
      </div>
      <div
        v-if="list.length > 0"
        class="f-filter__content"
        :style="{ width: width + 'px' }"
      >
        <Input
          @on-enter="onSearch"
          style="width: 100%"
          v-model="filterValue"
          :placeholder="selectData.placeholder"
          v-if="selectData.type == 'input'"
        />
        <Select
          v-if="selectData.type == 'select'"
          v-model="filterValue"
          :placeholder="selectData.placeholder"
        >
          <Option
            v-for="item in selectData.data"
            :label="item.name"
            :value="item.value"
            :key="item.value"
          ></Option>
        </Select>

        <DatePicker
          v-if="selectData.type == 'date'"
          v-model="filterValue"
          type="daterange"
          :placeholder="selectData.placeholder"
          style="width: 100%"
        ></DatePicker>
      </div>
      <div v-if="list.length > 0" class="f-filter__append">
        <Button
          type="success"
          style="width: 100%;height: 100%"
          @click="onSearch"
        >
          <i style="font-size: 16px" class="ivu-icon ivu-icon-ios-search"></i>
        </Button>
      </div>

      <div class="f-filter__buttons" style="text-align: right">
        <slot name="buttons"></slot>
      </div>
      <div class="f-filter__senior" v-show="toolbar">
        <!--<a v-show="mode!='simple'&&list.length > 1" href="javascript:;" style="margin-right: 10px" @click="showSenior = !showSenior">高级搜索</a>-->
        <Tooltip
          v-show="mode != 'simple' && list.length > 1"
          content="高级搜索"
          placement="bottom"
          slot="right-block"
          style="margin-right: 10px;"
        >
          <Button
            @click="showSenior = !showSenior"
            icon="md-search"
            style="padding: 5px 8px;"
          ></Button>
        </Tooltip>
        <slot name="right-block"></slot>
      </div>
    </div>
    <div class="f-filter-list" v-show="filterList.length > 0">
      <div class="f-filter-list__name">
        <Icon type="ios-funnel" />
        检索项：
      </div>
      <div class="f-filter-list__items">
        <span v-for="l in filterList" :key="l.field">
          {{ l.name }}：{{ getValue(l) }}
          <Icon type="md-close" @click="onRemove(l.field)" />
        </span>
        <a href="javascript:;" @click="onClear">清除</a>
      </div>
    </div>
    <Modal :width="1000" title="高级搜索" v-model="showSenior">
      <div class="f-filter-senior">
        <i-form label-position="left" :inline="true" :label-width="80">
          <Row :gutter="40">
            <i-col :span="8" v-for="n in list" :key="n.field">
              <FormItem :label="n.name + '：'" style="width: 100%">
                <Input
                  v-if="n.type == 'input'"
                  v-model="map[n.field]"
                  :placeholder="n.placeholder"
                />
                <Select
                  v-if="n.type == 'select'"
                  v-model="map[n.field]"
                  :placeholder="n.placeholder"
                >
                  <Option
                    v-for="item in n.data"
                    :label="item.name"
                    :value="item.value"
                    :key="item.value"
                  ></Option>
                </Select>
                <DatePicker
                  v-if="n.type == 'date'"
                  v-model="map[n.field]"
                  type="daterange"
                  :placeholder="n.placeholder"
                  style="width: 100%"
                ></DatePicker>
              </FormItem>
            </i-col>
          </Row>
        </i-form>
      </div>

      <div slot="footer">
        <Button @click="onReset" type="text"
          ><i class="iconfont icon-qingkong1"></i> 清空</Button
        >

        <Button @click="showSenior = false">取消</Button>

        <Button
          type="primary"
          icon="ios-search"
          @click="onSeniorSearch"
          style="margin-right: 10px"
          >搜索</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "xFilter",
  props: {
    list: {
      default: []
    },
    mode: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 200
    }
  },
  computed: {
    ...mapState("common", ["areas"])
  },
  data() {
    return {
      dataType: "",
      showSenior: false, //高级查询
      selectData: {
        type: "input"
      },
      map: {},
      filterValue: "",
      filterList: []
    };
  },
  methods: {
    onSelectChange(value) {
      this.filterValue = "";
      if (value) {
        this.selectData = this.list.find(l => l.field == value);
      }
    },
    addFilter(filter) {
      const target = this.filterList.find(f => f.field == filter.field);
      if (target) {
        if (filter.value != null) {
          target.value = filter.value;
        } else {
          this.filterList = this.filterList.filter(
            f => f.field != filter.field
          );
        }
      } else if (filter.value != null) {
        this.filterList.push(filter);
      }
      this.$emit("on-filter", this.filterList);
    },
    onSearch() {
      if (this.filterValue !== "") {
        const target = this.filterList.find(
          l => l.field == this.selectData.field
        );
        if (target) {
          target.value = this.filterValue;
        } else {
          this.filterList.push({
            name: this.selectData.name,
            value: this.filterValue,
            field: this.selectData.field
          });
          this.filterValue = "";
        }
      }
      this.$emit("on-filter", this.filterList);
    },
    onSeniorSearch() {
      Object.keys(this.map).forEach(key => {
        if (this.map[key] != null && this.map[key] != "") {
          const target = this.filterList.find(l => l.field == key);
          if (target) {
            target.value = this.map[key];
          } else {
            const target = this.list.find(l => l.field == key);
            this.filterList.push({
              name: target.name,
              value: this.map[key],
              field: key
            });
          }
        }
      });
      this.showSenior = false;
      this.$emit("on-filter", this.filterList);
    },
    onRemove(field) {
      this.filterList = this.filterList.filter(l => l.field != field);

      if (field == this.selectData.field) {
        this.filterValue = "";
      }

      this.onSearch();
    },
    reset() {
      this.filterList = [];
    },
    onClear() {
      this.filterList = [];
      this.filterValue = "";
      this.onSearch();
      window.eventBus.$emit("filter-clear");
    },
    onReset() {
      this.map = {};
      this.$nextTick(() => {
        this.initMap();
        this.onClear();
      });
    },
    getAreaName(id) {
      let name = "";
      const loop = parent => {
        if (parent.id == id) {
          name = parent.name;
          return;
        }
        if (parent.children && parent.children.length > 0) {
          parent.children.forEach(child => loop(child));
        }
      };
      this.areas.forEach(area => loop(area));
      return name;
    },
    getValue(target) {
      if (target.value != null && target.value != "") {
        if (target.field == "area") {
          return this.getAreaName(target.value);
        }
        const item = this.list.find(l => l.field == target.field);

        if (!item) return;
        if (item.type == "input") {
          return target.value;
        } else if (item.type == "select") {
          return item.data.find(d => d.value == target.value)["name"];
        } else if (item.type == "date") {
          let start = new Date(target.value[0]).format("yyyy/MM/dd");
          let end = new Date(target.value[1]).format("yyyy/MM/dd");
          return start + ` - ` + end;
        }
      }
    },
    initMap() {
      this.list.forEach(item => {
        this.$set(this.map, item.field, null);
      });
    }
  },
  mounted() {
    if (this.list.length > 0) {
      this.dataType = this.list[0].field;
      this.selectData = this.list[0];
      this.initMap();
    }
  }
};
</script>

<style lang="less">
.f-filter {
  display: flex;
  * {
    line-height: normal;
  }

  .ivu-input-icon {
    line-height: 32px;
  }

  .ivu-input:focus {
    border-color: #ccc;
    box-shadow: none;
  }

  .ivu-input {
    border-radius: 0;
  }

  &__prepend {
    display: flex;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    align-items: center;
    background-color: #fff;
    height: 32px;

    &-name {
      white-space: nowrap;
      line-height: 32px;
    }

    .ivu-dropdown-rel {
      a {
        display: flex;
        width: 30px;
        height: 100%;
        font-size: 16px;
        line-height: 32px;
        justify-content: center;
        i {
          color: #999;
        }
      }
      a:hover {
        i {
          color: #333;
        }
      }
    }
  }

  &__content {
    .ivu-input,
    .ivu-select-selection {
      border-left: none !important;
      border-right: none !important;
      border-radius: 0;
      border-color: #ccc !important;
    }
  }

  &__append {
    width: 64px;
    height: 32px;
    .ivu-btn:focus {
      box-shadow: none;
    }

    .ivu-btn {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  &__senior {
    text-align: right;
    line-height: 32px;
  }
  &__buttons {
    line-height: 32px;
    flex: 1;
  }
}
.f-filter-list {
  display: flex;
  &__name {
    color: #666;
    margin-top: 12px;
    line-height: normal;
  }
  &__items {
    flex: 1;
    a {
      float: left;
      margin-top: 12px;
      color: #999;
      line-height: normal;
      &:hover {
        color: #333;
      }
    }
    span {
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #ddd;
      background: #f3f3f3;
      font-size: 12px;
      margin-right: 8px;
      color: #333333;
      float: left;
      line-height: normal;
      margin-top: 10px;
      i {
        font-size: 14px;
        vertical-align: text-top;
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
}

.f-filter-senior {
  padding-right: 30px;
  .ivu-col {
    margin-top: 10px;
  }
  &__button {
  }
}
</style>
