import { reqTrade, reqUserAddressList } from "@/api";
// state：存储数据的仓库
const state = {
  userAddressList: [],
  trade: {},
};
// mutations：修改state的唯一手段
const mutations = {
  GETUSERADDRESSLIST(state, value) {
    state.userAddressList = value;
  },
  GETRADE(state, value) {
    state.trade = value;
  },
};
// actions：处理业务逻辑
const actions = {
  async getUserAddressList({ commit }) {
    const result = await reqUserAddressList();
    if (result.code === 200) {
      commit("GETUSERADDRESSLIST", result.data);
    }
  },
  async getTrade({ commit }) {
    const result = await reqTrade();
    if (result.code === 200) {
      commit("GETRADE", result.data);
    }
  },
};
// getters：类似计算属性，用于简化state数据
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
