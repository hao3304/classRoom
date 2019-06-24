<template>
  <span class="filter-head"
    >{{ column.title }}
    <Poptip placement="bottom" v-model="poptip">
      <span class="filter-head__funnel" :class="{ on: isFilter }"
        ><Icon type="ios-funnel"></Icon
      ></span>
      <div slot="content" style="overflow: hidden">
        <Form>
          <InputNumber size="small" placeholder="" v-model="min" />
          -
          <InputNumber size="small" placeholder="" v-model="max" />
        </Form>
        <div class="filter-head__block">
          <Button
            type="primary"
            size="small"
            @click="onClick"
            style="width: 80px;margin-right: 10px;"
            >确定</Button
          >
          <Button size="small" @click="onReset">重置</Button>
        </div>
      </div>
    </Poptip>
  </span>
</template>

<script>
export default {
  props: {
    column: Object,
    filters: Array
  },
  name: "filterHead",
  data() {
    return {
      min: null,
      max: null,
      isFilter: false,
      poptip: false
    };
  },
  methods: {
    onClick() {
      if (this.min !== null || this.max !== null) {
        this.isFilter = true;
        this.$emit("on-filter", this.min, this.max);
      } else {
        if (this.isFilter) {
          this.$emit("on-filter", this.min, this.max);
        }
        this.isFilter = false;
      }
      this.poptip = false;
    },
    onReset() {
      this.min = null;
      this.max = null;
      this.isFilter = false;
      this.poptip = false;
      this.$emit("on-filter", null, null);
    }
  }
};
</script>

<style lang="less" scoped>
.filter-head {
  &__funnel {
    i {
      transition: color 0.2s ease-in-out;
      color: #c5c8ce;
      cursor: pointer;
      margin-top: -2px;
      &:hover {
        color: inherit;
      }
    }

    &.on {
      i {
        color: #2d8cf0;
      }
    }
  }

  &__block {
    border-top: 1px solid #ddd;
    text-align: right;
    margin-top: 10px;
    padding-top: 10px;
  }
}
</style>
