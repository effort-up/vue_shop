<template>
  <div>
     <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/rights' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
       <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data='rolesList' border stripe>
        <!-- 下拉扩展区域 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- <rights-tag :scope='scope'></rights-tag> -->           
            <el-row v-for="(item1, index1) in scope.row.children" :key='item1.id' 
                    :class="['bottom', index1 === 0 ? 'top' : '']" class="tag-center">
              <!-- 一级权限 -->
              <el-col :span='5' >
                <el-tag closable @close='deleteRight(scope.row, item1.id)'> {{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
                <!-- 二级和三级权限 -->
              <el-col :span='19'>
                <el-row v-for="(item2, index2) in item1.children" :key="item2.id" 
                        :class="[index2 === 0 ? '' : 'top']" class="tag-center"
                        >
                  <!-- 二级权限 -->
                  <el-col :span='6'>
                    <el-tag type='success' closable @close='deleteRight(scope.row, item2.id)'>{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span='18'>                   
                    <el-tag type='warning' v-for="(item3) in item2.children" :key='item3.id' 
                            closable @close='deleteRight(scope.row, item3.id)'>{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
          <!-- <rights-tag ></rights-tag> -->
        </el-table-column>
        <el-table-column type="index" ></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column  label="操作" width='300px'>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
            <el-button type="warning" icon="el-icon-s-tools"  size="mini" @click="manageRightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 添加角色表单(对话框) -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%" @close='addRolesClose'>
        <el-form  :model="addRolesForm"  ref="addRolesRef" label-width="80px">
          <el-form-item label="角色名称" prop="username">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="password">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改角色信息对话框 -->
      <el-dialog title="修改角色信息" :visible.sync="editDialogVisible" width="40%" @close='editRolesClose'>
        <el-form  :model="editRolesInfo"  ref="editRolesRef" label-width="80px" >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editRolesInfo.roleName" ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesInfo.roleDesc"></el-input>
          </el-form-item>
        </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sureEdit">确 定</el-button>
          </span>
      </el-dialog>

      <el-dialog title="权限列表" :visible.sync="manageDialogVisible" width="50%" @close='manageClose'>
          <manage-rights :rightsTree='rightsList' :defKeys='defKeys' :rightId='rightId' ref='manageRef'></manage-rights>
          <span slot="footer" class="dialog-footer">
            <el-button @click="manageDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sureManage">确 定</el-button>
          </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>

// import RightsTag from './childcomps/RightsTag.vue'
import ManageRights from './childcomps/ManageRights'


export default {
  name: 'Roles',
  components: {
    // RightsTag,
    ManageRights
  },
  data() {
    return {
      rolesList: [], //角色列表
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      addDialogVisible: false, //添加角色对话框的显示与隐藏
      editDialogVisible: false, //修改角色对话框的显示与隐藏
      editRolesInfo: {},
      manageDialogVisible: false, //分配权限对话框的显示与隐藏
      rightsList: [], //数据库中所有权限列表
      rightId: '' , //当前点击的角色的id
      defKeys: [], //三级权限的数组
    }
  },
  created() {
    this.getRolessList()
  },
  methods: {
    async getRolessList() {
      const {data: res} = await this.$http.get('roles')
      //console.log(res)
      if(res.meta.status != 200) return this.$message.error('获取权限列表失败！');
      this.rolesList = res.data
    },
    addRoles() {
      this.$refs.addRolesRef.validate(async valid => {
        if(!valid) return 
        const {data: res} = await this.$http.post('roles', this.addRolesForm)
        if(res.meta.status != 201) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.getRolessList()
        this.addDialogVisible = false        
      })
    },
    addRolesClose() {
      this.$refs.addRolesRef.resetFields()
    },
    //点击修改按钮
    async editRoles(id) {
      const {data: res} = await this.$http.get('roles/' + id) //查询要修改角色的信息
      console.log(res)
      if(res.meta.status != 200) return this.$message.error('查询角色信息失败！');
      this.editRolesInfo = res.data
      this.editDialogVisible = true
    },
    //修改角色信息对话框关闭事件
    editRolesClose() {
      this.$refs.editRolesRef.resetFields() //重置表单
    },
    //点击修改对话框的确认按钮
    sureEdit() {
      this.$refs.editRolesRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.put('roles/' + this.editRolesInfo.roleId, {  
            roleName: this.editRolesInfo.roleName,
            roleDesc: this.editRolesInfo.roleDesc    
        })
        if(res.meta.status != 200) return this.$message.error('更新角色信息失败！')
        this.$message.success('更新角色信息成功！')
        this.getRolessList()    //重新获取更新后的页面
        this.editDialogVisible = false //关闭对话框
      })
    },
    //删除权限
    async deleteRight(role, rightId) {
      const confirmResult = await this.$confirm('是否删除此权限?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult != 'confirm') return this.$message.info('已取消删除！')
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status != 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      role.children = res.data
    },
    //点击 分配权限按钮事件
    async manageRightsDialog(role) {
      this.rightId = role.id
      const {data: res} = await this.$http.get('rights/tree')
      if(res.meta.status != 200) return this.$message.error('获取权限列表失败！')
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys) //调用getLeafKeys 函数
      this.manageDialogVisible = true
    },
    // 获取当前角色所拥有的三级权限
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node,arr) { 
      if(!node.children){
        return arr.push(node.id)  //如果当前节点没有 children，则节点为三级节点， 把节点的id加入数组中
      } 
      node.children.forEach(item => this.getLeafKeys(item,arr));
    },
    //对话框关闭
    manageClose() {
      this.defKeys = []
    },
    //对话框确认按钮点击
    sureManage() {
      this.$refs.manageRef.sureManage()
      this.getRolessList()
      this.manageDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }
  .top {
    border-top: 1px solid #eee;
  }
  .bottom {
    border-bottom: 1px solid #eee;
  }
  .tag-center {
    display: flex;
    align-items: center;
  }
</style>