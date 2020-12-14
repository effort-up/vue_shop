<template>
  <div>
    <p>当前的用户：{{rolesInfo.username}}</p>
    <p>当前的角色：{{rolesInfo.role_name}}</p>
    分配新角色
    <!-- select 选择器 -->
    <el-select v-model="value" placeholder="请选择">  
      
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  </div>
</template>
<script>
export default {
  name: 'EditRolesForm',
  data() {
    return {
      value: ''
    }
  },
  props: {
    rolesInfo: {  //当前用户的信息
      type: Object,
      default() {
        return {}
      }
    },
    rolesList: {  //当前数据库中所有的角色信息
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    editRolesClose() {
      this.value = ''
    }
  }
}
</script>
<style lang="less" scoped>

</style>