<template>
  <!-- 商品分类列表 -->
  <div class="type-nav">
    <div class="container">
      <!-- 事件委派解决鼠标移除问题：当鼠标在全部商品分类时，鼠标移除事件不会触发 -->
      <!--  -->
      <div @mouseleave="leaveHandler" @click="goSearch">
        <h2 class="all" @mouseenter="ShowCategoryList">全部商品分类</h2>
        <!-- 实现过渡动画 -->
        <transition name="sort">
          <div class="sort" v-show="isShowCategoryList">
            <div class="all-sort-list2">
              <!-- 控制一级分类的激活样式（active: currentIndex === index） -->
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
              >
                <h3
                  :class="{ active: currentIndex === index }"
                  @mouseenter="changeBackgroundColor(index)"
                >
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- 通过JS实现动态行内样式(切换display:none|block)，控制二级、三级分类的显示与隐藏 -->
                <!-- 当鼠标悬浮在一级分类的链接上时，将二、三级分类的display设置为block -->
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <!-- 二级分类 -->
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <!-- 三级分类 -->
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
// 利用辅助函数获取仓库中的state数据--->mapState
import { mapState } from "vuex";
// 按需引入
import throttle from "lodash/throttle";

export default {
  name: "TypeNav",
  data() {
    return {
      // 存储当前用户鼠标所悬浮的在一级分类的索引值上，-1：未悬浮在任何的一级分类上，默认为没有悬浮在一级分类上
      currentIndex: -1,
      // 控制商品分类列表的显示与隐藏，默认为显示
      isShowCategoryList: true,
    };
  },
  computed: {
    // 对象写法：将会生成一个新的计算属性categoryList
    // categoryList的属性值为箭头函数的返回值
    // 箭头函数接收到的是大仓库中的state数据，所以还要指定仓库中的模块名
    ...mapState({
      categoryList: (state) => state.typeNav.categoryList,
    }),
  },
  // TypeNav在Home路由与Search路由下状态不一样的。可以通过组件实例对象上的$route知道当前TypeNav所处的路由
  mounted() {
    if (this.$route.path !== "/home") {
      this.isShowCategoryList = false;
    }
  },
  methods: {
    // 使用JS控制一级分类的激活样式
    changeBackgroundColor: throttle(function (index) {
      this.currentIndex = index;
    }, 10),
    //鼠标移出事件
    leaveHandler() {
      //鼠标移出一级分类的激活样式消失
      this.currentIndex = -1;
      //隐藏商品分类列表
      if (this.$route.path !== "/home") {
        this.isShowCategoryList = false;
      }
    },
    // 鼠标移入全部商品分类选项就会显示商品分类列表
    ShowCategoryList() {
      if (this.$route.path !== "/home") this.isShowCategoryList = true;
    },
    // 将所有锚元素的点击事件委托给父节点，那么事件回调函数就只有一个。
    goSearch(event) {
      const targetNode = event.target;
      // 用于区分出父节点的锚元素，以及区分出商品的一、二、三级分类。
      const { categoryname, category1id, category2id, category3id } =
        targetNode.dataset;

      // 用于区分出父节点的锚元素
      if (categoryname) {
        // 路由跳转的目的地
        // 放在块作用域里的原因：每一次跳转，原来的路由都要清空
        const location = {
          name: "search",
          query: {
            categoryName: categoryname,
          },
        };

        // 用于区分出商品的一、二、三级分类,
        if (category1id) location.query.category1Id = category1id;
        if (category2id) location.query.category2Id = category2id;
        if (category3id) location.query.category3Id = category3id;

        // 如果路由跳转时携带有params参数，也要捎带上
        if (this.$route.params.keyword) location.params = this.$route.params;

        // 实现编程式路由跳转
        this.$router.push(location);
      }
    },
  },
};
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 47px;
      width: 210px;
      height: 510px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }

            // 控制一级样式背景颜色
            &.active {
              background-color: rgba(39, 2, 2, 0.1);
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          // 样式控制二、三级分类显示与隐藏
          // &:hover {
          //   .item-list {
          //     display: block;
          //   }
          // }
        }

        // 突出显示鼠标悬浮所在的链接上
        // .cur {
        //   background-color: skyblue;
        // }
      }
    }

    // 过渡动画的样式
    // 过渡动画开始状态（进入）
    .sort-enter {
      height: 0px;
    }
    // 过渡动画结束状态（进入）
    .sort-enter-to {
      height: 461px;
    }

    // 定义动画的时间、速率
    .sort-enter-active {
      transition: all 0.3s linear;
    }
  }
}
</style>
