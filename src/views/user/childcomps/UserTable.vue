<template>
  <div>
    <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDialog(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="修改权限" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-s-tools"  size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
       
      </el-table>
  </div>
</template>
<script>
export default {
  name: "UserTable",
  data() {
    return {
      editUserInfo: null
    }
  },
  props: {
    userList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    //修改用户状态
    async userStateChanged(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status != 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("用户状态更新失败");
      }
      this.$message.success("用户状态更新成功！");
    },
    //修改用户信息
    async editDialog(id) {
      const {data: res} = await this.$http.get('users/' + id)
      if(res.meta.status != 200) return this.$message.error('查询用户信息失败！');
      this.editUserInfo = res.data
      this.$emit('editDialog', res.data)
    },
    //删除用户
    async deleteDialog(id) {
      const confirmResult = await this.$confirm('是否删除该用户?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)  
      if(confirmResult !== 'confirm') return this.$message.info('已取消删除')       
      const {data: res} = await this.$http.delete('users/' + id)
      if(res.meta.status != 200) return this.$message.error('删除用户失败！')
      this.$message.success('删除成功！')
      this.$emit('deleteDialog')      
    }
  }
};
</script>
<style lang="less" scoped>
</style>