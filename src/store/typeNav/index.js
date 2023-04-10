// typeNav模块的store
import { reqCategoryList } from "@/api";

// state：存储数据的仓库
const state = {
  categoryList: [],
};
// mutations：修改state的唯一手段
const mutations = {
  GETCATEGORYLIST(state, value) {
    state.categoryList = value;
  },
};
// actions：处理业务逻辑
const actions = {
  // 通过调用api里的接口函数，向服务器发送请求，获取数据，并存放到state对象中
  // 解构出context对象中的commit
  async getCategoryList({ commit }) {
    const result = await reqCategoryList();
    if (result.code === 200) commit("GETCATEGORYLIST", result.data);
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
