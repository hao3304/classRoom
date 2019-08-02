<template>
  <div class="homepage-hero-module">
    <div class="video-container">
      <div :style="fixStyle" class="filter"></div>
      <video
        :style="fixStyle"
        autoplay
        loop
        class="fillWidth"
        muted
        poster="~@/assets/images/video_cover.jpeg"
        v-on:canplay="canplay"
      >
        <source src="~@/assets/video/night.mp4" type="video/mp4" />
        浏览器不支持 video 标签，建议升级浏览器。
      </video>
      <div class="poster hidden" v-if="!vedioCanPlay">
        <img :style="fixStyle" src="~@/assets/images/video_cover.jpeg" alt="" />
      </div>
    </div>
    <div class="login-form" v-show="mode == 'login'">
      <div class="login-form__left">
        <div class="left-logo">
          <img style="width: 200px;" src="~@/assets/images/logo.png" alt="" />
          <div style="font-size: 18px;">零一编程教室</div>
        </div>
        <!--        <div class="left-title">-->
        <!--          <img src="~@/assets/images/logo.png" alt="">-->
        <!--        </div>-->
        <div class="left-desc"></div>
      </div>
      <div class="login-form__right">
        <h5>用户登陆</h5>
        <div>
          <Form ref="form" :model="form" :rules="rules">
            <FormItem prop="userid">
              <Input
                v-model="form.userid"
                size="large"
                placeholder="请输入企业/单位名称"
              >
                <Icon type="md-contact" slot="prefix" />
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                @on-enter="onSubmit"
                type="password"
                v-model="form.password"
                size="large"
                placeholder="请输入密码"
              >
                <Icon type="md-key" slot="prefix" />
                <a
                  @click="form.password = ''"
                  v-show="form.password.length > 0"
                  href="javascript:;"
                  slot="suffix"
                >
                  <Icon type="ios-close" />
                </a>
              </Input>
            </FormItem>
          </Form>
        </div>
        <div>
          <Button
            @click="onSubmit"
            :loading="loading"
            size="large"
            type="info"
            style="width: 100%"
            >登 录</Button
          >
        </div>
        <p
          v-show="error"
          style="text-align: center;color: #f98989;margin-top: 5px;"
        >
          {{ error }}
        </p>
        <div class="btn-register">
          还没有注册帐号？<a @click="mode = 'register'" href="javascript:;"
            >注册帐号</a
          >
        </div>
      </div>
    </div>

    <div class="register-form" v-show="mode == 'register'">
      <h5>用户注册</h5>
      <Divider style="margin: 15px 0"></Divider>
      <Form
        ref="register"
        :model="model"
        :rules="registerRules"
        style="padding: 0 80px"
      >
        <Row :gutter="10">
          <i-col :span="12">
            <FormItem prop="firstname">
              <Input v-model="model.firstname" placeholder="请输入您的姓氏" />
            </FormItem>
          </i-col>
          <i-col :span="12">
            <FormItem prop="lastname">
              <Input v-model="model.lastname" placeholder="请输入你的名字" />
            </FormItem>
          </i-col>
        </Row>
        <FormItem prop="userid">
          <Input v-model="model.userid" placeholder="请输入登陆帐号" />
        </FormItem>
        <FormItem prop="password">
          <Input
            type="password"
            v-model="model.password"
            placeholder="请输入密码"
          />
        </FormItem>
        <FormItem prop="passwdCheck">
          <Input
            type="password"
            v-model="model.passwdCheck"
            placeholder="请再次输入密码"
          />
        </FormItem>
        <FormItem>
          <Button type="info" size="large" @click="onRegister" long
            >注册</Button
          >
        </FormItem>
      </Form>

      <div class="btn-login">
        已有账号，<a @click="mode = 'login'" href="javascript:;">立即登录</a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import loginService from "@/services/login";
import axios from "@/services/axios";

// import { CreateJsbUser } from "@/graphql/user.graphql";
import { baseURL } from "@/services/axios";
import ls from "@/libs/ls";
const model = () => {
  return {
    firstname: "",
    lastname: "",
    userid: "",
    password: "",
    passwdCheck: ""
  };
};

export default {
  name: "Login",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        if (this.model.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.register.validateField("passwdCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.model.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };

    const isPoneAvailable = (rule, value, callback) => {
      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (value === "") {
        callback(new Error("手机号码不能为空"));
      } else {
        if (!myreg.test(value)) {
          return callback(new Error("号码格式错误"));
        } else {
          return callback();
        }
      }
    };
    return {
      baseURL,
      form: {
        userid: "",
        password: ""
      },
      mode: "login",
      model: model(),
      loading: false,
      vedioCanPlay: false,
      fixStyle: "",
      error: "",
      rules: {
        userid: [{ required: true, message: "帐号不能为空", trigger: "blur" }],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },
      registerRules: {
        firstname: [
          { required: true, message: "姓氏不能为空", trigger: "blur" }
        ],
        lastname: [
          { required: true, message: "名字不能为空", trigger: "blur" }
        ],
        userid: [{ required: true, message: "帐号不能为空", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        passwdCheck: [{ validator: validatePassCheck, trigger: "blur" }]
      },
      formLoading: false
    };
  },
  watch: {
    mode() {
      if (this.mode == "register") {
        this.model = model();
      }
    }
  },
  methods: {
    ...mapMutations(["set_token"]),
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.error = "";
          loginService
            .login(this.form)
            .then(rep => {
              this.loading = false;
              this.$router.replace({ name: "Home" });
              const cookies = document.cookie.split("=")[1];
              ls.set("cookies", cookies, new Date().valueOf() + 3600 * 24000);
              axios.defaults.headers["X-CSRF-TOKEN"] = cookies;
            })
            .catch(e => {
              this.loading = false;
            });
        }
      });
    },
    canplay() {
      this.vedioCanPlay = true;
    },
    onRegister() {
      this.$refs.register.validate(valid => {
        if (valid) {
          this.formLoading = true;
          let params = JSON.parse(JSON.stringify(this.model));
          delete params.passwdCheck;
          loginService.register(params).then(rep => {
            this.$Message.success("注册成功！");
            this.mode = "login";
          });
        }
      });
    },
    handleSuccess(rep) {
      if (rep.code == 0) {
        this.model.license = rep.response.id;
      }
    }
    // getTrades() {
    //   this.$apollo
    //     .query({
    //       query: Trades,
    //       client: "jsb",
    //       fetchPolicy: "network-only"
    //     })
    //     .then(rep => {
    //       this.trades = rep.data.trades.map(trade => {
    //         return {
    //           label: trade.name,
    //           value: trade.id,
    //           children: trade.children.map(child => {
    //             return {
    //               label: child.name,
    //               value: child.id,
    //               standards: child.standards
    //             };
    //           })
    //         };
    //       });
    //     });
    // }
  },
  mounted() {
    window.onresize = () => {
      const windowWidth = document.body.clientWidth;
      const windowHeight = document.body.clientHeight;
      const windowAspectRatio = windowHeight / windowWidth;
      let videoWidth;
      let videoHeight;
      if (windowAspectRatio < 0.5625) {
        videoWidth = windowWidth;
        videoHeight = videoWidth * 0.5625;
        this.fixStyle = {
          height: windowWidth * 0.5625 + "px",
          width: windowWidth + "px",
          "margin-bottom": (windowHeight - videoHeight) / 2 + "px",
          "margin-left": "initial"
        };
      } else {
        videoHeight = windowHeight;
        videoWidth = videoHeight / 0.5625;
        this.fixStyle = {
          height: windowHeight + "px",
          width: windowHeight / 0.5625 + "px",
          "margin-left": (windowWidth - videoWidth) / 2 + "px",
          "margin-bottom": "initial"
        };
      }
    };
    window.onresize();
  }
};
</script>

<style lang="less">
.homepage-hero-module,
.video-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.video-container .poster img,
.video-container video {
  z-index: 0;
  position: absolute;
}

.video-container .filter {
  z-index: 1;
  position: absolute;
  background: rgba(0, 0, 0, 0.4);
}

.login-form {
  width: 580px;
  height: 320px;
  position: absolute;
  top: 50%;
  margin-top: -160px;
  left: 50%;
  margin-left: -290px;
  display: flex;
  z-index: 100;
  animation: fadeInDown;
  animation-duration: 1s;

  &__left {
    width: 290px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: slideRight 1s;
    background-color: rgba(255, 255, 255, 0.5);
    .left-logo {
      text-align: center;
      margin-bottom: 10px;
      position: relative;
      user-select: none;
      font-size: 16px;
      color: #fff;
      img {
      }
    }

    .left-title {
      text-align: center;
      user-select: none;
      img {
        width: 290px;
      }
    }
  }

  &__right {
    width: 290px;
    background-color: #fff;
    padding: 40px 20px;
    h5 {
      text-align: center;
      font-size: 20px;
      font-weight: 200;
    }

    > div {
      margin-top: 25px;
    }

    .btn-register {
      font-size: 14px;
      position: absolute;
      right: 25px;
      bottom: 10px;
    }
  }
}

.register-form {
  width: 580px;
  height: 600px;
  position: absolute;
  background-color: #fff;
  top: 50%;
  margin-top: -300px;
  left: 50%;
  margin-left: -290px;
  z-index: 100;
  animation: fadeInDown;
  animation-duration: 1s;
  padding: 15px 30px;
  h5 {
    text-align: center;
    font-size: 20px;
    font-weight: 200;
  }

  .btn-login {
    font-size: 14px;
    text-align: center;
  }

  .license-img {
    img {
      margin-top: 10px;
    }
  }
}

@keyframes fadeInDown {
  0% {
    transform: translateY(-120px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideRight {
  0% {
    opacity: 0;
    transform: translateX(145px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
</style>
