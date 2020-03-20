<template>
    <div class="business">
       <el-form :inline="true" :model="formObj" label-width="5px" size="mini" @submit.native.prevent  class="searchForm">
            <el-form-item class="float_left">
                <el-input  placeholder="电话号码搜索" v-model="formObj.phone" @keyup.enter.native="search" clearable prefix-icon="el-icon-search" style="width:217px"></el-input>
            </el-form-item>
            <el-form-item class="float_left">
                <el-input placeholder="请输入订单号" v-model="formObj.merId" @keyup.enter.native="earchForm" clearable></el-input>
            </el-form-item>
            <el-form-item class="float_left">
                <el-date-picker
                v-model="formObj.startTime"
                clearable
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择开始时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item class="float_left">
                <el-date-picker
                v-model="formObj.endTime"
                type="datetime"
                clearable
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item class="float_left">
                <el-button type="primary" @click="search">确定</el-button>
            </el-form-item>
            <el-form-item class="float_left">
                <el-button @click="exportExcel" style="margin-top: 2px;" size="mini" type="primary">导出当前数据</el-button>
            </el-form-item> 
            <el-form-item class="float_right">
                <p>实到金额合计：{{countMoney}} 元</p>
            </el-form-item> 
        </el-form>

    <!-- table列表展示页 -->
        <el-table class="list-table"  height="calc(100%-160px)" :default-sort = "{prop: 'createTime', order: 'descending'}" border :data="list" id="rebateSetTable">
            <el-table-column prop="orderNum"  width="200px"  label="订单号" align="center"></el-table-column>
            <el-table-column prop="number"  label="商品名称" align="center"></el-table-column>
            <!-- <el-table-column prop="" label="商品类型" align="center"></el-table-column> -->
            <el-table-column prop="createTime" sortable width="200px"  label="订单生成时间" align="center"></el-table-column>
            <el-table-column prop="payMethod" align="center" label="支付方式">
                <template slot-scope="scope"> 
                    <span v-if="scope.row.payMethod==0">微信支付</span>
                    <span v-if="scope.row.payMethod==1">支付宝支付</span>
                </template>
            </el-table-column>
            <el-table-column prop="shName" label="客户姓名" align="center"></el-table-column>
            <el-table-column prop="phone" label="客户电话" align="center"></el-table-column>
            <el-table-column prop="actualMoney" label="应收金额" align="center"></el-table-column>
            <el-table-column prop="fee" label="商家优惠卷" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.fee>=0">0</span>
                </template>
            </el-table-column>
            <el-table-column prop="discountMoney" label="商家满减" align="center"></el-table-column>
            <el-table-column prop="money"  label="实收金额" align="center"></el-table-column>
            <el-table-column prop="extract" label="平台提成" align="center"></el-table-column>
            <el-table-column prop="account" label="实到金额" align="center"></el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="paginObj.pageNum"
            background
            :page-sizes="[10, 15, 20, 25,100]"
            :page-size="paginObj.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="paginObj.total">
            </el-pagination>
        </div>
        <audio src="/static/audio/newgoods.1.mp3"  id="music" hidden></audio>
    </div>
</template>
<script>
    import FileSaver from 'file-saver';
    import XLSX from 'xlsx';
    // 商家列表
    export default {
        data () {
            return {
            paginObj: {
                pagnum:1,
                pageSize:10,
                total:0
            },
            formObj:{
                phone:null,
                startTime:null,
                endTime:null,
                merId:null
            },
            countMoney:null,
            list:[],
            dataNum:[],//需要渲染的条数
            pagingnum: '',//一共有多少条
            tableData: []
        
        }
            },
        created(){
            // this.getList()
            this.getObj();
        },
        methods: {
            exportExcel () {//导出数据的函数
                /* generate workbook object from table */
                let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTable'));
                /* get binary string as output */
                let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '财务详情数据表格.xlsx');
                } catch (e)
                {
                    if (typeof console !== 'undefined')
                        console.log(e, wbout)
                }
                return wbout
            },
            search () {//搜索数据函数
                this.$api('orderAll',{params:{pageNum:this.paginObj.pagnum,phone:this.formObj.phone,createtime:this.formObj.startTime,endtime:this.formObj.endTime,ordernum:this.formObj.merId,pageSize:this.paginObj.pageSize,type:'10'}}).then((res)=> {
                    this.paginObj.pagnum = res.data.data.list.pageNum;
                    this.paginObj.pageSize = res.data.data.list.pageSize;
                    this.paginObj.total = res.data.data.list.total;
                    this.list = res.data.data.list.list;
                    this.formObj.phone = null;
                    this.formObj.startTime = null;
                    this.formObj.endTime = null;
                })
            },
            getObj () {//查询所有财务
                this.$api('orderAll',{params:{pageNum:this.paginObj.pagnum,pageSize:this.paginObj.pageSize,type:'10'}}).then((res)=> {
                    this.paginObj.pagnum = res.data.data.list.pageNum;
                    this.paginObj.pageSize = res.data.data.list.pageSize;
                    this.paginObj.total = res.data.data.list.total;
                    this.list = res.data.data.list.list;
                    this.countMoney = res.data.data.countMoney;
                    console.log(res)
                })
            },
            getList () {
            //这里用来组件一进来渲染的数据
                this.loading = true 
                this.$api('mock').then((data)=>{
                    console.log(data)
                this.tableData = data.data.data.projects
                for(let i = 0; i<this.paginObj.pageSize&&i<this.tableData.length;i++) {
                    this.dataNum.push(this.tableData[i])   
                }
                })
                this.loading = false
            },
            handleSizeChange(val) {
                this.paginObj.pageSize = val;
                this.getObj();
                // console.log(val)
            },
            handleCurrentChange (val) {
                this.paginObj.pagnum = val;
                this.getObj();
                // console.log(val)
            },
            getconfig () {
                this.dataNum = [1, 2, 3, 4, 5]
            }
        }
    }
</script>
<style lang="less" scoped>
    .business{
        height: 100%;
        width: 100%;
        // border:1px solid red;
        overflow: hidden;
    }
</style>
<style lang="less">
   .searchForm{
        padding:10px;
        // border: 1px solid blue;
        overflow: hidden;
    }
    .list-table{
        width:100%;
        height:calc(~"100% - 150px");
        margin-top: 10px;
        // background-color: red;
    }
    .list-tableTwo{
        width:200px;
        float: right;
        color:black;
    }
    .list{
        background-color: red;
    }
    
</style>

