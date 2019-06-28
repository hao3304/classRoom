<template>
  <div class="p-home">
    <h2>我的作业列表</h2>
    <div class="p-home__list">
      <Row :gutter="40">
        <i-col :span="4" v-for="(item, key) in assignments" :key="key">
          <div class="item" @click="onRoute(item)">
            <h5>{{ key }}</h5>
            <p>{{ item.problemIds.length }}道题目</p>
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
        query: { id: item.problemIds.join(",") , repoId: item.repoId}
      });
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
    }
  }
}
</style>
