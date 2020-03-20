<template>
    <div class="home">
    <!-- 搜索框的展示  -->
        <el-form :inline="true" :model="searchObj" label-width="5px" size="mini" @submit.native.prevent  class="searchForm">
        <!-- <el-form-item class="float_left">
          <el-select v-model="searchObj.productType" placeholder="商品类型" @change="changeValue" clearable>
            <el-option v-for="channel in shopType" :key="channel.id" :label="channel.name" :value="channel.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="float_left">
            <el-button @click="earchForm" type="primary">确定</el-button>
        </el-form-item> -->
        <el-form-item class="float_right">
          <el-button type="primary" @click="discount">发放优惠券</el-button>
        </el-form-item>
      </el-form>
    <!-- 表格的展示 -->
        <el-table
                border
                :data="list"
                style="width: 100%"
                >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table border :data="props.row.details" align="center">
                            <el-table-column align="center" label="商品名称" prop="name"></el-table-column>
                            <el-table-column align="center" label="商品数量" prop="number"></el-table-column>
                            <el-table-column align="center" label="商品价格" prop="price"></el-table-column>
                    </el-table>
                </template>
            </el-table-column>
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
                <el-button v-if="scope.row.type==1&&(scope.row.status!=3&&scope.row.status!=4)" type="text" size="mini" @click="deliver(scope.row)">发货</el-button>
                <span v-if="scope.row.type==2">已发货</span>
                <span v-if="scope.row.type==3">已完成</span>
                <span v-if="scope.row.status==3">退款中</span>
                <span v-if="scope.row.status==4">退款成功</span>
            </template>  
            </el-table-column>
        </el-table>
        <el-dialog :modal-append-to-body="false" :title="title" center @close="close(addform)" :visible.sync="dialogVisible" :show-close="false" width="900px">
        <el-form :inline="true" :model="addform" ref="addform" label-width="150px" class="searchFrom demo-form-inline" >
            <el-form-item label="快递公司" prop="logisticsName" class="myitem">
            <el-select v-model="addform.logisticsName" placeholder="请选择物流公司" value-key="id">
              <el-option v-for="item in this.expressage" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select> 
          </el-form-item>
          <el-form-item label="快递单号" prop="logisticsNo" class="myitem">
            <el-input type="text" placeholder="请输入物流单号" v-model="addform.logisticsNo" >
            </el-input> 
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="close(addform)">取消</el-button>
          <el-button type="primary" @click="save(addform)">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog :modal-append-to-body="false" title='发放优惠券' center @close="close()" :visible.sync="visibletype" :show-close="false" width="900px">
        <el-form :inline="true" :model="discountdata" ref="addform" label-width="150px" class="searchFrom demo-form-inline" >
          <el-form-item label="用户id" prop="onlyId" class="myitem">
            <el-input type="text" placeholder="填写用户id"  v-model="discountdata.onlyId" >
            </el-input>
          </el-form-item>
          <el-form-item label="满" prop="full" class="myitem">
            <el-input type="text" placeholder="达到多少钱"  v-model="discountdata.full" >
            </el-input>
          </el-form-item>
          <el-form-item label="减" prop="reduce" class="myitem">
            <el-input type="text" placeholder="优惠多少钱"  v-model="discountdata.reduce" >
            </el-input>
          </el-form-item>
        </el-form>
        <div class="remark">
            注：不填写用户id，将默认发放给所有人
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="close(addform)">取消</el-button>
          <el-button type="primary" @click="update">发送</el-button>
        </span>
      </el-dialog>
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
    import qs from 'qs';
    export default {
        components:{
            qs
        },
        data(){
            return {
                discountdata:{},//优惠券参数
                visibletype:false,
                expressage:[
                    {name:'顺丰',id:'SF'},
                    {name:'中通快递',id:'ZTO'},
                    {name:'申通快递',id:'STO'},
                    {name:'圆通快递',id:'YTO'},
                    {name:'韵达快递',id:'YD'},
                    {name:'邮政快递包裹',id:'YZPY'}
                ],//快递的种类
                title:'添加物流',
                dialogVisible:false,//输入框
                addform:{},//物流信息
                music:'music',
                formObj:{//搜索框值
                    val:null,
                    startTime:null,
                    endTime:null,
                    merId:null
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
                newTotalCount:null,
                vuexTotal:null,
            }
        },
        created () {
            // this.getList()
            this.orderAll();
        },
        methods: {
            orderAll() {//查询所有订单
                this.$api('selectorder',{params:{pageSize:this.searchObj.pageSize,pageNum:this.searchObj.pageNum}}).then((res)=>{
                    console.log(res);
                    var data = res.data.data;
                    var records = data.records
                    var newdata = records.map((item)=>{
                        var list = item.details;
                        item.details = JSON.parse(list)
                        return item
                    })
                    this.list =newdata;
                    console.log(this.list)
                    this.searchObj.pageNum = parseInt(data.current);
                    this.searchObj.pageSize = parseInt(data.size);
                    this.searchObj.totalCount = parseInt(data.total)
                })
            },
            discount() {//添加优惠券
                this.visibletype = true;
            },
            update() {//提交优惠券
                console.log(this.discountdata)
                var data = this.discountdata;
                this.$api('addcoupon',data).then((res)=>{
                    console.log(res);
                    if(res.data.retCode==200) {
                        this.$message({
                            message:'发放成功'
                        })
                        this.visibletype = false;
                    }else{
                        this.$message({
                            message:'发放失败，请重试'
                        })
                    }
                })
            },
            deliver(row) {//点击发货
                console.log(row);
                this.addform.id = row.id;
                this.dialogVisible = true;
            },
            close() {//弹框消失
            this.discountdata = {};
            this.visibletype =false;
            },
            save(data) {//提交物流
                if(data.logisticsNo&&data.logisticsName) {
                    
                    this.$api('updateOrder',{params:data}).then((res)=>{
                        console.log(res);
                        if(res.data.retCode == 200) {
                            this.$message({
                                message:'发货成功'
                            })
                            this.orderAll();
                            this.dialogVisible = false;
                        }else{
                            this.$message({
                                message:'发货失败请重试'
                            })
                        }
                    })
                }else {
                    this.$message({
                        message:'请填写正确的物流信息'
                    })
                }
            },

            //测试调
            ceshiQiTa(scope) {//支付宝退款调试
                console.log(scope);
                let data = qs.stringify({
                    'out_trade_no':scope.row.orderNum,
                    'type':1
                });
                let allApi;
                let api = '/test/alipayRefund/refund?' + data;
                let wechatApi = '/test/weixin/wxRefund?' + data;
                if(scope.row.payMethod==0) {
                    allApi = wechatApi;
                    console.log(allApi);
                }else if(scope.row.payMethod==1){
                    allApi = api;
                    console.log(allApi)
                }
                console.log(api);
                this.$axios.post(api).then((res)=>{
                    console.log(res);
                    if(res.data.retCode == 200) {
                        this.$message('退款成功')
                        this.orderAll();
                    }else {
                        this.$message.error('退款失败');
                    }
                })
            },
            cexunTuikuan () {
                this.$api('findChiltid',{params:{
                    pageNum:'1',pageSize:'10',merchantid:this.store.state.id
                }}).then((res)=>{
                    console.log(res);
                })
            },
            earchForm() {//搜索函数
                // console.log('搜索按钮')
                this.$api('orderAll',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize,phone:this.formObj.val,createtime:this.formObj.startTime,endtime:this.formObj.endTime,ordernum:this.formObj.merId,type:"0"}}).then((res)=>{
                    var list = res.data.data.list;
                    this.list = list;
                    this.searchObj.pageSize = res.data.data.size;
                    this.searchObj.pageNum = res.data.data.pageNum;
                    this.searchObj.totalCount = res.data.data.total;
                    console.log(res);
                })
            },
            //点击接单以后前往待发货状态
            handleEdit(scope) {
                console.log(scope)

                this.$confirm('确定接下这单订单？','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    console.log(scope.row);
                     this.$api("orderType",{params:{type:"1",orderId:scope.row.id,outTradeNo:scope.row.orderNum,status:"2"}}).then((res)=>{
                        console.log(res);
                        if(res.data.retCode == 200) {
                            this.$message({
                                type:'success',
                                message:'接单成功'
                            })
                            this.orderAll();
                        }else{
                            this.$message({
                                type:'error',
                                message:'接单失败,请重试'
                            })
                        }
                    })
                }).catch(()=>{
                    this.$message({
                        type:'info',
                        message:'取消操作'
                    })
                })
                // this.$api("orderType",{params:{type:"1",orderId:scope.row.id,outTradeNo:scope.row.orderNum,status:"2"}}).then((res)=>{
                //     // debugger;
                //     console.log(res)
                //     var num = scope.$index
                //     console.log(num)
                //     this.orderAll();
                //     this.list[num] = null;
                //     this.music = "music2"
                // })
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
    .remark{
        text-align: center;
        color: red;
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



