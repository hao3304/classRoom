<template>
  <div>
    <Modal v-model="dialog" width="600px" title="数据列管理" @on-ok="onOk">
      <Row>
        <i-col :span="24">
          <Checkbox
            @on-change="setAll"
            style="margin-bottom: 5px;margin-left: 15px;"
            v-model="all"
          >
            全选</Checkbox
          >
        </i-col>
        <template v-for="column in columns">
          <i-col :span="8" :key="column.key" v-if="column.key">
            <Checkbox
              v-model="map[column.key]"
              style="margin-bottom: 5px;margin-left: 15px;"
            >
              {{ column.title }}</Checkbox
            >
          </i-col>
        </template>
      </Row>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    name: String,
    visible: Boolean,
    columns: {
      default: []
    }
  },
  name: "xColumn",
  data() {
    return {
      dialog: this.visible,
      map: {},
      all: true
    };
  },
  watch: {
    visible() {
      this.dialog = this.visible;
    },
    dialog() {
      this.$emit("update:visible", this.dialog);
      if (this.dialog) {
        this.initMap();
      }
    },
    map: {
      deep: true,
      handler() {
        this.initAll();
      }
    }
  },
  methods: {
    initMap() {
      const local = this.$ls.get(this.name, null);
      this.columns.forEach(column => {
        if (local) {
          this.$set(
            this.map,
            column.key,
            local.findIndex(l => l == column.key) > -1
          );
        } else {
          this.$set(this.map, column.key, true);
        }
      });
    },
    onOk() {
      const columns = [];
      this.columns.forEach(column => {
        if (this.map[column.key]) {
          columns.push(column);
        }
      });
      this.$ls.set(this.name, columns.map(c => c.key));
      this.$emit("on-select", columns);
    },
    initAll() {
      let all = true;
      Object.keys(this.map).forEach(key => {
        if (this.map[key] == false) {
          all = false;
        }
      });
      this.all = all;
    },
    setAll(all) {
      Object.keys(this.map).forEach(key => {
        this.map[key] = all;
      });
    }
  }
};
</script>

<style></style>
