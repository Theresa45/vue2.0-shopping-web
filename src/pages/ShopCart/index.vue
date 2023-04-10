<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked === 1"
              @change="updateSkuCheckedById(cart, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">
              {{ cart.skuName }}
            </div>
          </li>

          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="minsSkuNum(cart)"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="cart.skuNum"
              minnum="1"
              class="itxt"
              @change="changeSkuNum($event.target.value * 1, cart)"
            />
            <a href="javascript:void(0)" class="plus" @click="addSkuNum(cart)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuPrice * cart.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteCartById(cart)"
              >删除</a
            >
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllChecked && cartInfoList.length > 0"
          @change="updateAllChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a href="#none" @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
          <!-- <a
            class="sum-btn"
            href="###"
            target="_blank"
            @click="$router.push('/trade')"
            >结算</a
          > -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
//按需引入lodash节流函数
import throttle from "lodash/throttle";
//按需引入lodash防抖函数
import debounce from "lodash/debounce";
export default {
  name: "ShopCart",
  computed: {
    ...mapGetters(["cartInfo"]),
    cartInfoList() {
      return this.cartInfo.cartInfoList || [];
    },
    totalPrice() {
      return this.cartInfoList.reduce(
        (sum, cart) => sum + cart.skuPrice * cart.skuNum,
        0
      );
    },
    isAllChecked() {
      // every() 方法测试一个数组内的所有元素是否都能通过指定函数的测试。它返回一个布尔值。
      return this.cartInfoList.every((cart) => cart.isChecked === 1);
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 每一次操作购物车都要重新请求数据
    getData() {
      // 请求对象账户的购物车信息
      this.$store.dispatch("getCartList");
    },
    // 点击提交事件：节流
    //修改商品数据->加的操作
    addSkuNum: throttle(async function (cart) {
      //整理参数
      const params = { skuId: cart.skuId, skuNum: 1 };
      //发请求:通知服务器修改当前商品的个数
      //再次获取购物车的最新的数据：保证这次修改数据完毕【成功以后在获取购物车数据】
      try {
        //修改商品个数成功
        await this.$store.dispatch("addOrUpdateCart", params);
        //再次获取最新的购物车的数据
        this.getData();
      } catch (error) {
        alert("修改数量失败");
      }
    }, 2000),
    //修改商品数据-减的操作
    minsSkuNum: throttle(async function (cart) {
      //整理参数:至少加入购物车的数量最低1个
      const params = { skuId: cart.skuId, skuNum: cart.skuNum > 1 ? -1 : 0 };
      //修改商品的数据
      try {
        //修改商品的个数、成功以后再次获取购物车的数据
        await this.$store.dispatch("addOrUpdateCart", params);
        this.getData();
      } catch (error) {
        alert("修改数量失败");
      }
    }, 2000),
    // 输入框的输入：防抖
    changeSkuNum: debounce(async function (disNum, cart) {
      // 发送给服务器的参数：修改的商品ID和商品数量的变化值
      disNum = isNaN(disNum) || disNum < 1 ? 0 : parseInt(disNum) - cart.skuNum;
      try {
        // 请求发送后，还要重新获取数据更新页面
        await this.$store.dispatch("addOrUpdateShopCart", {
          skuId: cart.skuId,
          skuNum: disNum,
        });
        // 更新仓库里的数据
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    }, 500),
    // 删除某个商品
    async deleteCartById(cart) {
      try {
        await this.$store.dispatch("deleteCartById", cart.skuId);
        // 更新仓库里的数据
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    // 切换商品的状态
    async updateSkuCheckedById(cart, event) {
      const params = {
        skuId: cart.skuId,
        isChecked: event.target.checked ? "1" : "0",
      };
      try {
        await this.$store.dispatch("updateSkuCheckedById", params);
        // 更新仓库里的数据
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    // 删除全部选中的商品即遍历购物车删除商品
    async deleteAllCheckedCart() {
      // this.cartInfoList.forEach((cart) => this.deleteCartById(cart));
      // 遍历购物车删除商品，即要调用n次发送请求
      try {
        await this.$store.dispatch("deleteAllCheckedCart");
        // 更新仓库里的数据
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    // 修改全选的状态
    async updateAllChecked(event) {
      const isChecked = event.target.checked ? "1" : "0";
      // 遍历购物车取消商品的勾选状态，即要调用n次发送请求
      try {
        await this.$store.dispatch("updateAllChecked", isChecked);
        // 更新仓库里的数据
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
