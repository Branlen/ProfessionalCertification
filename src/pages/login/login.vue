<template>
  <div class="login">
    <!-- <canvas id="canvas"></canvas> -->
    <div class="backTitle">
      <span class="edging"></span>
      <h1>专业认证管理系统</h1>
    </div>
    <div class="backImg">
      <div class="box">
        <el-form label-width="auto" label-position="right" :ref="loginInfo" :model="loginInfo">
          <el-form-item>
            <span class="title">用户登录</span>
          </el-form-item>
          <el-form-item
            prop="username"
            :rules="[
              { required: true, message: '用户名不能为空', trigger: 'blur' },
            ]"
            :error="errorMsg"
          >
            <el-input v-model="loginInfo.username" placeholder="用户名/邮箱" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            :rules="{
             required: true, message: '密码不能为空', trigger: 'blur'}"
            :error="errorMsg2"
          >
            <el-input
              v-model="loginInfo.password"
              placeholder="密码"
              prefix-icon="el-icon-lock"
              show-password
            ></el-input>
            <div class="forgetPass" align="right"> 
              <span href="" @click.prevent='forgetPass()'>忘记密码？</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="loginInfo.port" size="small">
              <el-radio :label="0" class="port">超管</el-radio>
              <el-radio :label="1" class="port">课程负责</el-radio>
              <el-radio :label="2" class="port">编撰者</el-radio>
              <el-radio :label="3" class="port">教师</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button
              class="loginSubmit"
              type="primary"
              size="medium"
              :loading="loading"
              @click="submitForm('loginInfo')"
            >登录</el-button>
            <el-button class="loginSubmit" type="primary" size="medium" @click="toRegister">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="copyRight" align ="center">©2019 by ITAEM</div>
  </div>
</template>

<script>
import { login } from "../../api/user";
import { setToken } from "../../utils/auth";
import getBack from"./backgound"
export default {
  data() {
    return {
      loginInfo: {
        name: "",
        username: "",
        password: "",
        port: 0
      },
      errorMsg: "",
      errorMsg2: "",
      loading: false
    };
  },
  
  methods: {
    submitForm() {
      var fullFlag =
        this.loginInfo.username !== "" && this.loginInfo.password !== "";
      if (fullFlag) {
        this.loading = true;
        setToken(this.loginInfo.port)
            this.$router.push("/");
            this.loading = false;
            this.$notify({
              title:'成功',
              message:"登录成功",
              type:'success'
            })
          
      } else {
        this.$message({
          message: "你的信息未填写完全",
          type: "warning"
        });
      }
    },
    forgetPass(){

      this.$router.push("/forget")
    },
    toRegister() {
      this.$router.push("/register");
    }
  },
  mounted() {
     getBack();
    // var login = document.getElementsByClassName("login")[0];
    // login.style.height = window.innerHeight + "px";
    // var box = document.getElementsByClassName('box')[0];
    // box.style.left = (window.innerWidth - 400)/2 +'px'
  }
};
</script>
<style lang="less" scoped>
@px:16rem;
.login {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  background: url("../../assets/background.jpg") no-repeat;
  background-size: 100% auto;
  .backTitle {
    height: 7%;
    text-align: left;
    margin-left: 2%;
    margin-top: 1%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .edging{
      width: 6px;
      height: 80%;
      box-sizing: border-box;
      border-radius: 5px;
      margin: 5% 0;
      background-color: #143e63;
    }
    img{
      height: 75px;
      margin-right: 1%;
     
    }
    h1 {
      margin: 0;
      font-size: 32/@px;
      color: wheat;
      font-family:sans-serif;
    }
  }

  .backImg {
    width: 100%;
    height: 80%;
    
    background-size: 100% 100%;
    position: relative;

    .box {
      position: absolute;
      top: 20%;
      right: 35%;
      left: 35%;
      max-width: 450px;
      border-radius: 10px;
      background-color: #e2ebf5;
      padding: 2% 2%;
      box-sizing: border-box;
      text-align: center;
      .title {
        font-size: 2.5em;
        color: #0f68ae;
        letter-spacing: 0.2em;
        text-shadow: 2px 2px 2px #8e8e8e
      }
      .forgetPass{
        height: 20px;
        span{
          cursor: pointer;
          color:#0f68ae;
        }
      }
      .el-radio__original:visited #app{
        background: #0f68ae;
      }
      .loginSubmit {
        width: 150px;
        background-color: #0f68ae;
        border-radius: 10px;
      }
    }
  }
}
</style>
