<template>
    <div class="home">
        <!-- 搜索框的展示  -->

        <el-form :inline="true" :model="formObj" label-width="5px" size="mini" @submit.native.prevent  class="searchForm">
            <el-form-item class="float_left">
                <el-input placeholder="请输入订单手机号" v-model="formObj.val" @keyup.enter.native="earchForm" clearable></el-input>
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
                <el-button @click="earchForm" type="primary">确定</el-button>
            </el-form-item>
            <el-form-item class="float_right">
                <el-button @click="exportExcel" style="margin-top: 2px;" size="mini" type="primary">导出当前数据</el-button>
            </el-form-item>
        </el-form>
    <!-- 表格的展示 -->
        <el-table
            :data="list"
            empty-text="没有新东西"
            v-loading="loading" 
            :default-sort = "{prop: 'createTime', order: 'descending'}"
            element-loading-text="加载中..."
            style="
            height: calc(100% -60px)"
            class="home-table"
            id="rebateSetTable">
            <el-table-column prop="orderNum" align="center" label="订单号"></el-table-column>
            <el-table-column prop="number"  align="center" label="商品名称"></el-table-column>
            <el-table-column prop="address" align="center" label="客户地址"></el-table-column>
            <el-table-column prop="phone" align="center" label="客户电话"></el-table-column>
            <el-table-column prop="startTime" align="center" label="取件时间"></el-table-column>
            <el-table-column prop="endTime" align="center" label="送件时间"></el-table-column>
            <el-table-column prop="iftake" align="center" label="取送方式">
                <template slot-scope="scope">
                    <span v-if="scope.row.iftake==0">达达配送</span>
                    <span v-if="scope.row.iftake==1">用户自取自送</span>
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
            <el-table-column prop="createTime" sortable align="center" label="创建时间"></el-table-column>
            <el-table-column prop="remark" align="center" label="客户备注">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top">
                        <span>{{scope.row.remark}}</span>
                    </el-tooltip>
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
        <audio src="/static/audio/newgoods.1.mp3"  id="music" hidden></audio>
    </div>
</template>
<script>
    import DjObject from './object.js';
    import FileSaver from 'file-saver';
    import XLSX from 'xlsx';
    export default {
    data(){
        return {
            list:[],
            right:null,//订单是否接单
            searchObj:{
            pageSize:10,
            pageNum:1,
            totalCount:0
            },
            formObj:{//搜索框值
                val:null,
                startTime:null,
                endTime:null,
                merId:null
            },
            seachObject:{
                input:'',
                starDate: '',
                endDate: '',
                money: '',
                state: '',
                region: ''
            },
            scopeIndex:"",
            myObject:{},
            centerDialogVis: false,
            tableData:DjObject.tableData,
            loading: false,
            input1: '',
            formInline: {
                user: '',
                region: ''
            },
            paginObj: {
                pagnum:0,
                pageSize:3,
                currentPages: 1,
                currentPage: 1
            },
            addForm: {

            },
            dataNum:[],//需要渲染的条数
            pagingnum: '',//一共有多少条
        }
    },
    created () {
        this.orderAll();
    },
    computed: {

    },
    methods: {
        exportExcel () {//导出数据的函数
            /* generate workbook object from table */
            let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTable'));
            /* get binary string as output */
            let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '完成订单数据表格.xlsx');
            } catch (e)
            {
                if (typeof console !== 'undefined')
                    console.log(e, wbout)
            }
            return wbout
        },
        //这里做列表的轮询。。查看是不是有新订单
        //点击接单以后前往待发货状态
        handleEdit(scope) {
            console.log(scope)
            this.$api("orderType",{params:{type:"4",orderId:scope.row.id}}).then((res)=>{
                // debugger;
                console.log(res)
                var num = scope.$index
                console.log(num)
                this.list[num] = null;
                this.orderAll();
            })
        },
        //查询所有订单
        orderAll () {
            this.$api('orderAll',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize,type:"4"}}).then((res)=>{
                var list = res.data.data.list;
                this.list = list;
                // console.log(this.list)
                this.searchObj.pageSize = res.data.data.pageSize;
                this.searchObj.pageNum = res.data.data.pageNum;
                this.searchObj.totalCount = res.data.data.total;
                // for(var i = 0;i<list.length;i++) {
                //     console.log(list[i])
                //     if(list[i].type!==0 && list[i].type!==1) {
                //         this.list.push(list[i])
                //         console.log(this.list)
                //     }
                // }
                // this.searchObj.totalCount = this.list.length
            })
        },
        earchForm() {//搜索函数
                // console.log('搜索按钮')
            this.$api('orderAll',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize,createtime:this.formObj.startTime,endtime:this.formObj.endTime,phone:this.formObj.val,ordernum:this.formObj.merId,type:"4"}}).then((res)=>{
                var list = res.data.data.list;
                this.list = list;
                // console.log(list)
                // for(var i = 0;i<list.length;i++) {
                //     if(list[i].type!== 0&&list[i].type!== 1&&list[i].type!== 2) {
                //         this.list.push(list[i])
                //     }
                // }
                this.searchObj.pageSize = res.data.data.pageSize;
                this.searchObj.pageNum = res.data.data.pageNum;
                this.searchObj.totalCount = res.data.data.total;
                // console.log(res);
            })
        },
        handleSizeChange (val) {//改变每页显示多少条
        this.searchObj.pageSize = val;
        this.orderAll()
      },
      handleCurrentChange (val) { //改变前往多少页
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
</style>
<style lang="less">
    .home-table{
        width: 100%;
        height: calc(100% - 120px);
        // border:1px solid blue;
    }
    .block{
        padding:10px;
    }
</style>



