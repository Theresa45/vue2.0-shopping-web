// 引入路由组件
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Detail from "@/pages/Detail";
import AddCartSuccess from "@/pages/AddCartSuccess";
import ShopCart from "@/pages/ShopCart";
import Trade from "@/pages/Trade";
import Pay from "@/pages/Pay";
import PaySuccess from "@/pages/PaySuccess";
import Center from "@/pages/Center";
import MyOrder from "@/pages/Center/MyOrder";
import GroupOrder from "@/pages/Center/GroupOrder";

// 路由的配置信息
export default [
  {
    name: "home",
    path: "/home",
    component: Home,
    meta: {
      showFooter: true,
    },
  },
  {
    name: "search",
    path: "/search/:keyword?",
    component: Search,
    meta: {
      showFooter: true,
    },
  },
  {
    name: "detail",
    path: "/detail/:skuid",
    component: Detail,
    meta: {
      showFooter: true,
    },
  },
  {
    name: "addcartsuccess",
    path: "/addcartsuccess",
    component: AddCartSuccess,
    meta: {
      showFooter: true,
    },
  },
  {
    name: "shopcart",
    path: "/shopcart",
    component: ShopCart,
    meta: {
      showFooter: true,
    },
  },
  {
    name: "trade",
    path: "/trade",
    component: Trade,
    meta: {
      showFooter: true,
    },
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      if (from.path === "/shopcart") {
        next();
      } else {
        next(false);
      }
    },
  },
  {
    name: "pay",
    path: "/pay",
    component: Pay,
    meta: {
      showFooter: true,
    },
    beforeEnter: (to, from, next) => {
      if (from.path === "/trade") {
        next();
      } else {
        next(false);
      }
    },
  },
  {
    name: "paysuccess",
    path: "/paysuccess",
    component: PaySuccess,
    meta: {
      showFooter: true,
    },
  },
  {
    name: "center",
    path: "/center",
    component: Center,
    meta: {
      showFooter: true,
    },
    // 二级路由：不带反斜杠或者写全
    children: [
      {
        name: "myorder",
        path: "myorder",
        component: MyOrder,
      },
      {
        name: "grouporder",
        path: "grouporder",
        component: GroupOrder,
      },
      // 重定向，当用户在项目允许时访问 /center ，浏览器会立即定向到/center/myorder
      {
        path: "/center",
        redirect: "/center/myorder",
      },
    ],
  },
  {
    name: "login",
    path: "/login",
    component: Login,
  },
  {
    name: "register",
    path: "/register",
    component: Register,
  },
  // 重定向，当用户在项目允许时访问 / ，浏览器会立即定向到首页
  {
    path: "*",
    redirect: "/home",
  },
];
