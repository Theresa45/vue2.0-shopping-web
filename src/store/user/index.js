import {
  reqGetCode,
  reqUserRegister,
  reqUserLogin,
  reqUserInfo,
  reqLogout,
} from "@/api";

// state：存储数据的仓库
const state = {
  code: "",
  // 初始时，是none，还未登录的状态，如果已登录，重新加载页面，是从本地存储中获取token，不会再需要重新登录刷新token了
  token: localStorage.getItem("TOKEN"),
  userInfo: {},
};
// mutations：修改state的唯一手段
const mutations = {
  GETCODE(state, value) {
    state.code = value;
  },
  USERLOGIN(state, value) {
    state.token = value;
  },
  GETUSERINFO(state, value) {
    state.userInfo = value;
  },
  CLEAR(state, value) {
    state.token = "";
    state.userInfo = {};
    localStorage.removeItem("TOKEN");
  },
};
// actions：处理业务逻辑
const actions = {
  // 通过调用api里的接口函数，向服务器发送请求，获取数据，并存放到state对象中
  // 解构出context对象中的commit
  async getCode({ commit }, phone) {
    const result = await reqGetCode(phone);
    if (result.code === 200) {
      commit("GETCODE", result.data);
      return "ok";
    } else {
      return Promise.reject(new Error("fail"));
    }
  },

  // 用户注册
  async userRegister({ commit }, user) {
    const result = await reqUserRegister(user);
    if (result.code === 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("fail"));
    }
  },

  // 用户登录:token
  async userLogin({ commit }, user) {
    const result = await reqUserLogin(user);
    if (result.code === 200) {
      // 登录成功会返回一个用户信息
      commit("USERLOGIN", result.data.token);
      // 持久化存储
      localStorage.setItem("TOKEN", result.data.token);
      return "ok";
    } else {
      return Promise.reject(new Error("fail"));
    }
  },

  //获取用户信息
  async getUserInfo({ commit }) {
    const result = await reqUserInfo();
    if (result.code == 200) {
      commit("GETUSERINFO", result.data);
      return "ok";
    } else {
      return Promise.reject(new Error("fail"));
    }
  },
  // 退出登录
  async userLogout({ commit }) {
    const result = await reqLogout();
    if (result.code === 200) {
      commit("CLEAR");
      return "ok";
    } else {
      return Promise.reject(new Error("fail"));
    }
  },
};
// getters：类似计算属性，用于简化state数据
const getters = {
  nickName(state) {
    return state.userInfo.nickName || "";
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
