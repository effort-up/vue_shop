<template>
  <div class="header">
    <div class="left">
      <img src="~assets/img/tianmao.png" alt="logo">
      <span>电商管理系统</span>
    </div>
    <el-button type="info"  @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  name: 'HomeHead',
  methods: {
    //退出
    logout() {
      //清除 token值
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
  .header{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 60px;
    
   
  }
  .left{
    height: 100%;
    font-size: 25px;
    color: #fff;
    display: flex;
    align-items: center;

    span{
      margin-left: 10px;
    }
  }
  .left img {
    height: 100%;
  }
</style>