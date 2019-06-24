<template>
  <div class="f-footer">
    <div class="f-footer__center">
      <img src="~@/assets/images/notice.png" alt="" />
      共 <strong>{{ notices.length }}</strong>
      条报警推送：
      <div class="f-footer__block">
        <ul :class="{ 'margin-top': animate }">
          <li
            v-for="(notice, index) in notices"
            :key="index"
            v-html="notice"
          ></li>
        </ul>
      </div>
    </div>
    <div class="f-footer__right">
      版权所有 &copy; 2019
      <strong><a href="javascript:void(0)">上海锐铼水务科技有限公司</a></strong>
    </div>
    <!--<div class="f-footer__right">-->
    <!--版本号：v0.9.0-->
    <!--</div>-->
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "FFooter",
  computed: {
    ...mapState("common", ["me", "system"])
  },
  data() {
    return {
      notices: [
        `<b>10:00</b> 马家浜一号泵站液位超过上限，报警值：<strong>3.00m</strong>  参考值：<b>2.30 m</b>。`,
        `<b>15:20</b> 马家浜二号泵站液位超过上限，报警值：<strong>3.20m</strong>  参考值：<b>2.50 m</b>。`
      ],
      animate: false
    };
  },
  methods: {
    render() {
      if (!this.timer) this.timer = setInterval(this.noticeLoop, 3000);
    },
    noticeLoop() {
      this.animate = true;
      setTimeout(() => {
        this.notices.push(this.notices[0]);
        this.notices.shift();
        this.animate = false;
      }, 500);
    }
  },
  mounted() {
    this.render();
  }
};
</script>

<style lang="less">
.f-footer {
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  color: #000;
  position: absolute;
  background: url("~@/assets/images/footer-bg.png") no-repeat;
  background-size: cover;
  bottom: 0;
  left: 0;
  display: flex;
  right: 0;
  padding: 0 20px;

  &__left {
    width: 150px;
    color: #fff;
  }
  &__center {
    flex: 1;
    display: flex;
    color: #fff;
    align-items: center;
    img {
      width: 30px;
      height: 30px;
      margin-right: 5px;
    }

    strong {
      color: #f95a54;
      margin: 0 5px;
    }
  }
  &__right {
    width: 350px;
    color: #fff;
    text-align: right;
  }

  &__block {
    display: flex;
    position: relative;
    height: 30px;
    line-height: 30px;
    flex: 1;
    overflow: hidden;

    ul {
      position: absolute;
      li {
        list-style: none;
        height: 30px;
      }

      &.margin-top {
        margin-top: -30px;
        transition: all 0.5s;
      }
    }
  }
}
</style>
