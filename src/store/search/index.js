// search模块的store
// 引入发送请求的函数
import { reqSearchInfo } from "@/api";
// state：存储数据的仓库
const state = {
  searchInfo: {},
};
// mutations：修改state的唯一手段
const mutations = {
  GETSEARCHINFO(state, value) {
    state.searchInfo = value;
  },
};
// actions：处理业务逻辑
const actions = {
  // 通过调用api里的接口函数，向服务器发送请求，获取数据，并存放到state对象中
  // 解构出context对象中的commit
  // 传递给服务器的参数params至少是个空对象，即params默认参数是一个空对象
  async getSearchInfo({ commit }, params = {}) {
    // 发送请求
    const result = await reqSearchInfo(params);
    // 如果请求成功，那就通知mutations
    if (result.code === 200) commit("GETSEARCHINFO", result.data);
  },
};

// getters：类似计算属性，用于简化state数据
const getters = {
  attrsList(state) {
    // 没有网络的情况下，即无法获取数据的情况下希望能返回一个空数组
    return state.searchInfo.attrsList || [];
  },
  goodsList(state) {
    // 还没有发送请求时，searchInfo是个空对象
    return state.searchInfo.goodsList || [];
  },
  trademarkList(state) {
    return state.searchInfo.trademarkList || [];
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
