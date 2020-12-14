<template>
  <div>
    <el-tree :data="rightsTree" :props="defaultProps" show-checkbox node-key='id' 
              :default-checked-keys='defKeys' default-expand-all ref="rightsRef"></el-tree>
  </div>
</template>
<script>
export default {
  name: 'ManageRights',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  props: {
    rightsTree: {
      type: Array,
      default() {
        return []
      }
    },
    rightId: {
      type: Number
    },
    defKeys: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    // 分配权限确认按钮点击
    async sureManage() {
      //所有选择和半选择节点的 key 值， html定义了 节点的 key值 为 id
      const keys = [
        //通过扩展运算符，把两个数组的值合并放入 keys 数组中
        ...this.$refs.rightsRef.getCheckedKeys(),  //element中 提供的方法，把所有选择的节点的 key值放入一个数组中，并返回数组
        ...this.$refs.rightsRef.getHalfCheckedKeys() //element中 提供的方法，把所有半选择的节点的 key值放入一个数组中，并返回数组
      ]
      //console.log(keys)
      const idStr = keys.join(',') //把数组中的值以 , 分开
      const {data: res} = await this.$http.post(`roles/${this.rightId}/rights`,{
        rids: idStr
      })
      if(res.meta.status != 200) return this.$message.error('操作失败！')
      this.$message.success('操作成功！')

    }
  }
}
</script>
<style lang="less" scoped>

</style>