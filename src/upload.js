import axios from 'axios';

const APP_ID = 'wx89944c9d5bdbe9a2'
const APP_SECRET = '828d13582c120208bc962b7681739fbe'
//  创建一个axios 实例
const http = axios.create({
  baseURL:'http://localhost:3000'
});


// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
 
// 添加响应拦截器
// http.interceptors.response.use(function (response) {
//     if(response.data.code !== 0){
//         // alert(response.data.msg);
//     }else{
//         return .data
//     }
// }, function (error) {
//     return Promise.reject(error);

// })


export default http;