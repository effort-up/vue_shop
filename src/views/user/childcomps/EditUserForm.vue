<template>
  <div>
    <el-form  :model="editUserForm" :rules="editUserRules" ref="editUserRef" label-width="80px" >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editUserForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editUserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="editUserForm.mobile"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'EditUserForm',
  props: {
    editUserForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
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
      editUserRules: {
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
    editUserClose() {
      this.$refs.editUserRef.resetFields()
    },
    editUser() {
      this.$refs.editUserRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.put('users/' + this.editUserForm.id, {  
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile    
        })
        if(res.meta.status != 200) return this.$message.error('更新用户信息失败！')
        this.$message.success('更新用户信息成功！')
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>