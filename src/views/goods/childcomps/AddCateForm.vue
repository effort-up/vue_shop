<template>
  <div>
    <el-form :model="addCateForm" :rules="addCaterules" ref="addCateRef" label-width="100px">
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <!-- 级联选择器 -->
        <el-cascader v-model="selectkeys" :options="cateList"
            :props="cascaderProps" @change="handleChange" clearable change-on-select>
      </el-cascader>
      </el-form-item>
      
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'AddCate',
  data() {
    return {
      addCateForm: { //输入框的格式
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCaterules: { // 输入框规则
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      selectkeys: [], //用来存放级联选择器所选选项的 id
      cascaderProps: { // 级联选择器选项的规则，
        value: 'cat_id',  //选项的值为 id
        label: 'cat_name', //选项展示的值为 name
        children: 'children', // 下一级关系通过 children 来寻找
      }
    }
  },
  props: {
    cateList:{ //数据库中所有分类
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    //当级联选择器发生变化
    handleChange() { 
      console.log(this.selectkeys)
      if(this.selectkeys.length > 0) { //如果 seleckeys数组的长度大于 0 ，说明级联选择器中有选项，把数组中的最后一项给分类模板的父级
        this.addCateForm.cat_pid = this.selectkeys[this.selectkeys.length -1]
        this.addCateForm.cat_level = this.selectkeys.length
        return 
      }
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCateClose() {
      this.$refs.addCateRef.resetFields()
      this.selectkeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    sureCate() {
      this.$refs.addCateRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.post('categories', this.addCateForm)
        if(res.meta.status != 201) return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')       
      })  
    }
  }
}  
</script>
<style lang="less" scoped>
  .el-cascader{
    width: 100%;
  }
</style>