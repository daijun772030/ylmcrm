import create from '../plugin/myapi';
import store from './store.js'

function orderAll() {
    // debugger;
    // var music = 'music';
    create('orderAll', {
        params: {
            pageNum: "1",
            pageSize: "1000",
            type: "0"
        }
    }).then((res) => {
        console.log(res)
        let list = [];
        var resList = res.data.data.list;
        for (let i = 0; i < resList.length; i++) {
            if (resList[i].refundStatus == 10 && resList[i].type == 0) {
                list.push(resList[i])
                console.log(list)
            }
        }
        var num = list.length;
        console.log(num)
        var newTotalCount = {
            newTotalCount: num,
            id: store.state.id
        };
        store.commit('increment', newTotalCount);
        console.log("订单数量" + store.state.newTotalCount);
        console.log(store.state.id)
        if (newTotalCount.newTotalCount > 0) {
            var audio = document.getElementById('music');
            console.log(audio);
            audio.play();
        } else {
            console.log("没有订单")
        }
    })
}
const timer = function() {
    // debugger;
    orderAll();
    setInterval(() => {
        orderAll();
    }, 60000);
}
export default timer;