<template>
  <div>
    <!-- 全局组件：商品分类列表 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread：面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!--面包屑：分类名  -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">×</i>
            </li>
            <!-- 面包屑：关键字 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <!-- 面包屑：品牌 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1]
              }}<i @click="removeTrademark">×</i>
            </li>

            <!-- 面包屑：商品属性值 -->
            <li
              class="with-x"
              v-for="(attrValue, index) in searchParams.props"
              :key="index"
            >
              {{ attrValue.split(":")[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector：选择器-->
        <SearchSelector />

        <!--details：详情页-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- 默认综合排序 -->
                <!-- 如果不是综合排序，则不激活背景颜色 -->
                <li :class="{ active: isActiveOne }" @click="changeOrder('1')">
                  <a
                    >综合<i
                      v-if="isActiveOne"
                      :class="{
                        'el-icon-bottom': isDesc,
                        'el-icon-top': isAsc,
                      }"
                    ></i
                  ></a>
                </li>
                <li :class="{ active: isActiveTwo }" @click="changeOrder('2')">
                  <a
                    >价格<i
                      v-if="isActiveTwo"
                      :class="{
                        'el-icon-bottom': isDesc,
                        'el-icon-top': isAsc,
                      }"
                    ></i
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 商品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- a标签可以使用声明式导航进行路由跳转 -->
                    <!-- 因为需要传参，所以需要动态传入参数 -->
                    <!-- 必须带上参数否则会丢失路由 -->
                    <router-link :to="`/detail/${good.id}`"
                      ><img :src="good.defaultImg"
                    /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>&nbsp;
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" :title="good.title">{{
                      good.title
                    }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <div class="fr page">
            <!-- 模拟数据进行调试 -->
            <Pagination
              :pageNo="searchParams.pageNo"
              :pageSize="searchParams.pageSize"
              :total="total"
              :pageCount="5"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
import { mapState, mapGetters } from "vuex";
export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  data() {
    return {
      // Search组件中需要发送给服务器的参数params
      // 这些key是服务器设置好的，不可以随便瞎写的
      searchParams: {
        category1Id: "", //一级分类的id
        category2Id: "", //二级分类的id
        category3Id: "", //三级分类的id
        categoryName: "", //商品的名字
        keyword: "", //用户搜索的关键字
        props: [], //商品属性的搜索条件【"属性ID:属性值:属性名"】
        trademark: "", //品牌的搜索条件 【ID:品牌名】
        order: "1:desc", //排序的参数 【默认初始值:1:desc】【1：综合 2：价格 asc：升序 desc：降序】
        pageNo: 1, //当前分页器的页码  【默认初始值:1】
        pageSize: 3, //代表当前一页显示几条数据 【默认初始值:10】
      },
    };
  },
  computed: {
    //访问大仓库里的state数据要指定模块，而访问getters不需要。
    //所以使用数组写法，指定需要的属性名即可
    ...mapGetters(["goodsList"]),
    isActiveOne() {
      return this.searchParams.order.indexOf("1") !== -1;
    },
    isActiveTwo() {
      return this.searchParams.order.indexOf("2") !== -1;
    },
    isAsc() {
      return this.searchParams.order.indexOf("asc") !== -1;
    },
    isDesc() {
      return this.searchParams.order.indexOf("desc") !== -1;
    },
    ...mapState({
      total: (state) => state.search.searchInfo.total,
    }),
  },
  //组件挂载完毕执行一次，只执行一次
  mounted() {
    //因为Search组件要求会根据不同的路由参数发送不同的请求，获取不同的数据进行展示，所以每一次发送请求前都要整理路由参数。
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
    // 发送请求
    this.getData();
    this.$bus.$on("getTrademark", this.getTrademark);
    this.$bus.$on("getAttrValue", this.getAttrValue);
    this.$bus.$on("getPageNo", this.getPageNo);
  },
  beforeDestroy() {
    this.$bus.$off(["getTrademark", "getAttrValue", "getPageNo"]);
  },
  // 监听实例对象上的属性的属性值的变化
  watch: {
    // 可以监听路由的变化
    $route() {
      //每一次请求发送完毕，把用户存储的1|2|3级别ID清除，以便接收下一次的1|2|3级别ID
      this.clearCategoryId();
      //路由变化整理参数：手机最新的商品名字、商品1|2|3ID
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      //再次发请求
      this.getData();
    },
  },
  methods: {
    // 发送请求
    getData() {
      this.$store.dispatch("getSearchInfo", this.searchParams);
    },
    //商品1|2|3ID只能存在一个，所以每次整理参数之前先把用户前面存储的1|2|3级别ID清除
    clearCategoryId() {
      //发ajax的时候,属性值为undefind,甚至参数K都不携带了【10个搜索条件,可有可无的】
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
    },
    // 面包屑——删除分类名
    removeCategoryName() {
      this.searchParams.categoryName = undefined;

      // 直接跳转路由就会触发请求发送
      // 修改路径：跳转路由，自己跳自己
      let location = { name: "search" };
      // query参数是存储商品分类数据的，所以如果要修改路径，就不能传入query参数，而是带上params参数
      if (this.$route.params) location.params = this.$route.params;

      this.$router.push(location);
    },
    // 面包屑——删除关键字
    removeKeyword() {
      this.searchParams.keyword = undefined;

      this.$bus.$emit("clearSearchKeyword");

      // 直接跳转路由就会触发请求发送
      // 修改路径：跳转路由，自己跳自己
      let location = { name: "search" };
      // params参数是存储搜索关键词数据的，所以如果要修改路径，就不能传入params参数，而是带上query参数
      if (this.$route.query) location.query = this.$route.query;

      this.$router.push(location);
    },
    getTrademark(trademark) {
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      this.getData();
    },
    removeTrademark() {
      this.searchParams.trademark = undefined;
      this.getData();
    },
    getAttrValue(attr, attrValue) {
      const prop = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      // 数组去重
      // 方法一：
      if (this.searchParams.props.indexOf(prop) === -1)
        this.searchParams.props.push(prop);
      // 方法二：ES6新增语法
      // this.searchParams.props = Array.from(new Set(this.searchParams.props));
      this.getData();
    },
    removeAttr(index) {
      // 重新整理参数
      this.searchParams.props.splice(index, 1);
      this.getData();
    },
    // 改变排序，要区分是综合还是价格(通过value来区分)
    changeOrder(value) {
      const sort = this.searchParams.order.split(":")[1];

      if (this.searchParams.order.indexOf(value) !== -1) {
        this.searchParams.order = `${value}:${
          sort === "desc" ? "asc" : "desc"
        }`;
      } else this.searchParams.order = `${value}:desc`;

      this.getData();
    },
    // 获取当前页码
    getPageNo(page) {
      this.searchParams.pageNo = page;
      this.getData();
    },
  },
};
</script>

<style scoped lang="less">
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        // float: right;
        margin: auto;
      }
    }
  }
}
</style>
