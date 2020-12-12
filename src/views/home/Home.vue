<template>
  <el-container class="home">
    <el-header>
      <home-head></home-head>
      </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px' ">
        <home-aside :munList='munList' @toggle='toggle'></home-aside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import HomeHead from './childcomps/HomeHead'
import HomeAside from './childcomps/HomeAside'

export default {
  name: "Home",
  components: {
    HomeHead,
    HomeAside
  },
  data() {
    return {
      munList: [],
      isCollapse:false
    }
  },
  created() {
   this.getMunList()
  },
  methods: {
    async getMunList() {  // 请求左侧导航栏的数据
      const{data: res}  = await this.$http.get('/menus')
      //console.log(res)
      if(res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.munList = res.data
    },
    // 左侧导航栏的展开与收缩
    toggle(isCollapse){
      this.isCollapse = isCollapse
    }
  }
};
</script>
<style lang="less" scoped>
  .home{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    padding-left: 10px;
    padding-bottom: 5px;
    padding-top: 5px;
  }
  .el-aside{
    background-color: #333744;
    
  }
  .el-main{
    background-color: #eaedf1;
  }
</style>