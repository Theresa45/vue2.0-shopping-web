import {
  reqShopCartList,
  reqDeleteCartById,
  reqUpdateSkuCheckedById,
} from "@/api";
import { getUUID } from "@/utils/uuid_token";
// state：存储数据的仓库
const state = {
  cartList: [],
  //vuex仓库存储用户临时身份,vuex存储数据确实非持久化的，SET_USERID执行返回结果,可是本地存储获取的！！
  uuid_token: getUUID(),
};
// mutations：修改state的唯一手段
const mutations = {
  GETCARTLIST(state, value) {
    state.cartList = value;
  },
};
// actions：处理业务逻辑
const actions = {
  // 通过调用api里的接口函数，向服务器发送请求，获取数据，并存放到state对象中
  // 解构出context对象中的commit
  async getCartList({ commit }) {
    const result = await reqShopCartList();
    if (result.code === 200) {
      commit("GETCARTLIST", result.data);
    }
  },
  // 删除购物车的商品
  async deleteCartById({ commit }, skuId) {
    const result = await reqDeleteCartById(skuId);
    if (result.code === 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("fail"));
    }
  },
  // 切换商品状态
  async updateSkuCheckedById({ commit }, { skuId, isChecked }) {
    const result = await reqUpdateSkuCheckedById(skuId, isChecked);
    if (result.code === 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("fail"));
    }
  },
  deleteAllCheckedCart({ dispatch, getters }) {
    // 遍历删除购物车所有选中的商品
    // 无论在哪，调用actions里的函数都是使用dispatch
    let promiseAll = [];
    getters.cartInfo.cartInfoList.forEach((cart) => {
      if (cart.isChecked === 1) {
        const promise = dispatch("deleteCartById", cart.skuId);

        promiseAll.push(promise);
      }
    });
    return Promise.all(promiseAll);
  },
  updateAllChecked({ dispatch, getters }, isChecked) {
    let promiseAll = [];
    getters.cartInfo.cartInfoList.forEach((cart) => {
      const promise = dispatch("updateSkuCheckedById", {
        skuId: cart.skuId,
        isChecked: isChecked,
      });
      promiseAll.push(promise);
    });
    return Promise.all(promiseAll);
  },
};
// getters：类似计算属性，用于简化state数据
const getters = {
  //计算数组里面第一个元素：对象
  cartInfo(state) {
    return state.cartList[0] || {};
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
