import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "@/store";

// 使用插件
Vue.use(VueRouter);

// 先把VueRouter原型对象的push、replace保存一份
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

// 重写 push 和 replace 方法
// 第一个参数：要跳转的地址，第二个参数：成功回调，第三个参数：失败的回调
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject);
  } else {
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};

// 创建一个路由器，配置路由
const router = new VueRouter({
  // routes数组里每一个对象都是一个路由规则
  routes,
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    // 期望滚动到文档的顶部
    return { y: 0 };
  },
});

// 注册全局守卫
router.beforeEach(async (to, from, next) => {
  // 只要token不是个空串，就说明用户已登录
  const token = store.state.user.token;
  const nickName = store.getters.nickName;

  if (token) {
    // 已登录的不可以去注册或登录页面，强行访问只会跳转到首页
    if (to.path === "/login" || to.path === "/register") {
      next("/home");
    } else {
      //用户登陆了,而且还有用户信息【去的并非是login】
      if (nickName) {
        next();
      } else {
        //用户登陆了,但是没有用户信息
        try {
          // 已登录的用户，无论跳转到哪个页面（除了注册或登录页面），页面都会自动登录，即要获取用户信息
          // 获取用户信息：getUserInfo
          //发请求获取用户信息以后在放行
          await store.dispatch("getUserInfo");
          next();
        } catch (error) {
          //用户没有信息，还携带token发请求获取用户信息【失败】
          //token【用户唯一的标识失效了】就要重新登录
          //token失效:本地清空数据、服务器的token通知服务器清除
          await store.dispatch("userLogout");
          //回到登录页，重新获取一个新的token
          next("/login");
        }
      }
    }
  } else {
    //用户未登录:不能进入/trade、/pay、/paysuccess、/center、/center/myorder  /center/teamorder
    if (
      to.path.indexOf("trade") !== -1 ||
      to.path.indexOf("pay") !== -1 ||
      to.path.indexOf("center") !== -1
    ) {
      // 重定向未登录之前将来想去的地方
      next("/login?redirect=" + to.path);
    } else {
      next();
    }
  }
});

export default router;
