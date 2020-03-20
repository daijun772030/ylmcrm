<template>
    <div>
        <el-table class="refund-table"  border :data="list" style="width: 100%" >
            <el-table-column prop="id" label="诉求人id" align="center" ></el-table-column>
            <el-table-column prop="content" label="诉求内容" align="center" ></el-table-column>
            <el-table-column prop="createTime" label="诉求时间" align="center" ></el-table-column>
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
        this.refundList();
    },
    methods:{
        refundList() {
            this.$api('selecrfeedback',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize}}).then((res)=>{
                console.log(res);
                var data = res.data.data;
                this.list = data.records;
                this.searchObj.pageNum = parseInt(data.current);
                this.searchObj.pageSize = parseInt(data.size);
                this.searchObj.totalCount = parseInt(data.total)
            })
        },
        handleSizeChange (val) {//改变每页显示多少条
                this.searchObj.pageSize = val;
                this.refundList();
            },
        handleCurrentChange (val) { //改变前往多少页
            this.searchObj.pageNum = val;
            this.refundList();
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



