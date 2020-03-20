<template>
    <div class="head">
            <!-- <div>
                <img src="~/static/images/logo.png" alt="">
            </div> -->
            <!-- <p style="text-aligin: center">营业状态：</p> -->
        <el-form :inline="true" :model="object" label-width="5px" size="small" class="earchForm">
            <el-form-item class="float_right">
               <el-select v-model="changeShop.status" @change="updata" placeholder="请选择营业状态">
                    <el-option v-for="item in this.mystatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select> 
            </el-form-item>
            <el-form-item>
                <el-switch
                    v-if="changeShop.status == 0"
                    v-model="autoOrder"
                    @change="AutoOrder"
                    active-text="自动接单"
                    inactive-text="手动接单">
                </el-switch>
            </el-form-item>
        </el-form>
        <el-dropdown class="head-option" @command="handler">
            <span class="el-dropdown-link">
                {{status}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="loginout">注销</el-dropdown-item>
                <el-dropdown-item command="modifyPassword">修改商户信息</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- <audio v-if="true" src=""></audio> -->
        <el-dialog :modal-append-to-body="false" @close="close(changeShop)" :title="title" center :visible.sync="dialogVisible" :show-close="false" width="900px">
            <el-form :inline="false" :model='changeShop' ref="changeShop" label-width="150px" class="demo-form-inline"  size="small" >
                 <el-form-item label="地区：">
                        <v-distpicker clearable :province="select.province" :city="select.city" :area="select.area" class="myInput1" @selected="onSeleted" ></v-distpicker>
                </el-form-item>
                <el-form-item label="详细地址：">
                    <el-input clearable autosize type="textarea" placeholder= "店铺详细地址" v-model="detAdress" size="medium" class="myInput"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：" prop="phone" class="uniq">
                    <el-input type="text" placeholder="请输入联系电话" v-model="changeShop.phone" clearable class="myInput"></el-input>
                </el-form-item>
                <el-form-item prop="shopName" label="商铺名称：" class="uniq">
                    <el-input clearable type="text" placeholder="请输入店铺名称" v-model="changeShop.shopName" class="myInput"></el-input>
                </el-form-item>
                <el-form-item label="修改门店图片：" class="uniq">
                    <el-upload
                    name="img"
                    :data="imgData"
                     class="avatar-uploader"
                    action="/api/archives/updateByMerchantAndLogo"
                    :show-file-list="true"
                    :on-progress="handleAvatarProgress"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="logoImage">
                        <i v-else class="el-icon-plus"></i>
                        <small class="uploadSmall">建议使用750*750，10M以内的jpg、png图片</small>
                    </el-upload>
                </el-form-item>
                <el-form-item prop="startTime" label="配送开始时间：" class="uniq">
                    <template>
                        <el-time-picker clearable v-model="changeShop.startTime" value-format="HH:00" format = "HH:00"  placeholder="开始配送时间"></el-time-picker>    
                    </template>
                </el-form-item>
                <el-form-item prop="endTime" label="配送结束时间：" class="uniq">
                    <template>
                        <el-time-picker clearable v-model="changeShop.endTime" value-format="HH:00" format = "HH:00" placeholder="结束配送时间"></el-time-picker>
                    </template>
                </el-form-item>
                <el-form-item prop="takeoff" label="取送费：" class="uniq">
                    <el-input clearable type="text" placeholder="请输入取送费" @blur="changeInput" :disabled="true"  v-model="changeShop.takeoff" class="myInput"></el-input>
                    <template slot="append">
                        元                        
                    </template>
                </el-form-item>
                <el-form-item prop="riseoff" label="起送价格：" class="uniq">
                    <el-input clearable type="text" placeholder="请输入起送价格" v-model="changeShop.riseoff" class="myInput"></el-input>
                    <template slot="append">
                        元                        
                    </template>
                </el-form-item>
                <el-form-item prop="status" label="营业状态：" class="uniq">
                    <el-select  v-model="changeShop.status" clearable placeholder="请选择营业状态">
                         <el-option v-for="item in this.mystatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="notice" label="商家公告：" class="uniq">
                    <el-input clearable autosize type="textarea" placeholder= "输入公告信息" v-model="changeShop.notice" size="large" class="myInput"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel" type="primary">取消</el-button>
                <el-button @click="save" type="primary">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

import VDistpicker from 'v-distpicker'
    export default {
        components: { VDistpicker },
        data() {
            return {
                detAdress:null,
                select: { province: null, city: null, area: null },
                imgData:{
                    id:null
                },
                imageUrl:"",
                value1:null,
                value2:null,
                autoOrder:false,
                mystatus:[
                    {
                        id:0,
                        name:"营业中"
                    },
                    {
                        id:1,
                        name:'休息中'
                    }
                ],
                changeShop:{
                    id:null,
                    address:null,
                    phone:null,
                    shopName:null,
                    startTime:null,
                    endTime:null,
                    takeoff:3,
                    riseoff:null,
                    status:null,
                    notice:null
                },
                vuxID:null,
                formObj:[
                    {id:'1',
                    name:"dadadada"}
                    ],
                title:"修改商家信息",
                dialogVisible:false,
                object: {
                    id:null
                },
                activeIndex : "1",
                status : "操作",  
            }
        },
        created () {
            this.archivesAll();
            this.changeShop.takeoff = 3;
        },
        computed: {
            listenShowPage () {
                return this.store.state.id
            }
        },
        watch: {
            listenShowPage (val,newval) {
                console.log('新的val' + val);
                console.log('老的val' + newval);
                this.vuxID = val; 
                this.$api("merchantChange",{params:{merchantid:this.vuxID}}).then((res)=>{
                    if(res.data.data.ifAuto == 0) {
                        this.autoOrder = true;
                    }else {
                        this.autoOrder = false;
                    }
                    console.log(res)
                    this.changeShop.id = res.data.data.id;
                    this.imgData.id = res.data.data.id;
                    this.changeShop.address = res.data.data.address;
                    this.changeShop.phone  = res.data.data.phone;
                    this.changeShop.shopName = res.data.data.shopName;
                    this.changeShop.startTime = res.data.data.startTime;
                    this.changeShop.endTime = res.data.data.endTime;
                    this.changeShop.takeoff = '3';
                    this.changeShop.riseoff = res.data.data.riseoff;
                    this.changeShop.status = res.data.data.status;
                    this.changeShop.notice = res.data.data.notice;
                    var Myaddress = res.data.data.address;
                    var a = Myaddress.split(' ')
                    console.log(a)
                    if(a.length==4) {
                        this.detAdress = a[3]
                    }else if(a.length==5) {
                        this.detAdress = a[4]
                    }
                    this.select.province = a[0];
                    this.select.city = a[1];
                    this.select.area =a[2];
                    console.log(this.changeShop)
                })
            }
        },
        methods : {
            AutoOrder() {//自动接单或则手动接单
                // alert('开启或者关闭');
                let open = '';
                let openMessage = '';
                let ifAuto = null;
                if(this.autoOrder == false) {
                    open = '是否关闭自动接单';
                    openMessage = '已取消关闭自动接单';
                    ifAuto = 1;
                }else {
                    open = '是否开启自动接单';
                    openMessage ='已取消开启自动接单';
                    ifAuto = 0;
                }
                this.$confirm(open,'提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.$api('AutoOrder',{ifAuto:ifAuto,id:this.changeShop.id}).then((res)=>{
                        console.log(res);
                        if(res.data.retCode == 200) {
                            this.$message({
                                type:'success',
                                message:'操作成功'
                            })
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
                        message:openMessage
                    })
                })

            },
            changeInput() {
                var takeoff = this.changeShop.takeoff;
                if(takeoff !== 3) {
                    this.takeoff = 3;
                }
            },
            onSeleted (data) {//地址输入框的成功
                this.select.province = data.province.value;
                this.select.city = data.city.value;
                this.select.area = data.area.value;
            },
            handleAvatarProgress(event,file,fileList) {
                // console.log(event);
                // console.log(file);
                // console.log(fileList);
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
            changEndTime(time) {
                var date = new Date(time);
                var year = date.getFullYear();
                var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
                var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
                var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
                var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
                var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
                // 拼接
                 time = year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
                //    console.log(time)
                this.value2 = time
            },
            changeStart (time) {
                var date = new Date(time);
                var year = date.getFullYear();
                var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
                var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
                var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
                var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
                var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
                // 拼接
                   time = year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
                this.value1 = time
                console.log(this.changeShop.startTime)
            }, 
            //保存商家信息的函数
            save(){
                this.dialogVisible= false;
                this.change();
                
            },
            //取消修改商家信息函数
            cancel () {
                this.dialogVisible = false;
            },
            //弹窗消失函数
            close(changeShop){
                console.log(changeShop)
            },
            archivesAll() {//查询商家信息
                // debugger;
                this.$api("merchantChange",{params:{merchantid:this.store.state.id}}).then((res)=>{
                    console.log(this.store.state.id)
                    console.log(res);
                    this.changeShop.id = res.data.data.id;
                    this.imgData.id = res.data.data.id;
                    this.changeShop.address = res.data.data.address;
                    this.changeShop.phone  = res.data.data.phone;
                    this.changeShop.shopName = res.data.data.shopName;
                    this.changeShop.startTime = res.data.data.startTime;
                    this.changeShop.endTime = res.data.data.endTime;
                    this.changeShop.takeoff = '3';
                    this.changeShop.riseoff = res.data.data.riseoff;
                    this.changeShop.status = res.data.data.status;
                    this.changeShop.notice = res.data.data.notice;
                    var Myaddress = res.data.data.address;
                    var a = Myaddress.split(' ')
                    console.log(a)
                    if(a.length==4) {
                        this.detAdress = a[3]
                    }else if(a.length==5) {
                        this.detAdress = a[4]
                    }
                    this.select.province = a[0];
                    this.select.city = a[1];
                    this.select.area =a[2];
                    console.log(this.changeShop)
                })
            },
            change () {//这里是修改数据的函数
                // debugger;
                console.log(this.changeShop.address)
                var NewAddress = this.select.province + " " + this.select.city + " " + this.select.area + " " + this.detAdress;
                console.log(NewAddress)
                this.changeShop.address = NewAddress; 
                console.log(this.changeShop.startTime)
                this.$api("updataByMer",{
                    id:this.changeShop.id,
                    address:this.changeShop.address,
                    phone:this.changeShop.phone,
                    endTime:this.changeShop.endTime,
                    startTime:this.changeShop.startTime,
                    takeoff:this.changeShop.takeoff,
                    riseoff:this.changeShop.riseoff,
                    shopName:this.changeShop.shopName,
                    status:this.changeShop.status,
                    notice:this.changeShop.notice

                }).then((res)=>{
                    console.log(res);
                        if(res.data.retCode == 200) {
                            this.$message('修改成功')
                        }else {
                            this.$message(res.data.message)
                        }
                    })
            },
            updata () {//营业中函数
            // debugger;
                this.change();
            },
            orderAll() {
                this.$api('orderAll',{params:{pageNum:"1",pageSize:"12",type:"5"}}).then((res)=>{
                    console.log(res);
                })
            },
            handler(option) {
                switch(option) {
                    case "loginout" : this.loginout(); break;
                    case "modifyPassword" : this.modifyPassword(); break;
                }
            },
            loginout() {
                // debugger;
            this.$api('cancellation').then((res)=>{
                console.log(res)
                if(res.data.retCode==200){
                    this.$router.replace({ path: '/login' });
                }
            });
            },
            modifyPassword() {
                this.dialogVisible= true;
            }
        }
    }
</script>

<style lang="less" scoped>
.head{
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    padding: 0 15px;
    overflow: hidden;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
    box-shadow: 0 5px 10px -2px #ccc;
    &-option{
        cursor: pointer;
    }
    .earchForm {
        margin-bottom: 20px;
    }
    .el-form-item,.el-form-item--mini{
        margin: 20px 50px 0 5px ;
    } 
    .logoImage {
    height: 48px;
    vertical-align: middle;
    margin-right: 10px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .myInput{
      width: 50%;
      height: 40px;
    }
}
</style>
<style lang  = "less">
  .searchForm{
        padding: 10px;
    }
    el-form{
        overflow: hidden;
    }
    el-form-item{
        /* padding:20px 0; */
    }
</style>


