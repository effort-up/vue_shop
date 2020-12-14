<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="params.query" clearable @clear="getUser">
            <el-button slot="append" icon="el-icon-search" @click="getUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <user-table :user-list='userList' class="table" @editDialog='editDialog' 
                  @deleteDialog='getUser()' @rolesDialog='rolesDialog'></user-table>
      <!-- 表格下的页码 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 添加用户表单(对话框) -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close='addUserClose'>
        <!-- AddUserForm 子模板 -->
        <add-user-form  ref="addForm"></add-user-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog> 
      <!-- 修改用户信息对话框 -->
       <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="30%" @close='editUserClose'>
         <!--  EditUserForm 子模板 -->
          <edit-user-form :editUserForm='editUserInfo' ref="editForm"></edit-user-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改用户角色对话框 -->
       <el-dialog title="分配角色" :visible.sync="rolesDialogVisible" width="40%" @close='editRolesClose'>
         <!--  EditRolesForm 子模板 -->
          <edit-roles-form  ref="rolesForm" :rolesInfo='rolesInfo' :rolesList='rolesList'></edit-roles-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="rolesDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRoles">确 定</el-button>
          </span>
        </el-dialog>
    </el-card>
  </div>
</template>
<script>

import UserTable from './childcomps/UserTable'
import AddUserForm from './childcomps/AddUserForm'
import EditUserForm from './childcomps/EditUserForm'
import EditRolesForm from './childcomps/EditRolesForm'


export default {
  name: "Users",
  components: {
    UserTable,
    AddUserForm,
    EditUserForm,
    EditRolesForm

  },
  data() {
    return {
      params: {   //分页
        query: "",
        pagenum: 1,
        pagesize: 4,
      },
      userList: [], //当前页码下，要展示的用户的信息
      total: 0,  //当前数据库中用户的数量
      addDialogVisible: false,  //添加用户对话框的显示与隐藏
      isAdd: false,
      editDialogVisible: false, //修改用户对话框的显示与隐藏
      editUserInfo: null,
      rolesDialogVisible: false,  //修改角色对话框的显示与隐藏
      rolesInfo: {},  //当前用户的信息
      rolesList: []   //当前数据库中所有的角色
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    //获取主页面数据
    async getUser() {
      const { data: res } = await this.$http.get("/users", {
        params: this.params,  //把每页要展示的参数当成请求体传递给服务器
      });
      //console.log(res);
      if (res.meta.status != 200) return this.$message.error("获取用户列表失败！");
      console.log(res)  
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    //修改当前页面显示多少条信息
    handleSizeChange(newSize) {
      this.params.pagesize = newSize;
      this.getUser();
    },
    //改变当前页数
    handleCurrentChange(newPage) {
      this.params.pagenum = newPage;
      this.getUser();
    },
    //当对话框关闭时，
    addUserClose() {
      this.$refs.addForm.clearForm()  //调用子组件的清除表单方法
    },
    //添加用户对话框 点击确认按钮
    addUser() {
      this.$refs.addForm.addUser()  //调用子组件的添加用户方法
      this.getUser()   //重新渲染页面
      this.addDialogVisible = false  // 关闭对话框
    },
    // 修改用户信息按钮的点击事件
    editDialog(editUserInfo) {
      this.editUserInfo = editUserInfo
      this.editDialogVisible = true
    },
    //修改用户信息对话框的关闭事件
    editUserClose() {
      this.$refs.editForm.editUserClose()
    },
    //修改用户信息确认按钮的点击事件
    editUser() {
      this.$refs.editForm.editUser()  //调用子组件的添加用户方法
      this.getUser()   //重新渲染页面
      this.editDialogVisible = false  // 关闭对话框
    },
    //修改用户角色按钮的点击事件
    async rolesDialog(rolesInfo) {
      this.rolesInfo = rolesInfo
      const {data: res} = await this.$http.get('roles')
      if(res.meta.status != 200) return this.$message.error('获取失败！')
      console.log(res)
      this.rolesList = res.data 
      this.rolesDialogVisible = true  //对话框显示
    },
    //修改用户角色对话框的关闭
    editRolesClose() {
      this.$refs.rolesForm.editRolesClose()  //调用子组件的方法
      this.rolesInfo = {} //把用户信息 rolesInfo对象清空， 当下一次显示对话框时，显示的信息就不会是上一次的信息，而是更新后的信息
    },
    //修改用户角色对话框的确认按钮点击事件
    async editRoles() {
      if(!this.$refs.rolesForm.value) return this.$message.error('请选择要分配的角色')
      const {data: res} = await this.$http.put(`users/${this.rolesInfo.id}/role`,
        {rid: this.$refs.rolesForm.value}
      )
      if(res.meta.status != 200) return this.$message.error('更新角色失败！')
      console.log(res)
      this.$message.success('更新角色成功！')
      this.getUser()
      this.rolesDialogVisible = false
    }
    
  },
};
</script>
<style lang="less" scoped>

</style>