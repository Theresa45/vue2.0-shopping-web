<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(img, index) in skuImageList"
        :key="img.id"
      >
        <img
          :src="img.imgUrl"
          :class="{ active: currentIndex === index }"
          @click="changeImage(index)"
        />
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  name: "ImageList",
  props: ["skuImageList"],
  data() {
    return {
      // 存储一个响应式数据——能随着用户的点击而变化
      currentIndex: 0,
    };
  },
  watch: {
    // 监听skuImageList，一旦有了数据，立即初始化Swiper
    skuImageList: {
      // 组件挂载后立即执行
      immediate: true,
      handler() {
        // 必须保证初始化Swiper实例之前，轮播图的HTML结构已渲染
        this.$nextTick(() => {
          //初始化Swiper的实例对象
          var mySwiper = new Swiper(".swiper-container", {
            //设置轮播图防线
            direction: "horizontal",
            //开启循环模式，如果想要在slider容器内就放现有的图片，需要停止循环模式
            loop: true,
            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            //设置slider容器能够同时显示的slides数量(carousel模式)。
            //根据slide的宽度自动调整展示数量。此时需要设置slide的宽度
            slidesPerView: 3,
            spaceBetween: "29%",
          });
        });
      },
    },
  },
  methods: {
    changeImage(index) {
      this.currentIndex = index;
      // 将索引值发送给放大镜组件
      this.$bus.$emit("getIndex", index);
    },
  },
};
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }

      &:hover {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }
  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>
