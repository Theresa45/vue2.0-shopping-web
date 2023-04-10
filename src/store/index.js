import Vue from "vue";
import Vuex from "vuex";
import home from "./home";
import search from "./search";
import typeNav from "./typeNav";
import listContainer from "./home/listContainer";
import floor from "./home/floor";
import detail from "./detail";
import shopCart from "./shopCart";
import user from "./user";
import trade from "./trade";
import pay from "./pay";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    home,
    search,
    typeNav,
    listContainer,
    floor,
    detail,
    shopCart,
    user,
    trade,
    pay,
  },
});
