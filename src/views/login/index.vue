<template>
  <div class="login-container">

    <div>
       <vue-particles
      color="#eeeeee"
      :particleOpacity="0.5"
      :particlesNumber="100"
      shapeType="star"
      :particleSize="2"
      linesColor="#3D474C"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="80"
      :moveSpeed="1"
      :hoverEffect="true"
      hoverMode="repulse"
      :clickEffect="true"
      clickMode="push"
    >

    </vue-particles>

     <b-overlay
      :show="loading"
          :opacity="0.2"
          rounded="sm"
      spinner-variant="primary"
      class="d-inline-block"
    >

    <div
    class="login-form"
    >
      <div class="title-container">
        <h3 class="title ">Welcome to Gively</h3>
      </div>
      <!-- <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="phone"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item> -->

            <div>
              <b-form-input v-model="loginForm.username" placeholder="email"></b-form-input>
            </div>

            <div class="mt-3">
                <b-form-input type="password" v-model="loginForm.password" placeholder="password"></b-form-input>
            </div>

            <b-button  v-ripple.400="'rgba(186, 191, 199, 0.15)'" variant="outline-primary text-white" class="mt-3" @click="handleLogin()">Login</b-button>
      </div>
          </b-overlay>
    </div>
    </div>
</template>

<script>
import commonApi from "@/services/api";
import useJwt from '@/auth/jwt/useJwt';
import utils from "@/utils/index";
import Ripple from 'vue-ripple-directive'
import { BOverlay, BButton, BCardText } from 'bootstrap-vue'

export default {
  name: "Login",
  components:{BOverlay},
    directives: {
    Ripple,
  },
  data() {

    return {
      loginForm: {
        username: "",
        password: ""
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.pw.focus();
      });
    },

    async handleLogin()  {
        console.log("on submit---");

        // @TODO remove on production

        // localStorage.setItem('userData', '{"userId":"5eeda553ed884886ae316a455215a520","firstName":"John Admin ","lastName":"","fullName":"John Admin  ","ufId":"buqjhvkw9q0ofxf9","userType":2,"role":1000,"orgId":"tzss1akkn7lkm9t5","scopeId":"tzss1akkn7lkm9t5","phone":"+237678727139","username":"+237678727139","ability":[{"action":"manage","subject":"all","conditions":{"role":"manager"}},{"action":"read","subject":"Auth"}]}');

        // const ability = [
        //     {
        //       action: 'manage',
        //       subject: 'all',
        //       conditions: { role: 'manager' }
        //     },
        //     {
        //       action: 'read',
        //       subject: 'Auth',
        //     },
        // ]

        // this.$ability.update(ability)

        // this.$router.push('/').catch();

        // return true;

        // this.loading = true;
        if(!this.loginForm.username || !this.loginForm.password){

          this.$bvToast.toast("Field Cannot be Empty", {
            title: `Error`,
            solid: false,
            toaster: 'b-toaster-top-center',
            variant: 'primary',
          });
          return false;
        
        }
        // this.loading = true;
        const  resp = await commonApi.login({...this.loginForm, email: this.loginForm.username});

        // this.loading = false;

        if(resp && resp.success) {
          console.log("resp========", resp);

        useJwt.setToken(resp.data.token)
        // useJwt.setRefreshToken(response.data.refreshToken)
        // this.$ability.update(response.data.userData.ability)

        localStorage.setItem(useJwt.jwtConfig.storageTokenKeyName, JSON.stringify(resp.data.token))

        // file access token;
        commonApi.setDynamicToken();

        const user = resp.data.user || {};

        const ability = [
          {
            action: 'manage',
            subject: 'all',
            conditions: { role: 'manager' }
          },
          {
            action: 'read',
            subject: 'Auth',
          },
        ]

        user.fullName = user.firstName +" "+user.lastName;
        user.username = user.email || user.firstName;
        user.ability = ability;
        

        this.$ability.update(ability)
        // Remove userData from localStorage
        localStorage.setItem('userData', JSON.stringify(user))
        this.$router.push('/').catch();
      }
    }
  }
};
</script>

<style lang="scss">

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  text-align: center;
  height: 100vh;

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: rgba(10, 19, 31, 1);
$dark_gray: #889aa4;
$light_gray: #eee;

.particles-js {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100vw;
  height: 100vh;
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 999;
    width: 520px;
    max-width: 100%;
    padding: 45px;
    border-radius: 20px;
    transform: translate(-50%,-51%);
    overflow: hidden;
    background: rgba(18, 28, 40, 0.5);
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
