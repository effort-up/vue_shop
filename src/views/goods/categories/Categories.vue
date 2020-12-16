<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- tree-table 为插件，已在main.js中注册过 -->
      <tree-table :data="ctaeList" :columns="columns" :selection-type="false"
                  :expand-type="false" show-index border :show-row-hover="false">
        <!-- 自定义模板， 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
        </template>
        <template slot="operation">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="cateInfo.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="cateInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>  :addCateForm=''
      </div> -->
      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%" @close='addCateClose'>
        <add-cate :cateList='addCateList' ref="addCate"></add-cate>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>

import AddCate from './childcomps/AddCateForm.vue';

export default {
  name: "Categories",
  components: { 
    AddCate,
  },
  data() {
    return {
      cateInfo: {
        //请求商品分类时的请求体信息
        type: 3,
        pagenum: 1,
        pagesize: 4,
      },
      ctaeList: [], //数据库中的所有商品分类数据
      total: 0, // 数据库中分类的总数量，用来在页码区展示
      columns: [ //tree-table 每一列的格式
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
        },
      ],
      addDialogVisible: false, // 添加分类对话框的显示与隐藏
      addCateList: [],    // 数据库中所有的分类
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取主页面所有数据
    async getCateList() {
      const { data: res } = await this.$http.get("/categories", {
        param: this.cateInfo,
      });
      if (res.meta.status != 200) return this.$message.error("获取商品列表失败！");
      //console.log(res.data);
      this.ctaeList = res.data;
      this.total = res.data.length;
    },
    //当页面要展示的数据数量发生变化时，触发此方法
    // handleSizeChange(newSize) {
    //   this.cateInfo.pagesize = newSize
    //   this.getCateList()
    // },
    // //当前页码发生变化时，触发此方法
    // handleCurrentChange(newPage) {
    //   this.cateInfo.pagenum = newPage
    //   this.getCateList()
    // }
    //添加分类按钮的点击事件
    addCateDialog() {
      this.getAddCate() 
      this.addDialogVisible = true
    },
    //获取数据库中所有的一级和二级分类
    async getAddCate() {
      const {data: res} = await this.$http.get("/categories",{
        params: {type: 2} //一级和二级分类
      })
      if(res.meta.status != 200) return this.$message.error("获取商品列表失败！");
      //console.log(res)
      this.addCateList = res.data
      //console.log(this.addCateList)
    },
    sureCate() {
      this.$refs.addCate.sureCate()
      this.getCateList()
      this.addDialogVisible = false
    },
    addCateClose() {
      this.$refs.addCate.addCateClose()
    }

  },
};
</script>
<style lang="less" scoped>
.el-button {
  margin-bottom: 10px;
}
</style>