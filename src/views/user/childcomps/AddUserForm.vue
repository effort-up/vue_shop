<template>
  <div>
    <el-form  :model="addUserForm" :rules="formRules" ref="addUserRef" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addUserForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addUserForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addUserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="addUserForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- <form-model :form='addUserForm' :form-label='addUserLabel'></form-model> -->
  </div>
</template>
<script>
// import FormModel from './FormModel.vue';
export default {
  name: "AddUserForm",
  // components: {
  //   FormModel
  // },
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //addUserLabel: ['用户名','密码','邮箱','电话']
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度为3~10个字符之间', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码的长度为6~15个字符之间', trigger: 'blur'}
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '请输入合法的邮箱', trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, message: '请输入合法的手机号', trigger: 'blur'}
        ]

      }
    }
  },
  methods: {
    //清除表单
    clearForm() {
      this.$refs.addUserRef.resetFields()
    },
    //添加用户
    addUser() {
      this.$refs.addUserRef.validate(async valid => {
        if(!valid) {
          return 
        }
        const {data: res} = await this.$http.post('users', this.addUserForm)
        if(res.meta.status != 201) {
          this.$message.error('添加用户失败')
        
        }
        this.$message.success('添加用户成功')
        
      })
    }
    
  }

};
</script>
<style lang="less" scoped>

</style>