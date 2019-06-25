import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import page404 from "@/views/error-page/404.vue";
import Building from "@/views/building";
import Test from "@/views/test.vue";
import Login from "@/views/login";

export default new Router({
  mode: "history",
  base: process.env.NODE_ENV == "production" ? "/app/" : "/",
  routes: [
    {
      path: "/login",
      component: () => import("@/layout/full"),
      children: [
        {
          path: "",
          name: "Login",
          component: Login
        }
      ]
    },
    {
      path: "/building",
      component: () => import("@/layout/single"),
      children: [
        {
          path: "",
          name: "Building",
          component: Building
        }
      ]
    },
    {
      path: "/test",
      component: () => import("@/layout/single"),
      children: [
        {
          path: "",
          name: "Test",
          component: Test
        }
      ]
    },
    {
      path: "/404",
      component: () => import("@/layout/full"),
      children: [
        {
          path: "",
          name: "404",
          component: page404
        }
      ]
    },
    {
      path: "/home",
      alias: "/",
      component: () => import("@/layout/single"),
      children: [
        {
          path: "",
          name: "home",
          meta: {
            title: "个人中心"
          },
          component: () => import("@/views/home")
        },
        {
          path: "problem",
          name: "problem",
          meta: {
            title: "个人中心"
          },
          component: () => import("@/views/problem")
        }
      ]
    }
  ]
});
