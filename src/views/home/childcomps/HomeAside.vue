<template>
  <div>
    <div class="toggle-button" @click="toggle">|||</div>
    <!--  unique-opened 是否只保持一个子菜单的展开， 默认是 false ，这里只需写上就会被认为是 unique-opened = true
          collapse 是否水平折叠收起菜单
          collapse-transition	是否开启折叠动画
     -->
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#1E90FF"
      unique-opened
      :collapse='isCollapse'
      :collapse-transition='false'
      router
      :default-active='activePath'
    >
      <!-- 一级菜单 
            :index="item.id  给每个一级菜单绑定一个标识，这样当我们点击某一个一级菜单时，才不会发生所有的一级菜单都展开
      -->
      <el-submenu :index="item.id + ''" v-for="item in munList" :key="item.id">
        <template slot="title">
          <!-- 因为每个一级菜单的图标都不相同，这里动态绑定到 iconsObj对象中， 根据每个一级菜单的 id 值，来获取对象中不同的图标-->
          <i :class="iconsObj[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单
              :index="'/' +item.path + ''" 为每个二级菜单设置路由路径，路径是由每个二级菜单的 path组成的，
         -->
        <el-menu-item
          :index="'/' +item.path + ''"
          v-for="item in item.children"
          :key="item.id"
          @click="active('/' +item.path)"
        >
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ item.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "HomeAside",
  data() {
    return {
      iconsObj: {
        125: "el-icon-s-custom",
        103: "el-icon-coin",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-marketing",
      },
      isCollapse: false,
      activePath: ''
    };
  },
  props: {
    munList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    toggle() {  //左侧导航栏的展开与收缩
      this.isCollapse = !this.isCollapse
      this.$emit('toggle', this.isCollapse)
    },
    active(activePath){
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
};
</script>
<style lang="less" scoped>
.el-menu {
  border: none;
}
.toggle-button{
  height: 30px;
  color: #fff;
  line-height: 30px;
  text-align: center;
  font-size: 15px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>