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
          <el-button type="primary" @click="submitForm">登录</el-button>
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
        username: "admin",
        password: "123456",
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
    resetFrom() {  //重置按钮
      //console.log(this)
      this.$refs.loginFromRef.resetFields();
    },
    submitForm() { // 登录按钮
      this.$refs.loginFromRef.validate(async valid => {
        if(!valid) return
        const {data: res}  = await this.$http.post("login", this.loginForm)
        //console.log(res)
        if(res.meta.status != 200) return this.$message.error('用户名或密码错误')
        this.$message.success('登录成功')
        //1.将登录成功之后的 token， 保存到客户端的 sessionStorage 中
        // 1.1 项目中除了登录以外的其他 API 接口 必须在登录之后才能访问
        // 1.2 token 只应在当前网站打开期间生效， 所以使用 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通过编程式导航跳转到后台主页， 路由地址是 /home
        this.$router.push("/home")
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