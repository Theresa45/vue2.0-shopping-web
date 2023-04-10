// 统一管理API
import requests from "./request";
import mockRequests from "./mockAjax";

// 三级联动的API
// 请求地址：/api/product/getBaseCategoryList 请求方法：GET 无参数

// 只需要暴露一个函数，其他模块就可以在引入该函数后，通过调用函数发送请求

// 发送请求获取三级联动组件的数据
// 发送请求:axios请求发送成功返回的响应结果是一个Promise对象
export const reqCategoryList = () =>
  requests({
    url: "/product/getBaseCategoryList",
    method: "get",
  });

// 发送请求获取轮播图的mock数据
export const reqMockBanner = () => mockRequests.get("/banner");

// 发送请求获取楼层的mock数据
export const reqMockFloor = () => mockRequests.get("/floor");

// 发送请求获取Search组件的数据
// 接口地址：/api/list，请求方式：POST
// POST请求方式需要参数，所以需要给回调函数传入参数。
// data要求接收一个对象作为请求体被发送的数据
// 传递给服务器的参数params至少是个空对象，即params默认参数是一个空对象
export const reqSearchInfo = (params) => {
  return requests({
    url: "/list",
    method: "post",
    data: params,
  });
};

// 发送请求获取Detail路由组件的数据
// 请求地址：/api/item/{skuid} 请求方式：GET 参数：必需传入参数skuid
// method属性值默认为get
export const reqGoodInfo = (skuId) =>
  requests({
    url: `/item/${skuId}`,
  });

// 发送请求获取Cart路由组件的数据
// 添加或修改购物车都是通过该接口
// 请求地址：/api/cart/addToCart/{skuid}/{skuNum} 请求方式：POST 参数：必需传入参数skuid、参数skuNum
export const reqAddOrUpdateShopCart = (skuId, skuNum) =>
  requests({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: "post",
  });

// 获取购物车列表
// 请求地址：/api/cart/cartList 请求方式：GET
export const reqShopCartList = () =>
  requests({
    url: "/cart/cartList",
  });

// 删除购物车中的商品
// /api/cart/deleteCart/{skuId}
// 请求方式：DELETE
export const reqDeleteCartById = (skuId) =>
  requests({
    url: `/cart/deleteCart/${skuId}`,
    method: "delete",
  });

// 切换商品状态
// /api/cart/checkCart/{skuID}/{isChecked}
// GET
export const reqUpdateSkuCheckedById = (skuId, isChecked) =>
  requests({
    url: `/cart/checkCart/${skuId}/${isChecked}`,
  });

// 给服务器发送手机号码获取验证码
// /api/user/passport/sendCode/{phone}
// GET
export const reqGetCode = (phone) =>
  requests({
    url: `/user/passport/sendCode/${phone}`,
  });

// /api/user/passport/register
// post
// 必须带参数：手机号、密码、验证码
export const reqUserRegister = (data) =>
  requests({
    url: "/user/passport/register",
    method: "post",
    data,
  });

// /api/user/passport/login
// post
// 必须带参数：手机号、密码
export const reqUserLogin = (data) =>
  requests({
    url: "/user/passport/login",
    method: "post",
    data,
  });

// 获取用户信息
// /api/user/passport/auth/getUserInfo
// get
export const reqUserInfo = () =>
  requests({
    url: "/user/passport/auth/getUserInfo",
  });

// 退出登录
// /api/user/passport/logout
// GET
export const reqLogout = () =>
  requests({
    url: "/user/passport/logout",
  });

// 获取用户地址信息
// /api/user/userAddress/auth/findUserAddressList
// get
export const reqUserAddressList = () =>
  requests({
    url: "/user/userAddress/auth/findUserAddressList",
  });

// 获取交易页面的信息
// /api/order/auth/trade
// GET
export const reqTrade = () =>
  requests({
    url: "/order/auth/trade",
  });

// 提交订单
// /api/order/auth/submitOrder?tradeNo={tradeNo}
// POST
export const reqSubmitOrder = ({ tradeNo, data }) =>
  requests({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    method: "post",
    data,
  });

// 获取订单支付信息
// /api/payment/weixin/createNative/{orderId}
// GET
export const reqPayment = (orderId) =>
  requests({
    url: `/payment/weixin/createNative/${orderId}`,
  });

// 查询订单支付状态
// /api/payment/weixin/queryPayStatus/{orderId}
// GET
export const reqPayStatus = (orderId) =>
  requests({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
  });

// 获取个人中心的我的订单数据
// /api/order/auth/{page}/{limit} page:页码，limit：每页显示的数量
// GET
export const reqMyOrderList = (page, limit) =>
  requests({
    url: `/order/auth/${page}/${limit}`,
  });
