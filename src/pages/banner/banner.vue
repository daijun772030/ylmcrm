<template>
    <div>
        <el-form :inline="true" :model="searchObj" label-width="5px" size="mini" @submit.native.prevent  class="searchForm">
        <el-form-item class="float_right">
          <el-button type="primary" @click="add">添加轮播</el-button>
          <!-- <el-button type="primary" @click="addtype">添加商品类型</el-button> -->
        </el-form-item>
      </el-form>
        <el-table class="refund-table"  border :data="list" style="width: 100%" >
            <el-table-column prop="account" label="轮播图片" align="center" >
                <template slot-scope="scope">
                    <img :src="'http://47.108.143.240:8082/' + scope.row.url" alt="商品logo" class="itemImage">
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" ></el-table-column>
            <el-table-column prop="type" label="轮播状态" align="center" >
                <template slot-scope="scope">
                    <span v-if="scope.row.type==1">普通轮播</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
                <el-button type="text" size="mini" @click="deliver(scope.row)">删除</el-button>
            </template>  
            </el-table-column>
        </el-table>
        <el-dialog :modal-append-to-body="false" title="新增轮播" center @close="close()" :visible.sync="dialogVisible" :show-close="false" width="900px">
        <el-form :inline="true" :model="addfrom" ref="addfrom" label-width="150px" class="searchFrom demo-form-inline" >
          <el-form-item label="轮播状态" prop="sortId" class="myitem" >
            <el-select v-model="addfrom.type" placeholder="请选择商品类型" value-key="id">
              <el-option v-for="item in this.bannertype" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="轮播图片" prop="url" class="myitem">
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
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="close">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
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
export default {
    data() {
        return {
            dialogVisible:false,//弹窗状态
            list:[],//退款订单
            searchObj:{//分页数据
                pageSize:10,
                pageNum:1,
                totalCount:0
            },
            bannertype:[{id:1,name:'普通轮播'}],
            addfrom:{},//弹窗数据
        }
    },
    created() {
        this.querywidthdraw();
    },
    methods:{
        querywidthdraw() {
            this.$api('selectbanner',{params:{pageNum:this.searchObj.pageNum,pageSize:this.searchObj.pageSize}}).then((res)=>{
                console.log(res);
                var data = res.data.data;
                this.list = data.records;
                this.searchObj.pageNum = parseInt(data.current);
                this.searchObj.pageSize = parseInt(data.size);
                this.searchObj.totalCount = parseInt(data.total)
            })
        },
        successimg(res){//图片上传成功函数
            console.log(res);
            this.addfrom.url = res.data;

        },
        errorimg(err) {//图片上传失败函数
            console.log(err);
            this.$message({
                message:'添加图片失败，请重选'
            })
        },
        add() {//新增图片
            this.dialogVisible = true;
        },
        save() {//提交banner
            var data = this.addfrom;
            this.$api('addbanner',{url:data.url,address:'dd',type:data.type}).then((res)=>{
                if(res.data.retCode == 200) {
                    this.$message({
                        message:'创建成功'
                    })
                    this.querywidthdraw();
                    this.dialogVisible =false
                }else {
                    this.$message({
                        message:'创建失败，请重试'
                    })
                }
            })
        },
        close() {//弹窗消失
            this.addfrom = {};
            this.dialogVisible = false;
            this.$refs['my-upload'].clearFiles();
        },
        deliver(scope) {//删除
            this.$api('delbanner',{params:{id:scope.id}}).then((res)=>{
                this.querywidthdraw();
            })
        },
        handleSizeChange (val) {//改变每页显示多少条
                this.searchObj.pageSize = val;
                this.querywidthdraw();
            },
        handleCurrentChange (val) { //改变前往多少页
            this.searchObj.pageNum = val;
            this.querywidthdraw();
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
    .itemImage{
    height: 50px;
    vertical-align: middle;
  }
</style>



