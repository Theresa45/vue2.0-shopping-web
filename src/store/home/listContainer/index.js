// listContainer模块的store
import { reqMockBanner } from "@/api";

// state：存储数据的仓库
const state = {
  bannerList: [],
};
// mutations：修改state的唯一手段
const mutations = {
  BANNERLIST(state, value) {
    state.bannerList = value;
  },
};
// actions：处理业务逻辑
const actions = {
  // 通过调用api里的接口函数，向服务器发送请求，获取数据，并存放到state对象中
  // 解构出context对象中的commit
  async BannerList({ commit }) {
    const result = await reqMockBanner();
    if (result.code === 200) commit("BANNERLIST", result.data);
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
