<template>
    <div class="head">
        <div></div>
        查询搜索
        <el-dropdown class="head-option" @command="handler">
            <span class="el-dropdown-link">
                {{status}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="loginout">注销</el-dropdown-item>
                <el-dropdown-item command="modifyPassword">修改密码</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                activeIndex : "1",
                status : "操作"
            }
        },
        methods : {
            handler(option) {
                switch(option) {
                    case "loginout" : this.loginout(); break;
                    case "modifyPassword" : this.modifyPassword(); break;
                }
            },
            loginout() {
                this.$model("loginout").then(res => {
                    if(res.errcode == 0) this.$router.push({ name : "login" });
                    this.$store.dispatch("UPDATE_LOGIN_STATE", false);
                });
                
            },
            modifyPassword() {
                this.$router.push({ name : "reset" });
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
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 5px 10px -2px #ccc;
    &-option{
        cursor: pointer;
    }
}
</style>

