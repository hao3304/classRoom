<template>
  <div class="p-home">
    <h2>我的作业列表</h2>
    <div class="p-home__list">
      <Row :gutter="40">
        <i-col :span="4" v-for="(item, key) in assignments" :key="key">
          <div class="item" @click="onRoute(item)">
            <h5>{{ key }}</h5>
            <p>{{ getLength(item.problems) }}道题目</p>
            <div class="process">完成进度：{{ getProcess(item.problems) }}</div>
          </div>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
import service from "@/services/base";
export default {
  name: "home",
  data() {
    return {
      assignments: {}
    };
  },
  methods: {
    onRoute(item) {
      this.$router.push({
        name: "problem",
        query: {
          id: Object.keys(item.problems).join(","),
          repoId: item.repoId,
          assignmentId: item.assignmentId
        }
      });
    },
    getLength(obj) {
      return Object.keys(obj).length;
    },
    getProcess(obj) {
      const keys = Object.keys(obj);
      let h = 0;
      if (keys.length == 0) {
        return "-";
      } else {
        keys.forEach(key => {
          if (obj[key]) {
            h++;
          }
        });

        return parseInt((h * 100) / keys.length) + "%";
      }
    }
  },
  mounted() {
    service.assignments().then(rep => {
      this.assignments = rep.data;
    });
  }
};
</script>
<style lang="less">
.p-home {
  padding: 20px;
  h2 {
    font-size: 18px;
    line-height: 24px;
    font-weight: 500;
    color: #383838;
  }
  &__list {
    .item {
      margin-top: 20px;
      height: 110px;
      background: url("~@/assets/images/cover-media.jpg") no-repeat;
      background-size: 100% 100%;
      border-radius: 4px;
      transition: transform 0.218s ease;
      cursor: pointer;
      padding: 10px;
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 12px rgba(56, 56, 56, 0.1);
      }

      h5 {
        font-size: 20px;
        color: #fff;
        font-weight: 400;
      }
      p {
        color: #666;
        font-size: 14px;
      }
      .process {
        text-align: right;
        color: #0099cc;
        font-weight: bold;
        font-size: 14px;
        margin-top: 20px;
      }
    }
  }
}
</style>
