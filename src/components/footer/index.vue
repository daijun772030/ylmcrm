<template>
  <div class="paging">
    <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage1"
      :page-sizes="[10, 20 , 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    currentPage1: 1,
    currentPage2: 2,
    currentPage3: 3,
    currentPage4: 4,
    total:0
    }
  },
  created () {
    // var _this = this
    // _this.$axios.get('https://www.easy-mock.com/mock/5b3cb20beaf38c457dee359c/example/mock').then((data)=> {
    //   console.log(data.data.data.projects.length)
    //   _this.total = data.data.data.projects.length
    // })
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);//多少条一页
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);//这里是显示当前是第几页
    }
  }
}
</script>

<style lang="less" scoped>
    .paging{
      box-sizing: border-box;
      width: 100%;
      height: 50px;
      padding: 0 15px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0 5px 10px -2px #ccc;
    }
</style>


