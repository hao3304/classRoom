<template>
  <hot-table ref="table" :settings="settings"></hot-table>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  name: "index",
  data() {
    return {
      settings: {
        licenseKey: "63ae9-00dfe-0b600-f450d-35624",
        data: [],
        rowHeaders: true,
        stretchH: "last",
        className: "htCenter f-hot-table",
        columns: [
          {
            data: "time",
            width: 120,
            align: "center",
            editor: false
          }
        ],
        nestedHeaders: [
          [
            {
              label: "时间",
              colspan: 1
            }
          ]
        ]
      }
    };
  }
};
</script>

<style scoped></style>
