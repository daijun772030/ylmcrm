<template>
  <div class="login">
    <div class="login-page">
      <el-form class="login-form" :model="login1">
        <el-form-item>
          <el-input
          :autofocus="true"
          placeholder="请输入登录账号"
          v-model="login1.phone">
          <template slot="prepend"><i class="el-icon-mobile-phone"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item>
            <el-input
                placeholder="请输入验证码"
                type="number"
                v-if="typeOf"
                v-model="login1.password" @keyup.enter.native="login">
                <template slot="prepend"><i class="el-icon-info"></i></template>
            </el-input>
            <el-input
                placeholder="请输入密码"
                type="password"
                v-else
                v-model="login1.password" @keyup.enter.native="login">
                <template slot="prepend"><i class="el-icon-info"></i></template>
            </el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" @click="login" type="primary" :loading="isBtnLoading">{{btnText}}</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <div  class="login_list">
            <input class="auth_input" type="text"  placeholder="输入验证码" />
            <span v-show="sendAuthCode" class="auth_text auth_text_blue"  @click="getAuthCode">获取验证码</span>
            <span v-show="!sendAuthCode" class="auth_text"> <span class="auth_text_blue">{{auth_time}} </span> 秒之重新发送验证码</span> 
        </div>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>
<script>
import Hashes from 'jshashes'
  export default {
    components: {
      Hashes: Hashes
   },
    data () {
      return {
          manager:"manager",
        isBtnLoading: false,
        login1:{
            "phone":'',
            "password": ''
        },
        typeOf:false,
        sendAuthCode:true,
        auth_time: 0
      }
    },
    computed: {
      btnText () {
        if (this.isBtnLoading) return "登录中";
        return '登录';
      }
    },
    created () {
    },
    methods: {
        getAuthCode:function () {
            this.sendAuthCode = false;
            this.auth_time = 60;
            var auth_timetimer =  setInterval(()=>{
                this.auth_time--;
                if(this.auth_time<=0){
                    this.sendAuthCode = true;
                    clearInterval(auth_timetimer);
                }
            }, 1000);
        },

    keyCOde () {
        this.$jq('body').keydowm(function (){
            if(event.keyCOde == "13") {
            this.login();
            }
        })   
    },
      login () {
        //   var MD5 = new Hashes.MD5;
        //   console.log(MD5.hex('shan5201314000'))
        //   console.log(MD5.hex('qweasd'))
        // debugger;
        if (!this.login1.phone) {
          this.$message.error("请填写用户名");
          return;
        }
        if(!this.login1.password) {
          this.$message.error("请填写密码");
          return;
        }
        this.isBtnLoading = true;
        // let loginParams = {name:vm.username,password:vm.password};
        this.$api("login",{params:{userName:this.login1.phone,password: this.login1.password}}).then((res)=>{
            console.log(res)
            // var message = res.data.message

            if(res.data.retCode==200&&res.data.data == null || res.data.retCode==200&&res.data.data.type==2){
                this.$message.error('输入有误，请重新输入');
                this.isBtnLoading = false  
            }
            if(res.data.retCode==200&&res.data.data.type!==2) {
                var id = {
                    id:res.data.data.id
                };
                this.store.commit("increment", id)
                console.log(this.store.state.id);
                sessionStorage.setItem('userid','admim')
                this.$router.replace({ path : 'manager/index' });
            }
            if(res.data.retCode!=200) {
                this.$message.error('输入有误，请重新输入');
                this.isBtnLoading = false  
            }
        })
      }
    }
  }
</script>
<style long="less" scope>
  .login {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        background: url("~/static/images/timg.jpg") top center;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .login-header {
        background: #3e4d5c;
        padding: 20px;
    }
    .valiimg {
        text-align: right;
    }
    .valiimg img {
        width: 100%;
    }
    .login-form {
        width: 257px;
    }
    .login .title {
        position: absolute;
        top: 50%;
        margin-left: -128px;
        left: 50%;
        text-align: center;
        color: #abd0aa;
        font-size: 46px;
    }
    .login-form .input-body {
        line-height: 35px;
        margin: 20px 0;
    }
    .login-form .label-title {
        text-align: right;
        padding-right: 20px;
    }
    .login-form img {
        height: 35px;
    }
    .login-form .last-margin {
        margin-bottom: 0px !important;
    }
    .login-form .menus {
        text-align: center;
    }
    .loginBtn {
        width: 100%;
    }
    .login-form .lxwm {
        margin-top: 100px;
        text-align: center;
    }
    .login-form .lxwm button {
        font-size: 16px;
        color: #fff;
    }
    .forgetPass {
        text-align: right;
        font-size: 14px;
    }
    .wecloeme {
        text-align: right;
        color: #fff;
    }
    .forget-pass {
        position: relative;
        top: -10px;
        margin: 0px 0px 10px !important;
    }
    .login-form .border-bottom {
        margin-bottom: 20px;
    }
    .remenber {
        color: #ded8d8;
    }
    .title img {
        height: 60px;
        vertical-align: text-bottom;
        margin-right: 15px;
    }
    .el-form-item{
        margin-bottom: 20px;
    }
    .el-form-item p {
        text-align: center;
    }
</style>
