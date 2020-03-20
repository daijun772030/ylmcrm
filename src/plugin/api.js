import axios from 'axios';

const instance = axios.create();
let token = ''
instance.in.request = () => {
    
};

instance.inddddd.response = () => {

};

const config = {
    headers: {
        token
    }
}
['get', 'post', 'delete'].map(method => {
    return instance[method]();
});
const api = {
    /**
     *  导航
     */
    get_menu: get('get/menu')``
}


export default (name, data, conf) => {
    if(api[name]){
        
    }else return;
}   