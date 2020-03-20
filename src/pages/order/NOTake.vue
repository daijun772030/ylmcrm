<template>
    <div class="home">
    <!-- 搜索框的展示  -->
        <el-form :inline="true" :model="formObj" label-width="5px" size="mini"  class="searchForm">
            <el-form-item class="float_left">
                <el-input placeholder="请输入订单手机号" v-model="formObj.val" clearable></el-input>
            </el-form-item>
            <el-form-item class="float_left">
                <el-button @click="earchForm" type="primary">确定</el-button>
            </el-form-item>
        </el-form>
    <!-- 表格的展示 -->
        <el-table
            :data="list"
            empty-text="没有新东西"
            v-loading="loading" 
            :default-sort = "{prop: 'condition', order: 'descending'}"
            element-loading-text="加载中..."
            style="
            height: calc(100% -130px)"
            class="home-table">
            <el-table-column prop="orderNum" align="center" label="订单号"></el-table-column>
            <el-table-column prop="commodityName"  align="center" label="商品名称"></el-table-column>
            <el-table-column prop="address" align="center" label="客户地址"></el-table-column>
            <el-table-column prop="phone" align="center" label="客户电话"></el-table-column>
            <el-table-column prop="shName" align="center" label="客户姓名"></el-table-column>
            <el-table-column prop="startTime" align="center" label="取件时间"></el-table-column>
            <el-table-column prop="endTime" align="center" label="送件时间"></el-table-column>
            <el-table-column prop="ifhave" align="center" label="取衣服状态">
                <template slot-scope="scope">
                    <span v-if='scope.row.ifhave==0'>未取衣服</span>
                    <span v-if='scope.row.ifhave==1'>已取衣服</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" align="center" label="支付状况">
                <template slot-scope="scope"> 
                <span v-if="scope.row.status==0">未支付</span>
                <span v-if="scope.row.status==1">支付失败</span>
                <span v-if="scope.row.status==2">支付成功</span>
              </template>
            </el-table-column>
            <el-table-column prop="payMethod" align="center" label="支付方式">
                <template slot-scope="scope"> 
                <span v-if="scope.row.payMethod==0">微信支付</span>
                <span v-if="scope.row.payMethod==1">支付宝支付</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
            <el-table-column prop="remark" align="center" label="客户备注"></el-table-column>
            <el-table-column
             align="center"
             width="200px"
             label="操作">
            <template slot-scope="scope" width="80%">
                <el-button
                size="mini"
                @click="ceshiDin(scope)">取衣完成</el-button>
            </template>
            </el-table-column>
        </el-table>
        <div class="pageination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchObj.pageNum"
                :page-sizes="[10, 15, 20, 35, 100]"
                :page-size="searchObj.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="searchObj.totalCount">
            </el-pagination>
        </div>
        <audio src="/static/audio/newgoods.1.mp3"  :id="music" hidden></audio>
    </div>
</template>
<script>
    // import DjObject from './object.js';
    export default {
        data(){
            return {
                music:'music',
                formObj:{//搜索框值
                    val:null
                },
                playFlay:false,
                autoplay:' ',
                loading:false,
                list:[],
                arrObj:[],
                searchObj:{
                pageSize:10,
                pageNum:1,
                totalCount:0
                },
                newTotalCount:null
            }
        },
        created () {
            // this.getList()
            this.orderAll();
            this.timer = setInterval(() =>{
                this.orderAll();
            },60000)
        },
        // beforeUpdate () {
        //     this.$watch("newTotalCount",function(val) {
        //         this.$nextTick(function(){
        //         var audio = document.getElementById('music');
        //         audio.play();
        //         })
        //     })
        // },
        methods: {
            ceshiDin (scope) {//测试点击过后洗衣状态是不是要改变
                this.$api('updataByOrder',{params:{orderId:scope.row.id}}).then((res)=>{
                    if(res.data.retCode ==200) {
                        this.orderAll();
                    }
                })
            },
            earchForm() {//搜索函数
                // console.log('搜索按钮')
                this.$api('orderAll',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize,phone:this.formObj.val,type:"1"}}).then((res)=>{
                    var list = res.data.data.list;
                    for (var i = 0;i<list.length;i++) {
                        this.list =[];
                      if(list[i].ifhave==0) {
                        this.list.push(list[i])
                      }
                    }
                    this.searchObj.pageSize = res.data.data.pageSize;
                    this.searchObj.pageNum = res.data.data.pageNum;
                    this.searchObj.totalCount = res.data.data.total;
                    console.log(res);
                })
            },
            //点击接单以后前往待发货状态
            handleEdit(scope) {
                console.log(scope)
                this.$api("orderType",{params:{type:"1",orderId:scope.row.id,outTradeNo:scope.row.orderNum}}).then((res)=>{
                    // debugger;
                    console.log(res)
                    var num = scope.$index
                    console.log(num)
                    this.list[num] = null;
                    this.music = "music2"
                    this.orderAll();
                })
            },
            //查询所有订单
            orderAll () {
                this.$api('orderAll',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize,type:"1"}}).then((res)=>{
                    var list = res.data.data.list;
                    this.list =[];
                    for (var i = 0;i<list.length;i++) {
                      if(list[i].ifhave == 0) {
                        this.list.push(list[i])
                      }
                    }
                    this.searchObj.pageSize = res.data.data.pageSize;
                    this.searchObj.pageNum = res.data.data.pageNum;
                    this.searchObj.totalCount =res.data.data.total;
                    console.log(res);

                })
            },
            handleSizeChange (val) {//改变每页显示多少条
                this.list = [];
                this.searchObj.pageSize = val;
                this.orderAll()
            },
            handleCurrentChange (val) { //改变前往多少页
                this.list = [];
                this.searchObj.pageNum = val;
                this.orderAll()
            }
        }
    }
</script>
<style lang="less" scoped>
    .home{
        width: 100%;
        height:100%;
        text-align: center;
        color: black;
        color: rgba(0, 0, 0, 0.349)
        // background-color: aqua;
    }
    .searchForm{
        padding: 10px;

    }
    .searchForm1{
        display: flex;
        flex-wrap: wrap;
        justify-content:center;
        align-items: center;
    }
    .pageination{
        margin-top:10px;
    }
</style>
<style lang="less">
    .home-table{
        width: 100%;
        height: calc(100% - 130px);
        // border:1px solid blue;
    }
    .block{
        padding:10px;
    }
</style>



