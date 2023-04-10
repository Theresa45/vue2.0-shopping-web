<template>
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>HiShopping欢迎您！</p>
          <!-- 没有登录：显示登录与注册按钮 -->
          <p v-if="!nickName">
            <span>请</span>
            <!-- 声明式导航：必须设置to属性 -->
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <!-- 已登录，显示用户名与退出登录按钮 -->
          <p v-else>
            <!-- 声明式导航：必须设置to属性 -->
            <router-link to="/login">{{ nickName }}</router-link>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center/myorder">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="Logo"
        /></router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <!--  编程式导航：需要使用$router来实现路由跳转 -->
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="goSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AppHeader",
  data() {
    return {
      // 收集用户输入的搜索关键字
      keyword: "",
    };
  },
  computed: {
    // 从vuex获取用户信息
    ...mapGetters(["nickName"]),
  },
  methods: {
    // 搜索按钮的点击事件的事件处理程序：跳转到Search路由
    goSearch() {
      // 通过路由传递数据给路由组件
      // 如果搜索关键词是空串，那么实际上，是将参数都设置为undefined，即不给路由组件传递参数了
      const location = {
        name: "search",
        params: { keyword: this.keyword || undefined },
      };

      // 如果路径上有query参数，需要携带上
      if (this.$route.query)
        location.query = { ...this.$route.query, ...location.query };
      this.$router.push(location);
    },
    async logout() {
      try {
        // 发送请求
        // 清除token及用户信息
        await this.$store.dispatch("userLogout");
        this.$router.push("/login");
      } catch (error) {
        alert(error.message);
      }
    },
  },
  mounted() {
    // 任意组件间通信：全局事件总线
    // 通过全局事件总线清除关键字
    this.$bus.$on("clearSearchKeyword", () => {
      this.keyword = "";
    });
  },
  beforeDestroy() {
    this.$bus.$off("clearSearchKeyword");
  },
};
</script>

<style scoped lang="less">
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 100px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>
