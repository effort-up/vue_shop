<template>
  <div>
     <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter='20'>
        <el-col :span='6'>
          <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear='getGoodsList'>
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type='primary' @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->     
      <el-table :data="goodsList" border style="width: 100%">
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width='75px'>
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width='160px'>
          <!-- 时间过滤 时间戳变为我们想要的时间格式-->
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column  label="操作" width='130px'>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="deleteGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'List',
  data() {
    return {
      queryInfo: { //请求体参数
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [], // 数据库中所有商品
      total: 0  //总的数量
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //获取商品列表
    async getGoodsList() {
      const {data: res} = await this.$http.get('goods',{params: this.queryInfo})
      if(res.meta.status != 200) return this.$message.error('获取商品列表失败！');
      //console.log(res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 当分页 每个页面要展示的数据数量发生变化时，触发此函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 当分页 点击新的一页时，触发此函数，
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage  //改变请求体中的页码
      this.getGoodsList() //在根据请求体中的页码请求新的一页的数据
    },
    // 根据id 删除商品
    async deleteGoods(id) {
      const confirmResult = await this.$confirm('是否删除该商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult != 'confirm') return this.$message.info('以取消删除！')
        const {data: res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status != 200) return this.$message.error('删除商品失败！')
        this.$message.success('删除成功！')
        this.getGoodsList()
    },
    //点击添加是商品按钮，跳转路由到 /goods/add 页面
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped>

</style>