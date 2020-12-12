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
      <user-table :user-list='userList' class="table" @editDialog='editDialog' @deleteDialog='getUser()'></user-table>
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
        <add-user-form  ref="addForm"></add-user-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
       <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="30%" @close='editUserClose'>
          <edit-user-form :editUserForm='editUserInfo' ref="editForm"></edit-user-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
          </span>
        </el-dialog>
    </el-card>
  </div>
</template>
<script>

import UserTable from './childcomps/UserTable'
import AddUserForm from './childcomps/AddUserForm'
import EditUserForm from './childcomps/EditUserForm';


export default {
  name: "Users",
  components: {
    UserTable,
    AddUserForm,
    EditUserForm

  },
  data() {
    return {
      params: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      isAdd: false,
      editDialogVisible: false,
      editUserInfo: null
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    async getUser() {
      const { data: res } = await this.$http.get("/users", {
        params: this.params,
      });
      //console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取用户列表失败！");
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
    editDialog(editUserInfo) {
      this.editUserInfo = editUserInfo
      this.editDialogVisible = true
    },
    editUserClose() {
      this.$refs.editForm.editUserClose()
    },
    editUser() {
      this.$refs.editForm.editUser()  //调用子组件的添加用户方法
      this.getUser()   //重新渲染页面
      this.editDialogVisible = false  // 关闭对话框
    },
    
  },
};
</script>
<style lang="less" scoped>

</style>