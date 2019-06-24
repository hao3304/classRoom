<template>
  <div ref="sheet">
    <Spin style="z-index: 2000" v-show="loading" fix></Spin>
  </div>
</template>

<script>
import Spreadsheet from "./src";
export default {
  name: "f-spread",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {}
    },
    freeze: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    columns: {
      deep: true,
      handler() {
        this.render();
      }
    }
  },
  data() {
    return {
      defOptions: {
        showToolbar: true,
        showGrid: true,
        showContextmenu: true,
        view: {
          height: () => document.documentElement.clientHeight,
          width: () => document.documentElement.clientWidth
        },
        row: {
          len: 50,
          height: 25
        },
        col: {
          len: 26,
          width: 100,
          indexWidth: 60,
          minWidth: 60
        },
        style: {
          bgcolor: "#ffffff",
          align: "center",
          valign: "middle",
          textwrap: false,
          strike: false,
          underline: false,
          color: "#0a0a0a",
          font: {
            name: "Helvetica",
            size: 10,
            bold: false,
            italic: false
          }
        }
      }
    };
  },
  methods: {
    render() {
      const rows = {};
      let fix = 0;
      if (this.freeze) {
        fix =
          this.freeze.slice(this.freeze.length - 1, this.freeze.length) * 1 - 1;
        for (let i = 0; i < fix; i++) {
          rows[i] = { cells: {} };
        }
      }
      let cellIndex = 0;
      this.columns.forEach((col, index) => {
        if (!col.children) {
          const item = {
            text: col.title
          };
          if (fix) {
            item.merge = [fix - 1, 0];
          }
          rows[0].cells[cellIndex] = item;
          cellIndex++;
        } else {
          rows[0].cells[cellIndex] = {
            text: col.title,
            merge: [0, col.children.length - 1]
          };
          col.children.forEach(child => {
            if (rows[1]) {
              rows[1].cells[cellIndex] = {
                text: child.title
              };
            }
            if (rows[2]) {
              rows[2].cells[cellIndex] = {
                text: child.date
              };
            }
            cellIndex++;
          });
        }
      });

      this.data.forEach((item, index) => {
        rows[index + fix] = { cells: {} };
        let colIndex = 0;
        this.columns.forEach((col, i) => {
          if (col.children) {
            col.children.forEach(child => {
              rows[index + fix].cells[colIndex] = {
                text: item[child.key]
              };
              colIndex++;
            });
          } else {
            rows[index + fix].cells[colIndex] = {
              text: item[col.key]
            };
            colIndex++;
          }
        });
      });
      const len = this.data.length + fix + 1;
      rows.len = len < 50 ? 50 : len;
      this.$spread.loadData({ rows });
    }
  },
  mounted() {
    const data = {};
    if (this.freeze) {
      data["freeze"] = this.freeze;
    }
    const s = (this.$spread = new Spreadsheet(
      this.$refs.sheet,
      Object.assign(this.defOptions, this.options)
    )
      .loadData(data) // load data
      .change(data => {
        // save data to db
        this.$emit("on-change", data);
      }));
    // data validation
    s.validate();
  }
};
</script>
<style lang="less"></style>
