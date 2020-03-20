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
            :default-sort = "{prop: 'endTime', order: 'descending'}"
            element-loading-text="加载中..."
            style="
            height: calc(100% -60px)"
            class="home-table"
            id="rebateSetTable">
            <el-table-column prop="orderNum" align="center" label="订单号" width="180px"></el-table-column>
            <el-table-column prop="number"  align="center" label="商品名称"></el-table-column>
            <el-table-column prop="shName" align="center" label="客户姓名"></el-table-column>
            <el-table-column prop="address" align="center" label="客户地址"></el-table-column>
            <el-table-column prop="phone" align="center" label="客户电话"></el-table-column>
            <el-table-column prop="startTime" align="center" label="取件时间"></el-table-column>
            <el-table-column prop="endTime" sortable align="center" label="送件时间"></el-table-column>
            <el-table-column prop="iftake" align="center" label="取送方式">
                <template slot-scope="scope">
                    <span v-if="scope.row.iftake==0">达达配送</span>
                    <span v-if="scope.row.iftake==1">用户自取自送</span>
                </template>
            </el-table-column>
            <el-table-column prop="ifhave" align="center" width="100px" filter-placement="bottom-end" :filters="[{text:'未取衣服',value:'0'},{text:'已取衣服',value:'1'}]" :filter-method="filterTag" label="取衣服状态">
                <template slot-scope="scope">
                    <span v-if='scope.row.ifhave==0'>未取衣服</span>
                    <span v-if='scope.row.ifhave==1'>已取衣服</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" align="center" width="100px" label="支付状况">
                <template slot-scope="scope"> 
                <span v-if="scope.row.status==0">未支付</span>
                <span v-if="scope.row.status==1">支付失败</span>
                <span v-if="scope.row.status==2">支付成功</span>
              </template>
            </el-table-column>
            <el-table-column prop="payMethod" align="center" width="100px" label="支付方式">
                <template slot-scope="scope"> 
                <span v-if="scope.row.payMethod==0">微信支付</span>
                <span v-if="scope.row.payMethod==1">支付宝支付</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
            <el-table-column prop="remark" align="center" label="客户备注">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top">
                        <span>{{scope.row.remark}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
             align="center"
             width="220px"
             label="操作">
            <template slot-scope="scope" >
                <el-button
                v-if="scope.row.ifhave == 1"
                size="mini"
                @click="handleEdit(scope)">确认洗衣</el-button>
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
    import FileSaver from 'file-saver';
    import XLSX from 'xlsx';
    import DjObject from './object.js';
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
            // this.getList()
            this.orderAll();
        },
        computed: {

        },
        methods: {
            filterTag (value,row) {
                console.log(row,value);
                return row.ifhave == value;
            },
            exportExcel () {//导出数据的函数
                /* generate workbook object from table */
                let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTable'));
                /* get binary string as output */
                let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '待发货数据表格.xlsx');
                } catch (e)
                {
                    if (typeof console !== 'undefined')
                        console.log(e, wbout)
                }
                return wbout
            },
            // ceshiDin (scope) {//测试点击过后洗衣状态是不是要改变
            //     this.$api('updataByOrder',{params:{orderId:scope.row.id}}).then((res)=>{
            //         if(res.data.retCode ==200) {
            //             this.orderAll();
            //         }
            //     })
            // },
            //这里做列表的轮询。。查看是不是有新订单
            //点击接单以后前往待发货状态
            handleEdit (scope) {//测试点击过后洗衣状态是不是要改
            this.$confirm('确定衣服已经洗完了吗','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    console.log(scope.row);
                     this.$api('updataByOrder',{params:{orderId:scope.row.id,ifhave:2}}).then((res)=>{
                        console.log(res);
                        if(res.data.retCode == 200) {
                            this.$message({
                                type:'success',
                                message:'操作成功'
                            })
                            this.orderAll();
                        }else{
                            this.$message({
                                type:'error',
                                message:'操作失败,请重试'
                            })
                        }
                    })

                }).catch(()=>{
                    this.$message({
                        type:'info',
                        message:'取消操作'
                    })
                })
            },
            //查询所有订单
            orderAll () {
                this.$api('orderAll',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize,type:"14"}}).then((res)=>{
                    console.log(res)
                    var list = res.data.data.list;
                    this.list = list;
                    // this.list = [];
                    // for (var i = 0;i<list.length;i++) {
                    //     if(list[i].ifhave==1) {
                    //         this.list.push(list[i]);
                    //     }
                    // }
                    this.searchObj.pageSize = res.data.data.pageSize;
                    this.searchObj.pageNum = res.data.data.pageNum;
                    this.searchObj.totalCount = res.data.data.total
                })
            },
            earchForm() {//搜索函数
                // console.log('搜索按钮')
                this.$api('orderAll',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize,phone:this.formObj.val,createtime:this.formObj.startTime,endtime:this.formObj.endTime,ordernum:this.formObj.merId,type:"14"}}).then((res)=>{
                    var list = res.data.data.list;
                    this.list = list;
                    // this.list = [];
                    // for (var i = 0;i<list.length;i++) {
                    //     if(list[i].ifhave==1) {
                    //         this.list.push(list[i]);
                    //     }
                    // }
                    this.searchObj.pageSize = res.data.data.pageSize;
                    this.searchObj.pageNum = res.data.data.pageNum;
                    this.searchObj.totalCount = res.data.data.total;
                    this.formObj.val = null;
                    this.formObj.startTime = null;
                    this.formObj.endTime = null;
                })
            },
            seach () {
                //在这里用来分页查询
                for(var i=( this.paginObj.currentPage-1)*this.paginObj.pageSize;i< this.paginObj.currentPage*this.paginObj.pageSize&&i<this.tableData.length;i++){
                /*&&i<this.tableData.length*/
                    if(i<this.tableData.length){
                        this.dataNum.push(this.tableData[i])
                    }
                }
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



