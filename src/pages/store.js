import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        newTotalCount: null,
        id: null,
        ifAuto: null
    },
    mutations: {
        increment(state, value) {
            state.newTotalCount = value.newTotalCount;
            state.id = value.id;
            state.ifAuto = value.ifAuto;
        }
    }
})
export default store;