<template>
  <div>
     <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 警告信息 -->
      <el-alert title="添加商品信息" type="info" show-icon :closable='false' center></el-alert>
      <!-- 步骤条  :active="parseInt(activeStep)"字符串转为数字 还可以这样写 :active="activeStep - 0" align-center 步骤条居中-->
      <el-steps :space="200" :active="parseInt(activeStep)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单  label-position='top' label显示在输入框上边 而不是右侧-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position='top'>
        <!-- 标签页  :tab-position="'left'" 标签页显示在左侧-->
      <el-tabs :tab-position="'left'"  v-model="activeStep" :before-leave='beforeLeaveTabs' @tab-click='changeTabs'>

        <el-tab-pane label="基本信息" name='0'>
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type='number'></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type='number'></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type='number'></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_number">
            <el-cascader v-model="addForm.goods_cat" :options="cateList" 
                      :props="cascaderProps" @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="商品参数" name='1'>
          <el-form-item v-for="item in manyTabList" :key='item.attr_id' :label='item.attr_name'>
            <el-checkbox-group v-model="item.attr_vals" >
              <el-checkbox :label="item2" v-for="(item2, index) in item.attr_vals" :key='index' border size='mini'> </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="商品属性" name='2'>
          <el-form-item v-for="item in onlyTabList" :key='item.attr_id' :label='item.attr_name'>
            <el-input :value='item.attr_vals'></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="商品图片" name='3'>
          <!-- upload 组件(上传) -->
          <el-upload class="upload-demo" :action= actionURL :on-preview="handlePreview"
            :on-remove="handleRemove"  list-type="picture" :headers='headersObj' :on-success='uploadSuccess'>
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>

        <el-tab-pane label="商品内容" name='4'>
           <!-- 富文本编辑器 -->
            <quill-editor  v-model="addForm.goods_introduce"/>
            <el-button type='primary' class="btnAdd" @click="add">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%" >
      <img :src="preView" alt="图片" class="picture">
    </el-dialog> 
  </div>
</template>
<script>
// 加载插件
import _ from 'lodash'

export default {
  name: 'Add',
  data() {
    return {
      activeStep: '0',  //控制标签页与步骤条的状态，联动效果
      addForm: { 
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 1,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: { //表单规则
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价值', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
      },
      cateList: [],  //分类数据
      cascaderProps: {   //级联选择器的规则
        expandTrigger: 'hover' ,  //hover 触发下一级分类
        value: 'cat_id',     // 选项值为 id 值
        label: 'cat_name',   // 选项为 分类名称
        children: 'children'  //父子层级关系： 根据 children 来判断
      },
      manyTabList: [],  //动态参数数据
      onlyTabList: [],  //静态属性数据
      actionURL: 'https://www.liulongbin.top:8888/api/private/v1/upload', // 上传的图片要保存到服务器的绝对路径
      headersObj: { //设置上传图片的 ajax 网络请求的 请求头 ：携带 token
        Authorization: window.sessionStorage.getItem('token')
      },
      preView: '', //图片绝对路径
      previewDialogVisible: false  //预览图片的对话框的状态
    }
  },
  computed: { 
    cateId() {
      if(this.addForm.goods_cat.length === 3) { // 判断 级联选择器是否选择三级分类，
        return this.addForm.goods_cat[2]  //返回 三级分类的 id
      }
      return null  
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类数据
    async getCateList() {
      const {data: res} = await this.$http.get('categories')
      if(res.meta.status != 200) return 
      this.cateList = res.data
      //console.log(res)
    },
    // 级联选择器选项的改变
    handleChange() {
      if(this.addForm.goods_cat.length !== 3) { //如果没有选择到三级分类
        this.addForm.goods_cat = [] //清空表单分类数组(阻止级联选择器选择一级和二级分类)
        return 
      }
      //console.log(this.addForm.goods_cat)
    },
    //  即将离开旧标签页，去新标签页时触发此函数
    beforeLeaveTabs(activeName, oldActiveName) { //activeName 当前要去往的标签页的 name, oldActiveName 即将离开的标签页的 name
      if(this.activeStep === '0' && this.addForm.goods_cat.length !== 3) { //当在第一个标签页且 级联选择器没有选择三级分类时
        this.$message.error('请先选择商品分类')
        return false  // 当 beforeLeaveTabs 函数返回 false 时，会阻止跳转到其他标签页
      }
    },
    // tabs 标签页发生改变
    async changeTabs() {
      if(this.activeStep === '1') { //去第二个标签页
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params: {sel: 'many'}
        })
        if(res.meta.status != 200) return this.$message.error('获取参数列表失败！')
        //console.log(res)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        })
        this.manyTabList = res.data
        console.log(this.manyTabList)
      }else if(this.activeStep === '2') { //去第三个标签页
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params: {sel: 'only'}
        })
        if(res.meta.status != 200) return this.$message.error('获取参数列表失败！')
        //console.log(res)
        // res.data.forEach(item => {
        //   item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // })
         this.onlyTabList = res.data
         console.log(this.onlyTabList)
      }
    },
    //图片预览操作
    handlePreview(file) {
      //把图片的绝对路径保存起来
      this.preView = file.response.data.url
      this.previewDialogVisible = true

    },
    //移除图片操作
    handleRemove(file) {  //会默认传递一个 文件信息的参数
      //console.log(file)
      //1.先拿到对应图片的临时地址
      const filePath = file.response.data.tmp_path  
      //2.根据临时地址，找到图片在 pics 数组中的索引值
      const i = this.addForm.pics.findIndex(x => { //findIndx 根据条件，返回符合条件的元素的下标
        x.pics = filePath
      })
      //3.根据索引值删除数组中的图片
      this.addForm.pics.splice(i, 1)
      //console.log(this.addForm)
    },
    //图片上传成功
    uploadSuccess(response) {
      //console.log(response)
      const picInfo = {pics: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      //console.log(this.addForm)
    },
    // 添加商品的按钮
    add() {
      this.$refs.addFormRef.validate(async valid => { //表单预验证
        if(!valid) return this.$message.error('请填写必要的内容！')
        const form = _.cloneDeep(this.addForm) //深拷贝
        form.goods_cat = form.goods_cat.join(',') //把数组转换为字符串，并且每个元素以 , 分隔开来
        
        this.manyTabList.forEach(item => { //遍历循环动态参数数组，把每一个元素中的 id 和 vals 值取出，放入一个对象中，在添加到 attrs数组中
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ') //attr_vals 为数组，所以转换为字符串
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTabList.forEach(item => { //遍历循环静态属性数组，把每一个元素中的 id 和 vals 值取出，放入一个对象中，在添加到 attrs数组中
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        const {data: res} = await this.$http.post('goods', form)
        if(res.meta.status != 201) return this.$message.error('添加商品失败！')
         this.$message.success('添加商品成功！')
        // this.$router.push('/goods')
        this.$router.push('/goods') 
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .el-checkbox{
    margin: 0 15px 10px 0 !important; 
  }
  .picture{
    width: 100%;
  }
  .btnAdd {
    margin-top: 15px;
  }
</style>