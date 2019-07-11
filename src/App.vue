<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import axios from "@/services/axios";
export default {
  data() {
    return {
      isLogin: false
    };
  },
  computed: {
    ...mapState("common", ["types"]),
    ...mapState(["token"])
  },
  watch: {
    $route() {
      this.getBreadCrumbs();
    }
  },
  async beforeCreate() {
    const token = this.$ls.get("cookies");
    if (token) {
      axios.defaults.headers["X-CSRF-TOKEN"] = token;
      // this.$store.commit("set_token", token);
      // await this.$store.dispatch("common/init");
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
    ...mapMutations("app", ["set_breadcrumbs"]),
    getBreadCrumbs() {
      const { matched } = this.$router.history.current;
      const rst = [];
      matched.forEach(match => {
        if (match.meta.title) {
          rst.push(match.meta.title);
        }
      });
      this.set_breadcrumbs(rst);
    }
  },
  created() {
    this.isLogin = window.location.href.indexOf("login") > -1;
  }
};
</script>
<style lang="less">
#app {
  height: 100%;
  min-width: 1280px;
  overflow: hidden;
  background-color: #eff3f6;
}
</style>
