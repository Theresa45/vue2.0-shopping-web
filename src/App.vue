<template>
  <div id="app">
    <!-- 每一个页面下都有显示 -->
    <AppHeader></AppHeader>
    <!-- 标记路由组件展示的位置 -->
    <router-view></router-view>
    <!-- 除了登录页和注册页不显示外，其他页面下都有显示 -->
    <AppFooter v-show="$route.meta.showFooter"></AppFooter>
  </div>
</template>

<script>
import AppFooter from "./components/Footer";
import AppHeader from "./components/Header";

export default {
  name: "App",
  components: {
    AppHeader,
    AppFooter,
  },
  mounted() {
    //通知Vuex发送请求，获取数据，将数据存放到store对象中
    this.$store.dispatch("getCategoryList");
  },
};
</script>

<style></style>
