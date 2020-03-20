<template>
    <div class="refund">
        <el-table class="refund-table" border :data="list" style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" align="center" ></el-table-column>
            <el-table-column prop="price" label="支付金额" align="center" ></el-table-column>
            <el-table-column prop="createTime" label="下单时间" align="center" ></el-table-column>
            <el-table-column prop="receivingName" label="收货人" align="center" ></el-table-column>
            <el-table-column prop="receivingPhone" label="收货人电话" align="center" ></el-table-column>
            <el-table-column prop="receivingAddress" label="收货地址" align="center" ></el-table-column>
            <el-table-column prop="logisticsNo" label="物流单号" align="center" ></el-table-column>
            <el-table-column prop="logisticsName" label="物流公司" align="center" ></el-table-column>
            <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
                <el-button v-if="scope.row.status==3" type="text" size="mini" @click="deliver(scope.row)">退款</el-button>
                <span v-if="scope.row.status==4">退款成功</span>
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
        this.refundList();
    },
    methods:{
        refundList() {
            this.$api('queryrefund',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize}}).then((res)=>{
                console.log(res);
                var data = res.data.data;
                this.list = data.records;
                this.searchObj.pageNum = parseInt(data.current);
                this.searchObj.pageSize = parseInt(data.size);
                this.searchObj.totalCount = parseInt(data.total)
            })
        },
        deliver(scope) {//退款
            this.$api('updateorderrefund',{params:{orderId:scope.id}}).then((res)=>{
                if(res.data.retCode == 200) {
                    this.$message({
                        message:'退款成功'
                    })
                    this.refundList();
                }else {
                    this.$message({
                        message:'退款失败'
                    })
                }
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
    }
    .refund-table{
        width: 100%;
        height: calc(100% - 130px);
         /* border:1px solid blue; */
    }
</style>


