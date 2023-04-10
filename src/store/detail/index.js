// detail模块的store
import { reqGoodInfo, reqAddOrUpdateShopCart } from "@/api";
// state：存储数据的仓库
const state = {
  goodInfo: {},
};
// mutations：修改state的唯一手段
const mutations = {
  GETGOODINFO(state, value) {
    state.goodInfo = value;
  },
};
// actions：处理业务逻辑
const actions = {
  // 存储服务器返回的产品信息
  async getGoodInfo({ commit }, skuid) {
    const result = await reqGoodInfo(skuid);
    if (result.code === 200) commit("GETGOODINFO", result.data);
  },
  //加入购物车，给服务器发送请求，让服务器添加购物车信息
  // 修改购物车信息：商品个数及商品销售属性
  // 解构对象
  // 这个请求，服务器只会返回成功信号，不会返回内容，所以不需要存储数据
  // 所以这个行为函数只需要返回请求的成功或失败信号（难点：将信息返回给组件）即可
  // 使用了async/await语法的函数一定会返回一个Promise，所以可以设置Promise来给组件返回信息
  async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
    const result = await reqAddOrUpdateShopCart(skuId, skuNum);
    if (result.code === 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("fail"));
    }
  },
};
// getters：类似计算属性，用于简化state数据
const getters = {
  category(state) {
    return state.goodInfo.categoryView || {};
  },
  skuInfo(state) {
    return state.goodInfo.skuInfo || {};
  },
  spuSaleAttrList(state) {
    return state.goodInfo.spuSaleAttrList || [];
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
