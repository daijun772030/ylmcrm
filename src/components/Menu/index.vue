<template>
    <div class="menu">
        <!-- <div class="log"> 
            <img :src="img" alt="">  
        </div> -->
        <div class="menu-list">
            <el-menu
                :default-active="currentPath"
                :router="true"
                class="menu-list-el"
                text-color="#fff"
                :unique-opened="true"
            >   
                
                <el-submenu class="sub" v-for="menu in list" :key="menu.id" :index="menu.path" v-if="menu.children.length > 0">
                    <template slot="title">
                        <el-badge :value='bealen' v-if="menu.id==0" class="item1">
                            <i :class="'el-icon ' + menu.icon"/>
                            <span>{{menu.name}}</span>
                        </el-badge>
                        <el-badge v-else class="item1">
                            <i :class="'el-icon ' + menu.icon"/>
                            <span>{{menu.name}}</span>
                        </el-badge>
                    </template>
                    
                    <el-menu-item
                        v-for="submenu in menu.children"
                        :key="submenu.id"
                        :index="submenu.path"
                    >
                        <el-badge v-if="submenu.id==0" :value="val" class="item1">
                            <i :class="'el-icon ' + submenu.icon"/>
                            <span>{{submenu.name}}</span>
                        </el-badge>
                        <el-badge v-else >
                            <i :class="'el-icon ' + submenu.icon"/>
                            <span>{{submenu.name}}</span>
                        </el-badge>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="menu.path">
                    <i :class="'el-icon ' + menu.icon"/>
                    <span>{{menu.name}}</span>
                </el-menu-item>
            </el-menu>
        </div>
    </div>
</template>
<script>
    import list from './list';
    import img from './images/houtai_logo.png'
    export default {
        data() {
            return {
                dpList:[],//真实数据的问题
                list: list,
                img:img,
                currentPath: 'index',
                val:null,
                bealen:null,
                total:null
            }
        },
        created() {
            console.log(this.$route.path)
            this.currentPath = this.$route.path;
            // this.queryValue ();
        },
        methods: {
            // 获取导航列表
            queryValue () {
                console.log(this.store.state.newTotalCount)
                // var total = this.store.state.newTotalCount;

                this.$api('orderAll',{params:{pageNum:1,pageSize:500,type:"0"}}).then((res)=>{
                    this.dpList = [];
                    console.log(res)
                    var list = res.data.data.list;
                    for (var i = 0;i<list.length;i++) {
                        // console.log(list[i].refundStatus);
                        if(list[i].refundStatus==10) {
                            this.dpList.push(list[i]);
                        }
                    }
                    if(this.dpList.length>0) {
                        console.log(this.store.state.newTotalCount)
                        console.log('数据的查看' + res.data.data.total)
                        this.val = this.store.state.newTotalCount;
                        this.bealen = "NEW";
                    }else {
                        this.val = null;
                        this.bealen = '';
                    }
                    // this.store.state.newTotalCount = this.dpList.length;

                })
            },
        }
    }
</script>
<style lang="less" scoped>
    .log {
        width: 100%;
        height: 60px;
        color: white;
        text-align:center;
        line-height: 60px;
        background-color:#494f60;
        display: flex;
        flex-direction:column;
        justify-content: space-around;
        align-items: center;

    }
    .item1{
        margin-top: 5px;
    }
    .log>img{
        width:80%;
        height: auto;
        max-width:100%;
        // padding: 5px 0;
    }
    .menu{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 200px;
        background: #494f60;
        &-list{
            width: 100%;
            height: calc(100% - 62px);
            background-color: #494f60;
            position: relative;
            overflow: hidden;
            text-align: left;
            .menu-list-el{
                background-color: #494f60;
                border-right: none;
            }
            .el-submen:hover,
            .el-menu-item:hover{
                background: #67a4a5;
            }
        }
    }
    .home {
        background-image: url("~/static/images/home.png");
    }
</style>
<style lang="less">
    .el-submenu .el-menu,{
        background-color: #494f60;
    }
    .el-submenu__title:hover{
        background: #67a4a5;
    }
    .menu {
        .el-menu-item,
        .el-submenu__title {
            font-size: 12px;
            height: 40px;
            line-height: 40px;
        }
        .el-icon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
        }
        .el-menu-item.is-active{
            background: #409eff;
            color: #fff;
        }
    }
    .el-icon {
        display: inline-block;
        width: 18px;
        height: 18px;
        background-size: cover;
        margin: 0 auto;
        &.home {
            background-image: url("./images/home.png");
        }
        &.resource {
            background-image: url("./images/resource.png");
        }
    }
    
</style>

