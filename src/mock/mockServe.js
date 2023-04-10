// 引入Mock对象
import { options } from "less";
import Mock from "mockjs";
//引入数据：JSON数据格式数据
//Webpack默认图片、JSON【里面不能书写export关键字】等文件资源是对外暴露的
import banner from "./banner.json";
import floor from "./floor.json";

// 不需要对外暴露，只需要在项目启动时，执行以下方法调用即可
// mock数据：第一个参数是请求的地址，第二个参数是请求获取到的数据，即服务器返回的数据
// mock默认的请求方式是GET请求
// 这部操作就是模拟指定接口返回的数据
Mock.mock("/mock/banner", { code: 200, data: banner });

Mock.mock("/mock/floor", { code: 200, data: floor });

// Mock.mock("/mock/user/login", "post", (options) => {
//   const request = JSON.parse(options.body);
//   const result = { code: 200,
//     message: "成功", data: floor ,ok: true}
//   if()
//   return ;
// });
