export default [{
        id: "0",
        name: "订单管理",
        path: "/manager/index",
        icon: "order",
        children: [
            {
                id: "1",
                name: "支付订单",
                path: "/manager/index",
                icon: "resource",
                children: []
            },
            {
                id: "2",
                name: "退款管理",
                path: "/manager/refund",
                icon: "resource",
                children: []
            }
        ]
    },
    // {
    //     id: "1",
    //     name: "财务管理",
    //     path: "/manager/business",
    //     icon: "resource",
    //     children: [{
    //             id: 1,
    //             name: "商家财务详情",
    //             path: "/manager/list",
    //             icon: "resource",
    //             children: []
    //         }
    //         // {
    //         //     id: 2,
    //         //     name: "其它",
    //         //     path: "/manager/business-order",
    //         //     icon: "resource",
    //         //     children: []
    //         // },

    //     ]
    // },
    // {
    //     id: "1",
    //     name: "活动管理",
    //     path: "/manager/activity",
    //     icon: "resource",
    //     children: []
    // },
    {
        id: "1",
        name: "商品管理",
        path: "/manager/goods",
        icon: "resource",
        children: [{
                id: 1,
                name: "商品种类",
                path: "/manager/sort",
                icon: "resource",
                children: []
            },
            {
                id: 2,
                name: "商品管理",
                path: "/manager/goods",
                icon: "resource",
                children: []  
            }
            // {
            //     id: 2,
            //     name: "其它",
            //     path: "/manager/business-order",
            //     icon: "resource",
            //     children: []
            // },

        ]
    },
    {
        id: "2",
        name: "提现管理",
        path: "/manager/withdraw",
        icon: "resource",
        children: []
    },
    {
        id: "3",
        name: "客户诉求",
        path: "/manager/suggest",
        icon: "resource",
        children: []
    },
    {
        id: "4",
        name: "轮播图管理",
        path: "/manager/banner",
        icon: "resource",
        children: []
    },
];