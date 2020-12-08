<template>
  <div class="login">
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar">
        <img src="~assets/img/logo.png" alt="头像" />
      </div>
      <!-- 表单 -->
      <el-form
        label-width="0px"
        class="user"
        :model="loginForm"
        ref="loginFromRef"
        :rules="loginFromRules" 
      >
        <el-form-item prop='username'>
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop='password'>
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <div class="button">
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button type="info" @click="resetFrom">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      // 表单验证规则
      loginFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
      ]
      }
    };
  },
  methods: {
    resetFrom() {
      //console.log(this)
      this.$refs.loginFromRef.resetFields();
    },
    submitForm() {
      this.$refs.loginFromRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.post("login", this.loginFrom)
        console.log(res)
      })
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #2b4b6b;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}
.avatar {
  width: 130px;
  height: 130px;
  border: 1px solid #e0dfdf;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 5px;
  box-shadow: 0 0 10px #aaa;
}
.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #f8f8ff;
}
.user {
  width: 70%;
  padding: 0 30px;
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%);
  box-sizing: border-box;
}
.button {
  display: flex;
  justify-content: flex-end;
}
</style>