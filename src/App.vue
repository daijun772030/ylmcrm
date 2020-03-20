<template>
    <router-view></router-view>
</template>

<script>
// import audio from './pages/audio'
export default {
    data(){
        return {
            index : "login",
            a:null,
            b:null
        }
    },
    created(){
        // audio();
        this.query();
    },
    methods : {
        query() {
            var userid = sessionStorage.getItem('userid');
            if(userid) {
                var href = location.href;
                var myPath = href.split('youlemo');
                // console.log(myPath)
            //  that.$router.replace({path:myPath[1]})
                if(myPath[1] == '' || myPath[1] == '/') {
                    myPath[1] = 'manager/index'
                }
                this.$router.replace({path:myPath[1]})
            }else {
                this.$router.replace({path:'/login'})
            }
        },

    }
}
</script>

<style lang="less" scoped>
</style>