import axios from 'axios'
// import Vue from 'vue';
import qs from 'qs'
const baseURL = process.env.baseURL || "/api";
// console.log(process.env.baseURL);
// 请求对象实例，具体的方法
const create = function() {
    let http = axios.create({
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    // 请求拦截器
    http.interceptors.request.use(config => {
        // debugger;
        // if (config.method === 'post') {
        //     config.data = JSON.stringify(config.data)
        // } 
        // const token = localStorage.getItem('token');
        // if(token){
        //     config.headers = {
        //         cookie: `token=${token}`
        //     }
        // }

        return config
    }, error => {
        return Promise.reject(error)
    })

    // 响应拦截器
    http.interceptors.response.use(response => {
        // debugger;
        return response;
        // 响应状态统一处理
        // if (response.data.retCode == 200) {
        //     return response;
        // } else if (response.data.retCode == -200) {
        //     window.location.replace('/sangjie/panel/login');
        //     // Vue.prototype.$router.replace('/login');
        // }
    }, error => {
        return Promise.reject(error)
    })

    return http
}
const instance = create();

// 柯理化

// const ['get', 'post'] = ['get', 'post'].map(item => {
//     return (url) => {
//         return (data) => {
//             return (config) => {
//                 instance[item](url, data, config);
//             }
//         };
//     };
// });
const get = (url) => {
    return (data) => {
        return (config) => {
            return instance.get(url, data, config);
        }
    }
};
const post = (url) => {
    return (data) => {
        data = qs.stringify(data)
        return (config) => {
            return instance.post(url, data, config);
        }
    }
};

// 接口map 表
const apis = {
    // //订单查询
    // orderAll: get("/merchant/order/all"),
    // //修改订单
    // orderType: get("/merchant/order/updateByOrderType"),
    // //修改取衣订单状态
    // updataByOrder: get('/merchant/order/updateByOrderIfhave'),
    // //商户后台登录的接口
    // login: post('/merchant/login'),
    // cancellation: get('/merchant/cancellation'),
    // //商家认证信息
    // archivesAll: get("/archives/all"),
    // //查询商家个人基本信息
    // merchantChange: get("/merchant/order/findByMerchantidDetail"),
    // //查询商品下活动
    // findBy: get('/activity/findByActivityAll'),
    // //查询用户退款信息
    // findChiltid: get('/merchant/order/findByMerchantidRefund'),
    // //修改商家个人信息
    // updataByMer: post("/archives/updateByMerchant"),
    // //查询达达订单详情
    // dadaQuery: get('/archives/dadaQuery'),
    // //商品接口
    // myshop: get('/commodity/all'), //查询所有商品
    // addshop: post('/commodity/addCommodity'), //添加商品
    // delshop: post('/commodity/deleteByCommodityid'), //删除商品
    // upshop: post('/commodity/updateByCommodityid'), //修改商品
    // //商品类型
    // typeFind: get('/type/findByTypeHigherup'), //根据一级下单栏查询下级
    // typeStatus: get('/type/findByTypeStatus'), //查询一级下单栏
    // commitFindMerId: get('/commodity/findByTypeIdAndMerId'), //根据快速下单栏查询商品接口
    // //优惠活动
    // discountAll: get('/discount/all'), //查询所有优惠
    // discountAddDis: post('/discount/addDiscount'), //新增打折优惠
    // discountFull: post('/discount/addDiscountByFull'), //新增满减优惠
    // deledDiscount: post('/discount/delteDiscount'), //删除优惠
    // updateDiscount: post('/discount/updateDiscount'), //修改优惠
    // //意见
    // proposalAll: get('/proposal/all'), //所有意见和建议
    // proposalAdd: post('/proposal/insertProposal'), //添加意见
    // updataProposal: get('/proposal/updateByMerchant'), //修改意见信息
    // //添加反馈
    // addFeedback: post('/feedback/addFeedback'),
    // //自动或者手动接单
    // AutoOrder: post('/archives/updateMerchantByifAuto')


    
    //登录
    login:get('/login/login'),//登录
    //订单管理
    delorder:get('admin/order/delOrder'),//删除订单
    selectorder:get('admin/order/selectOrder'),//查询订单
    updateOrder:get('admin/order/updateOrder'),//修改订单为已发货
    queryrefund:get('admin/order/selectOrderRefund'),//查询所有退款订单
    updateorderrefund:get('admin/order/updateOrderRefund'),//修改订单为已退款
    //反馈意见
    selecrfeedback:get('feedback/selectFeedback'),//查询所有反馈意见
    //商品
    addcommodity:post('commodity/addCommodity'),//新增商品
    delcommodity:get('commodity/delCommodity'),//删除商品
    selectcommodity:get('commodity/selectCommodity'),//查询所有商品
    updatecommodity:get('commodity/updateCommodity'),//修改商品
    //提现管理
    delwithdrawal:get('withdrawal/delSort'),//修改提现记录为已提现
    selectwithdrawal:get('withdrawal/selectWithdrawal'),//查询所有提现
    //一级菜单
    addsort:post('sort/addSort'),//新增一级菜单
    delsort:get('sort/delSort'),//删除一级菜单
    selectsort:get('sort/selectSort'),//查询一级菜单栏
    updatesort:post('sort/updateSort'),//修改一级菜单栏
    //优惠券
    addcoupon:post('coupon/addCoupon'),//发放优惠券
    //banner图新增
    addbanner:post('admin/banner/addBanner'),//新增banner
    delbanner:get('admin/banner/delBanner'),//删除banner
    selectbanner:get('admin/banner/selectBanner'),//所有banner
    //图片处理
    delfile:get('delFile'),//删除图片
    getimg:get('img'),//获取图片
    upload:post('upload'),//上传图片
    //用户
    selectuser:get("login/selectUser"),//查询所有用户
}
const request = function(name, data, config) {
    return apis[name](data)(config);
}
export default request;