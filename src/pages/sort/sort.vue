<template>
    <div class="goods">
      <el-form :inline="true"  label-width="5px" size="mini" @submit.native.prevent  class="searchForm">
        <el-form-item class="float_right">
          <el-button type="primary" @click="add">添加商品种类</el-button>
          <!-- <el-button type="primary" @click="addtype">添加商品类型</el-button> -->
        </el-form-item>
      </el-form>

      <el-table class="goods-table" height="calc(100% - 105px)" border :data="list1">
        <el-table-column prop="name" label="种类名称" align="center" ></el-table-column>
        <el-table-column prop="id" label="种类编号" align="center" ></el-table-column>
        <el-table-column prop="暂无 " label="上传时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="edit(scope)">修改</el-button>
            <el-button @click="deletesort(scope.row)" type="text" size="mini">删除</el-button>
          </template>  
        </el-table-column>
      </el-table>
      <el-dialog :modal-append-to-body="false" :title="title" center @close="close(addform)" :visible.sync="dialogVisible" :show-close="false" width="900px">
        <el-form :inline="true" :model="addform" ref="addform" label-width="150px" class="searchFrom demo-form-inline" >
          <el-form-item label="种类名称" prop="dada" class="myitem">
            <el-input type="text" placeholder="请输入商品名称" v-model="addform.name" >
            </el-input> 
          </el-form-item>
          <el-form-item label="种类备注" prop="remark" class="myitem">
            <el-input type="text" placeholder="请输入对种类的备注"  v-model="addform.remark" >
            </el-input> 
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="close(addform)">取消</el-button>
          <el-button type="primary" @click="save(addform)">保存</el-button>
        </span>
      </el-dialog>
      <!-- 这里是分页功能 -->
      <div class="pageination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 15, 20, 35]"
          :page-size="searchObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchObj.totalCount">
        </el-pagination> 
      </div>
      <audio src="/static/audio/newgoods.1.mp3"  id="music" hidden></audio>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        shopNameId:null,//编辑商品时候商品的id
        imageUrl:null,
        myDisable:false,
        tableData:{
          name:null,
          higherup:null,
          status:"4"
        },
        opinion:false,//意见控制符
        nputVal:null,//意见字符串
        typeId:false,
        disable:false,//是否禁用select框
        dialogVisible: false,
        dis:false,
        title: null,
        searchObj: {
          createDay: null,
          searchContent: null,
          sortField: null,
          sortOrder: null,
          updateDay: null,
          topicalName: null,
          channelId: null,
          productType: null,
          pageNum: 1,
          pageSize: 10,
          totalCount:0
        },
        actionType:null,//操作类型
        higherup:null, //搜索框需要传递的参数(这是商品类型)
        shopId:null,//商户的id
        remark:' ',//没用的消息
        MailShop:[//是否包邮
          {id:0,name:'不包邮'},
          {id:1,name:'包邮'}
        ],
        lowShop:[//是不是特价商品
          {id:1,name:'普通商品'},
          {id:0,name:'起送价商品'}
        ],
        addform: {//弹出框对象
            id:null,//种类id
            name:'',//种类名称
            remark:'',//种类备注
        },
        type3:null,
        shopType:[],//商品类型
        classShop:[],//根据商品类型获得相应的商品
        addShop:[],
        productTypes: [],
        list1:[]
      }
    },
    created () {
        this.querysort()
    },
    methods: {
      querysort() {//查询所有商品类型
        this.$api('selectsort',{params:{pageSize:this.searchObj.pageSize,pageNum:this.searchObj.pageNum}}).then((res)=>{
          console.log(res);
          var data = res.data.data;
          this.list1 =data.records;
          this.searchObj.pageNum = parseInt(data.current);
          this.searchObj.pageSize = parseInt(data.size);
          this.searchObj.totalCount = parseInt(data.total)
        })
      },
      add () {       //添加商品函数
      this.actionType =1;
      this.disable = false
        this.title = "添加种类"
        this.dialogVisible = true
      },
      deletesort(scope) {
          this.$api('delsort',{params:{sortId:scope.id}}).then((res)=>{
              if(res.data.retCode == 200 ){
                  this.$message({
                      message:"删除成功"
                  })
                  this.querysort();
              }else {
                  this.$message({
                      message:'删除失败',
                      type:'error'
                  })
              }
          })
      },
      save (adddata) {//保存
        if(this.actionType==1){
            console.log(adddata)
            if(adddata.name) {
                this.$api('addsort',{name:adddata.name}).then((res)=>{
                    if(res.data.retCode == 200 ) {
                        this.$message({
                            message:'添加成功',
                            type:'success'
                        })
                        this.querysort();
                    }else{
                        this.$message({
                            message:'添加失败',
                            type:'error'
                        })
                    }
                this.dialogVisible = false;
                })
            }else {
                this.$message({
                    message:'请输入商品种类',
                    type:'error'
                })
            }
          this.dialogVisible = false;
        }
        if(this.actionType==2) {
            console.log(adddata);
            this.$api('updatesort',{id:adddata.id,name:adddata.name}).then((res)=>{
                console.log(res);
                this.querysort();
            })
          this.dialogVisible = false;
        }
      },
      edit (myCode) {
        // debugger;        //编辑商品
        this.typeId =true;//输入框能不能用
        this.dialogVisible = true;
        var row = JSON.stringify(myCode.row)
        this.addform = JSON.parse(row);
        this.actionType=2;
        this.title = '编辑商品';
        // this.shopNameId = myCode.row.id;
        // this.addform.type = myCode.row.upName;
        // this.addform.id = myCode.row.name;
        // console.log(myCode.row)
        
      },
        
      handleSizeChange (val) {   //点击每页多少条的时候触发的函数(end)
        // debugger;
        this.searchObj.pageSize = val
        this.querysort()
      },
      handleCurrentChange (val) { //点击前往第几页的时候触发的函数(end)
        this.searchObj.pageNum = val;
        this.querysort();
      },

      problem() {//问题反馈
        this.opinion = true;
        this.$api('merchantChange',{params:{merchantid:this.store.state.id}}).then((res)=>{
          console.log(res);
          this.shopId = res.data.data.userId;
          // this.actionType = 3
        })
        console.log('问题提交问题')
      },
      Problemesave () {
        this.$api('addFeedback',{userid:this.shopId,content:this.nputVal}).then((res)=>{
            if(res.data.retCode==200) {
              this.$message({
                message:'反馈成功',
                type:'success'
              })
            }else {
              this.$message.error('反馈失败，请重试');
            }
            
          this.opinion = false;
          })
      },
      handleAvatarSuccess(res, file) {//图片上传函数
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {//图片上传函数
        const isJPG = /image\/[jpeg|jpg|png]/.test(file.type);
          const isLt1M = file.size / 1024 / 1024 < 10;

          if (!isJPG) {
          this.$message.error("上传LOGO图片格式应为jpeg|jpg|png!");
          }
          if (!isLt1M) {
          this.$message.error("上传LOGO图片大小不能超过 10MB!");
          }
          return isJPG && isLt1M;
      }, 
       
      ImgClose (tableData) {//添加商品类型的函数取消函数
        this.myDisable = false;
        // console.log(tableData)
        for(var i = 0;i<tableData.length;i++) {
          tableData[i].name = null;
          tableData[i].higherup = null;
        }
      },
      ImgSave (tableData) {//
      },
    //   input1 () {//输入的金额判断
    //     var num = this.addform.price;
    //     var re = /([0-9]+\.[0-9]{2})[0-9]*/;
    //     var aNew = num.replace(re,"$1");
    //     this.addform.price = aNew;
    //   },
      stop() {
        this.dis = true;
      },
      getShop(){//这里是点击商品类型获取相应商品
        this.clasShop()
      },
      deleShop(scope) {//删除商品相当于下架订单
        console.log(scope);
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
            this.$api("delshop",{id:scope.id}).then((res)=>{
              if(res.data.retCode==200){
                this.ces()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }else {
                this.$message({
                  type: 'success',
                  message: '删除失败!'
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
      },
      problemeClose(nputVal) {//意见弹框消失
        nputVal = null;
        this.opinion = false;
      },
      close (addform) {//取消的时候数据消失
        this.dialogVisible = false;
        this.typeId =false;
        for(var i in addform) {
          addform[i] = null;
        }
      },
      changeValue (value) {//这里获取搜索框的id
        var obj={};
        obj = this.productTypes.find((item)=>{
          return item.id == value
        });
         this.higherup = value
         console.log(this.higherup)
         console.log(obj)
      },
      status () {//查询我们的所有商品的类型
        this.$api('typeStatus',{params:{status:"1"}}).then((res)=>{
          console.log(res.data.data);
          this.shopType = res.data.data
        })
      },
      clasShop () {//这里根据商品类型查询相应的商品集
      // debugger;
        this.$api('typeFind',{params:{id:this.addform.type}}).then((res)=>{
          console.log(res);
          this.classShop = res.data.data;
          for(var i=0;i<this.classShop.length;i++) {
            if(this.classShop[i].type) {
              this.classShop[i].type = true;
              console.log(this.dis)
            }else{
              this.classShop[i].type = false;
            }
          }
        })
      },
     
      earchForm () {       //搜索框搜索内容的
         this.$api("myshop",{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize,higherup:this.searchObj.productType}}).then((res)=>{
           console.log(res)
           var list = res.data.data.list;
          this.searchObj.pageNum = res.data.data.pageNum || 1;  
          this.searchObj.pageSize = res.data.data.pageSize;
          this.searchObj.totalCount = res.data.data.total;
          this.list1 = list;
         })
      },
    },
    }
</script>
<style long="less" >
  .el-icon-question {
    text-align: center;
    vertical-align: middle;
    font-size: 30px;
    /* background-color: red; */
  }
  .myitem{
    padding: 30px 0;
  }
  .goods{
        width: 100%;
        height:100%;
        text-align: center;
        color: black;
        color: rgba(0, 0, 0, 0.349)
    }
    .searchForm{
        padding: 10px;
    }
    .itemImage{
    height: 50px;
    vertical-align: middle;
  }
  
</style>

