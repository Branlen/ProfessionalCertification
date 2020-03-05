
<template>
  <!-- 忘记密码 -->
  <div class="forget">
    <canvas id="canvas"></canvas>
    <div class="backTitle">
      <span class="edging"></span>
      <img src="../../assets/logo.png" alt />
    </div>

    <div class="backImg">
      <div class="box">
        <el-form
          label-width="auto"
          label-position="right"
          status-icon
          :ref="registerInfo"
          :model="registerInfo"
          size="small"
        >
          <el-form-item>
            <span class="title">忘记密码</span>
          </el-form-item>
          <el-form-item
            prop="email"
            :rules="[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
                ]"
            :error="errorMsg3"
          >
            <el-input v-model="registerInfo.email" placeholder="邮箱" prefix-icon="el-icon-receiving"></el-input>
          </el-form-item>
          <el-form-item prop="pass" :rules="rules.pass" :error="errorMsg2">
            <el-input
              v-model="registerInfo.pass"
              type="password"
              placeholder="输入新的密码"
              prefix-icon="el-icon-lock"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="checkPass" :rules="rules.checkPass" :error="errorMsg2">
            <el-input
              v-model="registerInfo.checkPass"
              type="password"
              placeholder="确认密码"
              prefix-icon="el-icon-lock"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="请输入邮箱验证码 "
              prefix-icon="el-icon-chat-dot-round"
              v-model="registerInfo.idCode"
              class="input-with-select"
            >
              <el-button slot="append" type="primary" @click="getIdCode" id="idCode">获取验证码</el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="registerInfo.port" size="small">
              <el-radio :label="0">管理端</el-radio>
              <el-radio :label="1">用户端</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button
              class="loginSubmit"
              type="primary"
              size="medium"
              @click="submitForm('registerInfo')"
            >提交</el-button>
             <el-button
              class="loginSubmit"
              type="primary"
              size="medium"
              @click="back('/login')"
            >返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="copyRight" align="center">©2019 by ITAEM</div>
  </div>
</template>

<script>
import { foregeAdminPass, forgetUserPass, sendCode } from "../../api/user";
import getBack from "./backgound";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerInfo.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerInfo: {
        name: "",
        username: "",
        pass: "",
        email: "",
        checkPass: "",
        idCode: "",
        port: 0
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      errorMsg: "",
      errorMsg2: "",
      errorMsg3: ""
    };
  },
  methods: {
    back(a){
        this.$router.push(a)
    },
    submitForm() {
      var fullFlag =
        this.registerInfo.pass !== "" &&
        this.registerInfo.email !== "" &&
        this.registerInfo.idCode !== "";
      if (fullFlag) {
        if (this.registerInfo.port == 0) {
          foregeAdminPass({
            code: this.registerInfo.idCode,
            email: this.registerInfo.email,
            newPassword: this.registerInfo.pass,
            rePassword: this.registerInfo.pass
          })
            .then(result => {
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success"
              });
              this.$router.push("/login");
            })
            .catch(err => {
              this.$notify({
                title: "失败",
                message: "修改失败",
                type: "danger"
              });
            });
        } else if (this.registerInfo.port == 1) {
          forgetUserPass({
            code: this.registerInfo.idCode,
            email: this.registerInfo.email,
            password: this.registerInfo.pass,
            userType: this.registerInfo.port
          })
            .then(result => {
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success"
              });
              this.$router.push("/login");
            })
            .catch(err => {
              this.$notify({
                title: "失败",
                message: "修改失败",
                type: "danger"
              });
            });
        }
      } else {
        this.$message({
          message: "你的信息未填写完全",
          type: "warning"
        });
      }
    },
    getIdCode() {
      if (this.registerInfo.email !== "") {
        var sec = 60;
        var but = document.getElementById("idCode");
        but.disabled = true;
        var tiemr = setInterval(function() {
          but.children[0].innerHTML = `${sec}秒后重新获取`;
          if (sec == 0) {
            but.children[0].innerHTML = `获取验证码`;
            but.disabled = false;
            return;
            clearInterval(timer);
          }
          sec--;
        }, 1000);
        sendCode(this.registerInfo.email)
          .then(result => {
            console.log(result);
          })
          .catch(err => {});
      } else {
        this.$message({
          message: "你的邮箱信息未填写",
          type: "warning"
        });
      }
    }
  },
  mounted() {
    getBack();
    // var login = document.getElementsByClassName("register")[0];
    // login.style.height = window.innerHeight + "px";
    // var box = document.getElementsByClassName("box")[0];
    // box.style.left = (window.innerWidth - 400) / 2 + "px";
  }
};
</script>

<style lang="less" scoped>
#canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.forget {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  .backTitle {
    height: 7%;
    text-align: left;
    margin-left: 2%;
    margin-top: 1%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .edging {
      width: 6px;
      height: 80%;
      box-sizing: border-box;
      border-radius: 5px;
      margin: 5% 0;
      background-color: #143e63;
    }
    img {
      height: 75px;
      margin-right: 1%;
    }
    h1 {
      margin: 0;
      font-size: 2em;
      font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB",
        "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    }
  }

  .backImg {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    position: relative;

    .box {
      position: absolute;
      top: 18%;
      right: 39%;
      min-width: 22%;
      border-radius: 10px;
      background-color: #e2ebf5;
      padding: 2% 2%;
      box-sizing: border-box;
      text-align: center;
      .title {
        font-size: 2.5em;
        color: #0f68ae;
        letter-spacing: 0.2em;
        text-shadow: 2px 2px 2px #8e8e8e;
      }
      .loginSubmit {
        width: 150px;
        background-color: #0f68ae;
        border-radius: 10px;
      }
    }
  }
}
a {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap-reverse;
  flex-flow: row-reverse wrap-reverse;
  justify-content: center;
  align-items: baseline;
  align-content: stretch;
  order: 22;
  flex-grow: 2;
  flex-shrink: 0.5;
  flex-basis: 635px;
}
</style>


