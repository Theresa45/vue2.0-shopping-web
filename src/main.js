import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import TypeNav from "@/components/TypeNav";
import Carousel from "@/components/Carousel";
import Pagination from "@/components/Pagination";
import store from "./store";

// 导入文件就是将文件加入执行队列中
import "@/mock/mockServe.js";

// 引入Swiper样式
import "swiper/css/swiper.min.css";
import { Icon, MessageBox } from "element-ui";
// 只一次就引入所有接口，并且所有组件都可以用。
import * as API from "@/api";
import "@/plugins/validate";
Vue.config.productionTip = false;

// 将三级联动组件注册为全局组件
Vue.component("TypeNav", TypeNav);
// 将轮播图注册为全局组件
Vue.component("Carousel", Carousel);
// 将分页器注册为全局组件
Vue.component("Pagination", Pagination);
Vue.use(Icon);

import VueLazyload from "vue-lazyload";

Vue.use(VueLazyload);
new Vue({
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this;
    //只一次就引入所有接口，并且所有组件都可以用。
    Vue.prototype.$API = API;
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
  },
  // 注册路由，此时所有组件身上都有$route、$router属性
  router,
  // 注册store
  store,
}).$mount("#app");
