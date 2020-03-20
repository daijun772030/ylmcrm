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
            :default-sort = "{prop: 'startTime', order: 'descending'}"
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
            <el-table-column prop="startTime" sortable align="center" label="取件时间"></el-table-column>
            <el-table-column prop="endTime" align="center" label="送件时间"></el-table-column>
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
                v-if="scope.row.iftake==0"
                size="mini"
                @click="queryMap(scope)">查看物流</el-button>
                <el-button
                v-if="scope.row.iftake==1"
                size="mini"
                @click="ceshiDin(scope)">取衣服</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-dialog :modal-append-to-body="false" :title="title" center :visible.sync="dialogVisible" :show-close="false" >
            <div v-if="dialogVisible" class="messageQS">
              <span>骑手姓名：{{horseman.transporterName}}</span>
              <span>骑手状态：{{horseman.statusMsg}}</span>
              <span>骑手电话：{{horseman.transporterPhone}}</span>
            </div>
            <div class="map">
              <Map v-bind:shopOrder = 'shopOrder' v-bind:shopType = 'shopType' v-if="dialogVisible">
              </Map>
            </div>
        </el-dialog>
        <!-- 地图的渲染弹窗 -->
        <div class="pageination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchObj.pageNum"
                :page-sizes="[60, 80, 100, 120, 200]"
                :page-size="searchObj.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="searchObj.totalCount">
            </el-pagination>
        </div>
        <audio src="/static/audio/newgoods.1.mp3"  id="music" hidden></audio>
    </div>
</template>
 <script src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js"></script>
 <script type="text/javascript" src="https://cache.amap.com/lbs/static/addToolbar.js"></script>
<script>
    // import AMap from 'AMap';//导入地图api
    import Map from '../Map'
    import FileSaver from 'file-saver';
    import XLSX from 'xlsx';
    import DjObject from './object.js';
    // var map = new AMap.Map("container", {//这里是初始划个地图的位置
    //     zoom: 13,
    //     center: [104.066143,30.573095],
    //     resizeEnable: true
    //   });
    export default {
        components: {
          Map
        },
        data(){
            return {
                title:'查看物流消息',//弹窗的标题
                dialogVisible:false,//控制弹窗出现
                list:[],
                right:null,//订单是否接单
                searchObj:{
                pageSize:100,
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
                shopOrder:null,//商品的订单号
                shopType:0,//这一单的类型（默认是起点是用户，终点是商家）
                horseman:null//骑手信息
            }
        },
        created () {
            // this.getList()
            this.orderAll();
        },
        methods: {
          queryMap(scope) {//这里是查询订单号替换到data中
            console.log(scope);
            this.shopOrder =scope.row.orderNum;
            this.$api('dadaQuery',{params:{ordernum:scope.row.orderNum}}).then((res)=>{
              console.log(res);
              if(res.data.data.dadaResponse.code==0) {
                this.dialogVisible = true;
                this.horseman = res.data.data.dadaResponse.result;
              }else {
                this.$message.error('暂时没有物流信息');
              } 
          })
            
          },
          ceshiDin (scope) {//测试点击过后洗衣状态是不是要改
            this.$confirm('确定取衣服吗','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    console.log(scope.row);
                     this.$api('updataByOrder',{params:{orderId:scope.row.id,ifhave:1}}).then((res)=>{
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
          filterTag (value,row) {//是否是已经取衣服
              console.log(row,value);
              return row.ifhave == value;
          },
          exportExcel () {//导出数据的函数
              /* generate workbook object from table */
              let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTable'));
              /* get binary string as output */
              let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
              try {
                  FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '待收货数据表格.xlsx');
              } catch (e)
              {
                  if (typeof console !== 'undefined')
                      console.log(e, wbout)
              }
              return wbout
          },
          //点击接单以后前往待发货状态
          handleEdit(scope) {
              console.log(scope)
              this.$api("orderType",{params:{type:"2", orderId:scope.row.id, outTradeNo:scope.row.orderNum,status:"2"}}).then((res)=>{
                  // debugger;
                  console.log(res)
                  var num = scope.$index
                  console.log(num)
                  this.list[num] = null;
                  if(res.data.retCode==200) {
                      this.orderAll();
                  }
              })
          },
          //查询所有订单
          orderAll () {
            this.$api('orderAll',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize,type:"13"}}).then((res)=>{
                console.log(res)
                  this.list = [];
                    var list = res.data.data.list;
                    for (var i = 0;i<list.length;i++) {
                        if(list[i].refundStatus==10) {
                            this.list.push(list[i]);
                        }
                    }
                  this.searchObj.pageSize = res.data.data.pageSize;
                  this.searchObj.pageNum = res.data.data.pageNum;
                  this.searchObj.totalCount = res.data.data.total
            })
          },
          earchForm() {//搜索函数
              // console.log('搜索按钮')
              this.$api('orderAll',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize,phone:this.formObj.val,createtime:this.formObj.startTime,endtime:this.formObj.endTime,ordernum:this.formObj.merId,type:"13"}}).then((res)=>{
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
    .map{
      width: 100%;
      min-height: 600px;
    }
    .searchForm1{
        display: flex;
        flex-wrap: wrap;
        justify-content:center;
        align-items: center;
    }
    .messageQS{
      width: 80%;
      height:60px;
      font-size: 20px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color:black;
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



