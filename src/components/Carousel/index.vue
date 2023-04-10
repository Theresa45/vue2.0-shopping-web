<template>
  <!--carousel轮播-->
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="carousel in carouselList"
        :key="carousel.id"
      >
        <img :src="carousel.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  name: "Carousel",
  props: ["carouselList"],
  watch: {
    // 监听carouselList，一旦有了数据，立即初始化Swiper
    carouselList: {
      handler() {
        // 必须保证初始化Swiper实例之前，轮播图的HTML结构已渲染
        this.$nextTick(() => {
          //初始化Swiper的实例对象
          var mySwiper = new Swiper(".swiper-container", {
            //设置轮播图防线
            direction: "horizontal",
            //开启循环模式
            loop: true,
            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
              //分页器类型
              type: "bullets",
              //点击分页器，切换轮播
              clickable: true,
            },
            //自动轮播
            autoplay: {
              delay: 3000,
              //如果设置为true，当切换到最后一个slide时停止自动切换
              stopOnLastSlide: true,
              //用户操作swiper之后，是否禁止autoplay
              disableOnInteraction: false,
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      },
      deep: true,
      // 组件挂载后立即执行
      immediate: true,
    },
  },
};
</script>

<style>
:root {
  --swiper-theme-color: rgba(255, 255, 255, 0.8);
  --swiper-navigation-size: 20px;
}
</style>
