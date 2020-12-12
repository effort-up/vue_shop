<template>
  <div>
    <el-form  :model="form" :rules="formRules" ref="FormRef" label-width="80px">
      <el-form-item :label="formLabel[index]" :prop="key " v-for="(vlaue, key, index) in form" :key='index'>
        <el-input v-model="form.key"></el-input>
      </el-form-item>
      <!-- <el-form-item label="密码" prop="password">
        <el-input v-model="addUserForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addUserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="addUserForm.mobile"></el-input>
      </el-form-item> -->
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'FormModel',
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    formLabel: {
      type: Array,
      default() {
        return []
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
    }

  }
}
</script>
<style lang="less" scoped>

</style>