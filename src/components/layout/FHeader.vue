<template>
  <div class="f-header">
    <div class="f-header__title">
      <img
        src="~@/assets/images/ff.png"
        style="width: 60px;margin-left: 20px;margin-right: -20px;padding: 4px 6px;border-radius: 6px;"
        alt=""
      />
      <img src="~@/assets/images/sys.png" class="sys" alt="" />
    </div>

    <div class="f-header__module">
      <ul>
        <li
          v-for="m in userModule"
          :class="{ active: m.id == selectModule }"
          @click="setModule(m)"
          :key="m.id"
        >
          <a href="javascript:;">
            <iconfont :icon="m.iconCls"></iconfont>
            <span>{{ m.text }}</span>
          </a>

          <div class="f-header__children" v-if="m.left == false && m.children">
            <ul>
              <li
                @click.stop="onSelectChild(m, child)"
                v-for="child in m.children"
                :key="child.id"
                :class="{ active: $route.name == child.path }"
              >
                {{ child.text }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="user-info">
      <Poptip :title="'您好，' + me.name" placement="bottom-end">
        <div slot="content">
          <div class="ivu-cell-group">
            <div class="ivu-cell">
              <div class="ivu-cell-link">
                <div class="ivu-cell-item">
                  <div class="ivu-cell-icon"></div>
                  <div class="ivu-cell-main">
                    <div class="ivu-cell-title">修改密码</div>
                    <div class="ivu-cell-label"></div>
                  </div>
                  <div class="ivu-cell-footer">
                    <span class="ivu-cell-extra"></span>
                  </div>
                </div>
              </div>
              <!---->
            </div>
            <div class="ivu-cell">
              <div class="ivu-cell-link">
                <div class="ivu-cell-item">
                  <div class="ivu-cell-icon"></div>
                  <div class="ivu-cell-main">
                    <div class="ivu-cell-title">锁屏</div>
                    <div class="ivu-cell-label"></div>
                  </div>
                  <div class="ivu-cell-footer">
                    <span class="ivu-cell-extra"></span>
                  </div>
                </div>
              </div>
              <!---->
            </div>
            <div class="ivu-cell ivu-cell-with-link">
              <a
                href="javascript:;"
                @click="onSelect('logout')"
                class="ivu-cell-link"
              >
                <div class="ivu-cell-item">
                  <div class="ivu-cell-icon"></div>
                  <div class="ivu-cell-main">
                    <div style="color: #515a6e" class="ivu-cell-title">
                      退出
                    </div>
                    <div class="ivu-cell-label"></div>
                  </div>
                  <div class="ivu-cell-footer">
                    <span class="ivu-cell-extra"></span>
                  </div>
                </div>
              </a>
              <div class="ivu-cell-arrow">
                <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
              </div>
            </div>
          </div>
        </div>

        <Avatar :src="getAvatar()" />
      </Poptip>
    </div>
    <div class="f-header__toolbar">
      <span
        style="display: inline-block;height: 28px;margin-right: 20px"
      ></span>
      <Badge v-if="myTicket.length > 0" style="margin-right: 20px;" dot>
        <Icon
          @click="onMyTicket"
          type="md-notifications-outline"
          class="f-header__icon"
          size="22"
        ></Icon>
      </Badge>
      <Icon
        @click="onMyTicket"
        style="margin-right: 20px;"
        v-else
        type="md-notifications-outline"
        class="f-header__icon"
        size="22"
      ></Icon>
      <Icon
        style="margin-right: 20px;"
        type="md-refresh"
        class="f-header__icon"
        @click="onRefresh"
        size="22"
      />
      <!--<Icon-->
      <!--style="margin-right: 20px;"-->
      <!--class="f-header__icon"-->
      <!--custom="iconfont icon-quanping"-->
      <!--v-if="!fullScreen"-->
      <!--size="22"-->
      <!--@click="onFullScreen"-->
      <!--&gt;</Icon>-->
      <!--<Icon-->
      <!--style="margin-right: 20px;"-->
      <!--class="f-header__icon"-->
      <!--custom="iconfont icon-009pingmusuoxiao"-->
      <!--v-if="fullScreen"-->
      <!--size="22"-->
      <!--@click="onExitFullScreen"-->
      <!--&gt;</Icon>-->
      <Icon
        style="margin-right: 10px;"
        class="f-header__icon"
        custom="iconfont icon-tuichu"
        size="22"
        @click="onLogout"
      ></Icon>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { baseURL } from "@/services/axios";
import { DoLogout } from "@/graphqls/base.graphql";
import base from "@/mixins/base";
import { TicketStat, TicketAssign } from "@/graphqls/ticket.graphql";
export default {
  name: "FHeader",
  computed: {
    ...mapState("app", ["module", "selectModule"]),
    ...mapState("common", ["me", "system"]),
    ...mapState(["token"]),
    userModule() {
      const isAdmin = !!this.me.admin;

      return this.module.filter(mod => {
        if (mod.admin && isAdmin) {
          return true;
        } else if (isAdmin) {
          return true;
        } else if (!mod.admin) {
          return true;
        }
        return false;
      });
    }
  },
  mixins: [base],
  data() {
    return {
      fullScreen: false,
      myTicket: 0,
      audio:
        window.location.origin + window.location.pathname + "audios/tip.mp3"
    };
  },
  methods: {
    ...mapMutations("app", ["set_module", "add_tab", "set_breadcrumb"]),
    ...mapMutations(["logout"]),
    getAvatar() {
      if (this.me.avatar) {
        return baseURL + `/image/${this.me.avatar}/128/128`;
      } else {
        return require("@/assets/images/avatar.png");
      }
    },
    setModule(module) {
      if (["1", "2", "3", "4"].indexOf(module.id) > -1) {
        this.onSelectChild(module, module.children[0]);
      } else {
        this.set_module(module.id);
      }
    },
    onLogout() {
      this.$Confirm({
        title: "提示",
        content: "确定要退出当前用户？",
        onOk: () => {
          this.logout();
          this.$ls.remove("token");
          this.$router.replace({ name: "login" });
          this.$apollo.mutate({
            mutation: DoLogout
          });
        },
        onCancel: () => {}
      });
    },
    onFullScreen() {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      this.fullScreen = true;
    },
    onExitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      this.fullScreen = false;
    },
    onRefresh() {
      window.eventBus.$emit("refresh");
    },
    onMyTicket() {
      this.add_tab({
        text: "我的工单",
        path: "/kf/ticket/1"
      });
    },
    getMyTicket() {
      this.$apollo
        .query({
          query: TicketStat,
          fetchPolicy: "network-only",
          variables: {
            own: true
          }
        })
        .then(({ data }) => {
          this.myTicket =
            data.ticket_stat.status.working +
            data.ticket_stat.status.pending +
            data.ticket_stat.status.auditing;
        });
    },
    subscribe() {
      const self = this;
      const observer = this.$apollo.subscribe({
        query: TicketAssign,
        variables: {
          token: this.token
        },
        client: "ws"
      });
      observer.subscribe({
        next() {
          self.getMyTicket();
          self.$Notice.success({
            title: "提醒",
            desc: "您有新的工单，请注意查收。"
          });
          self.playAudio();
        },
        error(errorValue) {
          alert(errorValue);
        }
      });
    },
    playAudio() {
      const player = new Audio(this.audio);
      player.play();
    },
    busRun() {
      this.getMyTicket();
    },
    onSelectChild(parent, child) {
      this.set_module(parent.id);
      this.$router.push({ name: child.path });
      this.set_breadcrumb([parent.text, child.text]);
    }
  },
  mounted() {
    this.getMyTicket();
    // this.subscribe();
  }
};
</script>

<style lang="less">
@import "~@/styles/theme.less";

.f-header {
  height: @HeaderHeight;
  background: url("~@/assets/images/header-bg.png") no-repeat;
  background-size: cover;
  display: flex;

  &__title {
    display: flex;
    align-items: center;
  }

  @media only screen and(max-width: 1280px) {
    &__title .sys {
      width: 300px;
      margin: 0 25px;
    }
  }

  @media only screen and(min-width: 1281px) {
    &__title .sys {
      width: 400px;
      margin: 0 40px;
    }
  }

  &__module {
    flex: 1;
    > ul {
      padding: 0;
      margin: 0;
      height: 100%;
      > li {
        list-style: none;
        width: 110px;
        height: 100%;
        display: inline-block;
        transition: all 0.2s;
        position: relative;
        &.active {
          background-color: @HeaderActiveBg;
          &:after {
            height: 4px;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #fe824c;
            position: absolute;
            content: " ";
          }
          a {
            color: #fff;
          }
        }

        &:hover {
          a {
            color: #fff;
          }
          .f-header__children {
            display: inline-block;
          }
        }
        a {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          i {
            font-size: 30px;
            height: 30px;
          }
          span {
            margin-top: 10px;
            font-size: 14px;
          }
        }
      }
    }
  }

  &__children {
    position: absolute;
    top: 80px;
    width: 160px;
    z-index: 2000;
    display: none;
    padding-top: 5px;
    ul {
      border-radius: 5px;
      background-color: #333333;
      padding: 4px 0;
      margin: 0;
    }
    li {
      color: #bbb;
      line-height: 40px;
      cursor: pointer;
      list-style: none;
      width: 100%;
      padding-left: 20px;
      font-size: 14px;

      &:hover {
        color: #fff;
      }

      &.active {
        background-color: #3b5ffe;
        color: #fff;
      }
    }
  }

  &__toolbar {
    display: flex;
    align-items: center;
    .ivu-icon {
      color: #efefef;
      cursor: pointer;
      &:hover {
        color: #fff;
      }
    }
  }
  .user-info {
    width: 50px;
    display: flex;
    cursor: pointer;
    align-items: center;
    position: relative;
    &:after {
      content: " ";
      position: absolute;
      top: 10px;
      bottom: 10px;
      width: 1px;
      right: 0;
      background-color: #999;
    }

    .ivu-poptip-body {
      padding: 0;
    }
  }
}
</style>
