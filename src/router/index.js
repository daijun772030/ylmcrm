import Vue from 'vue';
import Router from 'vue-router';
// import { resolve } from 'upath';

// 按需加载组件，在需要的时候才加载组件
import App from '@/App';
const Manager = () =>
    import ('@/pages/manager' /* webpackChunkName: "pages/manager" */ ).then(m => m.default || m)
const Login = () =>
    import ('@/pages/login' /* webpackChunkName: "pages/login" */ ).then(m => m.default || m)
    // const Order = () =>
    //     import ('@/pages/order' /* webpackChunkName: "pages/order" */ ).then(m => m.default || m)
    // const Business = () =>
    //     import ('@/pages/business' /* webpackChunkName: "pages/business" */ ).then(m => m.default || m)
const BusinessList = () =>
    import ('@/pages/business/list' /* webpackChunkName: "pages/business/list" */ ).then(m => m.default || m)
const BusinessOrder = () =>
    import ('@/pages/business/order' /* webpackChunkName: "pages/business/order" */ ).then(m => m.default || m)
const Goods = () =>
    import ('@/pages/goods/goods' /* webpackChunkName: "pages/goods/goods" */ ).then(m => m.default || m)
    const Sort = () =>
        import ('@/pages/sort/sort' /* webpackChunkName: "pages/sort/sort" */ ).then(m => m.default || m)
const Activity = () =>
    import ('@/pages/activity/activity' /* webpackChunkName: "pages/activity/activity" */ ).then(m => m.default || m)
const Finance = () =>
    import ('@/pages/finance/finance' /* webpackChunkName: "pages/finance/finance" */ ).then(m => m.default || m)
const Index = () =>
    import ('@/pages/order/index' /* webpackChunkName: "pages/order/index" */ ).then(m => m.default || m)
const Generalize = () =>
    import ('@/pages/generalize/generalize' /* webpackChunkName: "pages/generalize/generalize" */ ).then(m => m.default || m)
const Accomplish = () =>
    import ('@/pages/order/accomplish' /* webpackChunkName: "/pages/order/accomplish" */ ).then(m => m.default || m)
// const Refund = () =>
//     import ('@/pages/order/refund' /* webpackChunkName: "/pages/order/refund" */ ).then(m => m.default || m)
const Make = () =>
    import ('@/pages/order/make' /* webpackChunkName: "/pages/order/make" */ ).then(m => m.default || m)
const AwaitTake = () =>
    import ('@/pages/order/awaitTake' /* webpackChunkName: "/pages/order/awaitTake" */ ).then(m => m.default || m)
const AwaitClose = () =>
    import ('@/pages/order/awaitClose' /* webpackChunkName: "/pages/order/awaitClose" */ ).then(m => m.default || m)
const Map = () =>
    import ('@/pages/Map' /* webpackChunkName: "/pages/Map" */ ).then(m => m.default || m)
const NoTake = () =>
    import ('@/pages/order/NoTake' /* webpackChunkName: "/pages/order/NoTake" */ ).then(m => m.default || m)
const TakeColse = () =>
    import ('@/pages/order/takeColse' /* webpackChunkName: "/pages/order/takeColse" */ ).then(m => m.default || m)
const Refund = () =>
    import ('@/pages/refund/refund' /* webpackChunkName: "/pages/refund/refund" */ ).then(m => m.default || m)
const Suggest = () =>
    import ('@/pages/suggest/suggest' /* webpackChunkName: "/pages/suggest/suggest" */ ).then(m => m.default || m)
const Withdraw = () =>
    import ('@/pages/withdraw/withdraw' /* webpackChunkName: "/pages/withdraw/withdraw" */ ).then(m => m.default || m)
const Banner = () =>
    import ('@/pages/banner/banner' /* webpackChunkName: "/pages/banner/banner" */ ).then(m => m.default || m)    
Vue.use(Router);

// 路由后记住滚动条的位置
const scrollBehavior = (to, from, savedPosition) => {
        // SavedPosition is only available for popstate navigations.
        if (savedPosition) {
            return savedPosition
        } else {
            let position = {}
                // If no children detected
            if (to.matched.length < 2) {
                // Scroll to the top of the page
                position = { x: 0, y: 0 }
            } else if (to.matched.some((r) => r.components.default.scrollToTop)) {
                // If one of the children has scrollToTop option set to true
                position = { x: 0, y: 0 }
            }
            // If link has anchor, scroll to anchor by returning the selector
            if (to.hash) {
                position = { selector: to.hash }
            }
            return position
        }
    }
    // 注册路由
const router = new Router({
    mode: 'history',
    base: '/youlemo/', //项目的根名称 如：localhost:3000/sangjie/panel/index
    linkActiveClass: 'b-link-active',
    linkExactActiveClass: 'b-c-link-active',
    scrollBehavior,
    routes: [{
            name: '/',
            path: '/',
            component: App
        },
        { name: 'login', path: '/login', component: Login },
        {
            name: 'manager',
            path: '/manager',
            component: Manager,
            children: [
                { name: "manager", path: '/manager/index', component: Index },
                { name: "order", path: '/manager/order', component: Index },
                { name: "order-index", path: '/manager/index', component: Index },
                { name: "order-accomplish", path: '/manager/accomplish', component: Accomplish },
                // { name: "order-evaluate", path: 'evaluate', component: Evaluate },
                { name: "order-make", path: '/manager/make', component: Make },
                { name: "order-NoTake", path: '/manager/NoTake', component: NoTake },
                { name: "order-awaitTake", path: '/manager/awaitTake', component: AwaitTake },
                { name: "order-awaitClose", path: '/manager/awaitClose', component: AwaitClose },
                // { name: "order-refund", path: '/manager/refund', component: Refund },
                { name: "order-takeColse", path: '/manager/takeColse', component: TakeColse },
                { name: 'business', path: '/manager/business', component: BusinessList },
                { name: 'business-list', path: '/manager/list', component: BusinessList },
                { name: 'business-order', path: '/manager/business-order', component: BusinessOrder },
                { name: 'goods-goods', path: '/manager/goods', component: Goods },
                { name: 'goods-sort', path: '/manager/sort', component: Sort },
                { name: 'Map', path: '/manager/Map', component: Map },
                { name: 'activity-activity', path: '/manager/activity', component: Activity },
                { name: 'finance-finance', path: '/manager/finance', component: Finance },
                { name: 'generalize-generalize', path: '/manager/generalize', component: Generalize },
                { name: 'refund', path: '/manager/refund', component: Refund },
                { name: 'suggest', path: '/manager/suggest', component: Suggest },
                { name: 'withdraw', path: '/manager/withdraw', component: Withdraw },
                { name: 'banner', path: '/manager/banner', component: Banner },
            ]
        },
        // { name: '404', path: '/*', component: page404 },
    ]
});

/**
 * 路由守卫，用于拦截路由跳转
 * to   从哪儿来
 * from 到哪儿去
 * next 必须执行才能路由过去
 */
router.beforeEach((to, from, next) => {
    // debugger;
    // if (to.path === '/login') {
    //     next();
    // } else {
    //     if (sessionStorage.username) {
    //         next();
    //     } else {
    //         next({ path: 'login' })
    //     }
    // }
    // console.log(from)
    // clearInterval(this.timer)
    next()
});
export default router