<template>
    <div class="goods">
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
          <el-button type="primary" @click="add">添加商品</el-button>
          <!-- <el-button type="primary" @click="discount">发放优惠券</el-button> -->
        </el-form-item>
      </el-form>

      <el-table class="goods-table" height="calc(100% - 105px)" border :data="list1">
        <el-table-column prop="img" label="商品图片" align="center">
          <template slot-scope="scope">
            <img :src="'http://47.108.143.240:8082/' + scope.row.img" alt="商品logo" class="itemImage">
          </template>
        </el-table-column>
        <el-table-column prop="commodityName" label="商品名称" align="center" ></el-table-column>
        <el-table-column prop="price" label="商品金额" align="center" ></el-table-column>
        <el-table-column prop="originalPrice" label="商品原价" align="center" ></el-table-column>
        <el-table-column prop="createTime" label="上架时间" align="center"></el-table-column>
        <el-table-column prop="stock" label="库存" align="center"></el-table-column>
        <el-table-column prop="sortName" label="商品分类" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="edit(scope)">修改</el-button>
            <el-button @click="deleShop(scope.row)" type="text" size="mini">删除</el-button>
          </template>  
        </el-table-column>
      </el-table>
      <el-dialog :modal-append-to-body="false" :title="title" center @close="close()" :visible.sync="dialogVisible" :show-close="false" width="900px">
        <el-form :inline="true" :model="addform" ref="addform" label-width="150px" class="searchFrom demo-form-inline" >
          <el-form-item label="商品分类" prop="sortId" class="myitem" >
            <el-select v-model="addform.sortId" placeholder="请选择商品类型" value-key="id">
              <el-option v-for="item in this.shopType" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称" prop="commodityName" class="myitem">
            <el-input type="text" placeholder="填写商品名称"   v-model="addform.commodityName" >
            </el-input> 
          </el-form-item>
          <el-form-item label="商品价格" prop="price" class="myitem">
            <el-input type="text" placeholder="请输入商品金额" v-model="addform.price" >
              <template slot="append">元</template>
            </el-input> 
          </el-form-item>
          <el-form-item label="库存" prop="stock" class="myitem">
            <el-input type="text" placeholder="填写商品的库存"  v-model="addform.stock" >
            </el-input> 
          </el-form-item>
          <el-form-item label="商品原价" prop="originalPrice" class="myitem">
            <el-input type="text" placeholder="请输入商品原始金额" v-model="addform.originalPrice" >
              <template slot="append">元</template>
            </el-input> 
          </el-form-item>
          <el-form-item label="商品图片" prop="img" class="myitem">
            <el-upload
              ref="my-upload"
              class="upload-demo"
                action="/api/upload/"
                 name="path"
                :limit="1"
                :on-success="successimg"
                :on-error="errorimg"
                :show-file-list="true"
                >
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="商品介绍" prop="introduce" class="myitem">
            <el-input type="textarea" placeholder="请输入商品的介绍" v-model="addform.introduce" >
              <template slot="append">元</template>
            </el-input> 
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="close(addform)">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
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
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="close(addform)">取消</el-button>
          <el-button type="primary" @click="update">保存</el-button>
        </span>
      </el-dialog>
      <!-- 这里是分页功能 -->
      <div class="pageination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchObj.pageNum"
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
        discountdata:{},//优惠券参数
        opinion:false,//意见控制符
        nputVal:null,//意见字符串
        typeId:false,
        disable:false,//是否禁用select框
        dialogVisible: false,
        visibletype:false,
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
        addform: {sortId:'123'},//添加框
        type3:null,
        shopType:[],//商品类型
        classShop:[],//根据商品类型获得相应的商品
        addShop:[],
        productTypes: [],
        list1:[]
      }
    },
    created () {
      // this.ces();
      // this.status();
      this.queryshopo();
      this.querysort();
    },
    methods: {

      queryshopo() {//查询所有商品
        this.$api('selectcommodity',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize}}).then((res)=>{
          console.log(res);
          var data = res.data.data;
          this.list1 = data.records;
          this.searchObj.pageNum = parseInt(data.current);
          this.searchObj.pageSize = parseInt(data.size);
          this.searchObj.totalCount = parseInt(data.total)
        })
      },
      querysort() {//查询所有商品类型
        this.$api('selectsort',{params:{pageSize:50,pageNum:1}}).then((res)=>{
          console.log(res);
          var data = res.data.data;
          this.shopType = data.records;
        })
      },
      deleShop(row) {//删除商品
      console.log(row)
        this.$api('delcommodity',{params:{commodityId:row.id}}).then((res)=>{
          if(res.data.retCode == 200) {
            this.$message({
              message:'删除成功'
            })
            this.queryshopo()
          }else {
            this.$message({
              message:'删除失败'
            })
          }
        })
      },
      edit (myCode) {
        // debugger;        //编辑商品
        this.typeId =true;//输入框能不能用
        console.log(myCode.row)
        var data = JSON.stringify(myCode.row);
        this.dialogVisible = true;
        this.addform = JSON.parse(data);
        this.title = '编辑商品';
        this.actionType=2;
        
      },
        
      save () {//保存
        console.log(this.addform)
        var data = this.addform;
        if(this.actionType==1){
          this.$api('addcommodity',data).then((res)=>{
            console.log(res);
            this.queryshopo();
            this.dialogVisible = false;
          })
        }
        if(this.actionType==2) {
          this.$api('updatecommodity',{params:data}).then((res)=>{
            console.log(res);
            if(res.data.retCode!==200) {
              this.$message('修改失败')
            }else{
              this.$message('修改成功')
            }
            this.queryshopo();
          this.dialogVisible = false;
          })
        }
      },
      update() {
        console.log(this.discountdata)
      },
        close() {//弹框消失
          this.addform ={};
          this.discountdata = {};
          this.visibletype =false;
          this.dialogVisible = false;
          if(this.dialogVisible) {
          this.$refs['my-upload'].clearFiles();
          }
        },
        
      handleSizeChange (val) {   //点击每页多少条的时候触发的函数(end)
        // debugger;
        this.searchObj.pageSize = val
        this.queryshopo();
      },
      handleCurrentChange (val) { //点击前往第几页的时候触发的函数(end)
        this.searchObj.pageNum = val;
        this.queryshopo();
      },
      add () {       //添加商品函数
      this.actionType =1;
      this.disable = false
        this.title = "添加商品"
        this.dialogVisible = true
      },
      discount() {//添加优惠券
        this.visibletype = true;
      },
      successimg(res,file,fileList) {//上传成功的回调函数
        console.log(res,file,fileList);
        this.addform.img = res.data;
      },
      errorimg(res,file,fileList){//上传失败的函数
        console.log(res,file,fileList)
        this.$message({
          message:'图片上传失败，请重试'
        })
      },
    }
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

