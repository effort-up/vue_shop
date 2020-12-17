<template>
  <div>
     <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable='false' show-icon></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader v-model="selectkeys" :options="cateList"
            :props="cascaderProps" @change="handleChange" clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 子组件 -->
      <!-- <tab :selectkeys='selectkeys' :tabRes='tabRes' ref='tabRef' @handleClick='getParams' @clearTabRes='clearTabRes'></tab> -->
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type='primary' :disabled='isBtnDisabled' @click="addDialogVisible = true">添加参数</el-button>
          <el-table :data="manyTabList" style="width: 100%" border>
            <!-- 扩展下拉框 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close='handleInputClose(index,scope.row)'>
                  {{item}}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" >
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template> 
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type='primary' :disabled='isBtnDisabled' @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="onlyTabList" style="width: 100%" border>
            <!-- 扩展下拉框 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close='handleInputClose(index,scope.row)'>
                  {{item}}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + textTitle" :visible.sync="addDialogVisible" width="40%" @close='addFormClose'>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改' + textTitle" :visible.sync="editDialogVisible" width="40%" @close='editFormClose'>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

// import Tab from './childcopms/Tab.vue'
export default {
  name: 'Params',
  // components: { 
  //   Tab 
  // },
  data() {
    return {
      // tabRes: [],
      selectkeys: [],  //级联选择框中用户选择的选项的 id
      cateList: [],   //数据库中所有的分类
      cascaderProps: {  
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many', //标签页的状态,当前活跃的是哪一个选项卡
      manyTabList: [], // 在一级和二级分类确定的情况下，动态参数的数组
      onlyTabList: [], // 在一级和二级分类确定的情况下，静态属性的数组
      addDialogVisible:false, //添加属性对话框的显示与隐藏
      addForm: { //添加属性表单的格式
        attr_name: ''
      },
      addFormRules: { //添加属性输入框的规则
        attr_name: [
          { required: true, message: '请输入属性', trigger: 'blur' },
        ]
      },
      editDialogVisible: false, //编辑属性对话框的状态
      editForm: {},  // 编辑属性表单
      editFormRules: {  //编辑属性输入框的规则
        attr_name: [
          { required: true, message: '请输入属性', trigger: 'blur' },
        ]
      },
    }
  },
  computed: {
    isBtnDisabled() { //添加属性按钮的状态(可用，不可用)，
      if(this.selectkeys.length != 3) return true  // 当级联选择器中没有选到三级分类时，返回 true ，按钮不可用
      return false
    },
    textTitle() { //对话框的标题
      if(this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取级联选择器的分类数据
    async getCateList() {
      const {data: res} = await this.$http.get('categories')
      if(res.meta.status != 200) return 
      this.cateList = res.data
    },
    // 级联选择器选项发生改变时
    handleChange() {
      this.getParams()
    },
    //获取三级分类对应的动态参数和静态属性
    async getParams() {
      if(this.selectkeys.length != 3) {
        this.selectkeys = []
        this.manyTabList = []
        this.onlyTabList = []
        return 
      }
      const {data: res} = await this.$http.get(`categories/${this.selectkeys[2]}/attributes`,{
        params: {sel: this.activeName}  //传入选项卡的状态，以此来区分要获取的是哪一个选项卡的数据
      })
      if(res.meta.status != 200) return this.$message.error('获取数据失败！');
      res.data.forEach( item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      });
      if(this.activeName === 'many') {  //如果条件为 true 则说明当前处在动态参数选项卡下，所以把请求到的数据，赋值给动态参数数组
        this.manyTabList = res.data
      }else {
        this.onlyTabList = res.data  //条件为 false 则说明当前处在静态属性选项卡下，所以把请求到的数据，赋值给静态属性数组
      }
      console.log(res.data)
      
    },
    //选项卡的点击事件，(切换选项卡)
     handleClick() {
      this.getParams()  
      //console.log(this.activeName)
    },
    //添加属性表单关闭
    addFormClose() {
      this.$refs.addFormRef.resetFields()
    },
    //添加属性对话框的确认按钮点击事件
    sureParams() {
      this.$refs.addFormRef.validate(async valid => { //表单预验证
        if(!valid) return
        const {data: res} = await this.$http.post(`categories/${this.selectkeys[2]}/attributes`,{
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if(res.meta.status != 201) return this.$message.error('添加失败！')
        this.$message.success('添加成功！')
      })
      this.getParams()
      this.addDialogVisible = false
    },
    //编辑属性按钮的点击事件
    async editParams(attr_id) {
      const {data: res} = await this.$http.get(`categories/${this.selectkeys[2]}/attributes/${attr_id}`,{
        params: { attr_sel: this.activeName }
      })
      if(res.meta.status != 200) return this.$message.error('获取失败！')
      console.log(res)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //编辑属性表单的关闭
    editFormClose() {
      this.$refs.editFormRef.resetFields()
    },
    //编辑属性对话框确认按钮的点击
    sureEdit() {
       this.$refs.editFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.put(`categories/${this.selectkeys[2]}/attributes/${this.editForm.attr_id}`,{
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if(res.meta.status != 200) return this.$message.error('更新失败！')
        this.$message.success('更新成功！')
      })
  
      this.getParams()
      this.editDialogVisible = false
    },
    //删除属性按钮的点击
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(confirmResult != 'confirm') return this.$message.info('已取消删除！')
      const {data: res} = await this.$http.delete(`categories/${this.selectkeys[2]}/attributes/${attr_id}`)
      if(res.meta.status != 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getParams()
    },
    //添加属性输入框的显示(添加新的tag标签)
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => { //在输入框渲染完成后，执行函数 
          this.$refs.saveTagInput.$refs.input.focus();  //输入框自动获取焦点
        });
    },
    //tag 输入框 按下回车键或失去焦点时，触发此事件
    handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0){ //输入框的值去除空格后的长度为 0 ,
        row.inputValue = ''
        row.inputVisible = false
        return 
      }
      row.attr_vals.push(row.inputValue.trim()) 
      row.inputValue = ''
      row.inputVisible = false
      this.saveInputValue(row)
    },
    // 把最新的 attr_vals 属性值 保存到数据库中
    async saveInputValue(row) {
      const {data: res} = await this.$http.put(`categories/${this.selectkeys[2]}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if(res.meta.status != 200) return this.$message.error('保存失败！')
      this.$message.success('保存成功！')
    },
    //删除 tag 标签
    handleInputClose(index,row) {
      row.attr_vals.splice(index, 1) //删除数组中的数据，从下标为 index的值开始，删除一个
      this.saveInputValue(row)
    } 

  }
}
</script>
<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0;
  }
  .el-tag {
    margin: 10px;
  }
  .input-new-tag {
    width: 150px;
  }
</style>