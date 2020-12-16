<template>
   <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
      <el-button type='primary' :disabled='isBtnDisabled'>添加参数</el-button>
      <el-table :data="manyTabList" style="width: 100%" border>
         <el-table-column type="expand"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="attr_name" label="参数名称" >
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
      <el-button type='primary' :disabled='isBtnDisabled'>添加属性</el-button>
      <el-table :data="onlyTabList" style="width: 100%">
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="attr_name" label="参数名称" >
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  name: 'Tab',
  data() {
    return {
      activeName: 'many',
      manyTabList: [],
      onlyTabList: []
    }
  },
  props: {
    selectkeys: {
      type: Array,
      default() {
        return []
      }
    },
    tabRes: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    isBtnDisabled() {
      if(this.selectkeys.length != 3) return true
      return false
    },
    
  },
  methods: {
    handleClick() {
      this.$emit('handleClick')
      console.log(this.activeName)
      if(this.activeName === 'many') {
        this.manyTabList = this.tabRes
        // this.$emit('clearTabRes',tabRes)
        console.log(this.activeName)
        //console.log(this.manyTabList)
      }else {
        this.onlyTabList = this.tabRes
        this.$emit('clearTabRes')
        console.log(this.activeName)
        //console.log(this.onlyTabList)
      }
      console.log(this.activeName)
    },
  
  }
}
</script>
<style lang="less" scoped>

</style>