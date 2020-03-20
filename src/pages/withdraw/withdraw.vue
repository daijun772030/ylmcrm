<template>
    <div>
        <el-table class="refund-table"  border :data="list" style="width: 100%" >
            <el-table-column prop="account" label="提现账户" align="center" ></el-table-column>
            <el-table-column prop="name" label="提现人" align="center" ></el-table-column>
            <el-table-column prop="money" label="提现金额" align="center" ></el-table-column>
            <el-table-column prop="createTime" label="提现时间" align="center" ></el-table-column>
            <el-table-column prop="createTime" label="是否已提现" align="center" >
                <template slot-scope="scope">
                    <span v-if="scope.row.status==0">未提现</span>
                    <span v-if="scope.row.status==1">已提现</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
                <el-button v-if="scope.row.status==0" type="text" size="mini" @click="deliver(scope.row)">确认提现</el-button>
                <span v-if="scope.row.status==1">提现成功</span>
            </template>  
            </el-table-column>
        </el-table>
        <div class="pageination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchObj.pageNum"
                :page-sizes="[10, 20, 30, 40, 50]"
                :page-size="searchObj.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="searchObj.totalCount">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            list:[],//退款订单
            searchObj:{//分页数据
                pageSize:10,
                pageNum:1,
                totalCount:0
            },
        }
    },
    created() {
        this.querywidthdraw();
    },
    methods:{
        querywidthdraw() {
            this.$api('selectwithdrawal',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize}}).then((res)=>{
                console.log(res);
                var data = res.data.data;
                this.list = data.records;
                this.searchObj.pageNum = parseInt(data.current);
                this.searchObj.pageSize = parseInt(data.size);
                this.searchObj.totalCount = parseInt(data.total)
            })
        },
        deliver(scope) {//确认提现
            this.$api('delwithdrawal',{params:{id:scope.id}}).then((res)=>{
                if(res.data.retCode == 200 ) {
                    this.$message({
                        message:'提现成功'
                    })
                    this.querywidthdraw();
                }else {
                    this.$message({
                        message:'操作失败，请重试'
                    })
                }
            })
        },
        handleSizeChange (val) {//改变每页显示多少条
                this.searchObj.pageSize = val;
                this.querywidthdraw();
            },
        handleCurrentChange (val) { //改变前往多少页
            this.searchObj.pageNum = val;
            this.querywidthdraw();
        }
    }
}
</script>
<style  scoped>
    .refund {
        width: 100%;
        height:100%;
        text-align: center;
        color: black;
        color: rgba(0, 0, 0, 0.349)
    };
    .refund-table{
        width: 100%;
        height: calc( 100% - 130px );
         /* border:1px solid blue; */
    }
    .pageination{
        margin-top:10px;
    }
</style>



