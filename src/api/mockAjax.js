// 专门用于向mock发送AJAX请求的
// 对axios进行二次封装
import axios from "axios";
// 引入进度条，引入的是一个对象
import nprogress from "nprogress";
import "nprogress/nprogress.css";

// start：开始进度条 done：结束进度条

// 创建一个axios实例
const requests = axios.create({
  // 如果 `url` 是一个相对 URL，`baseURL` 将自动加在 `url` 前面。
  // 如果 `url` 是一个绝对 URL，`baseURL` 将自动加在 `url` 后面。
  baseURL: "/mock",
  timeout: 5000,
});

//请求拦截器：在发送请求前拦截请求，对请求进行一些处理。
// 添加请求拦截器
requests.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // config是一个配置对象，对象里最重要的属性是请求头header
    // 启动进度条
    nprogress.start();
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器：在响应被接收之前拦截响应，对响应进行一些处理。
// 添加响应拦截器
requests.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // 结束进度条
    nprogress.done();
    return response.data;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default requests;
