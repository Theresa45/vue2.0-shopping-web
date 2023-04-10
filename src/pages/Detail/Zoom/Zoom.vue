<template>
  <div class="spec-preview">
    <!--当前查看商品图区域-->
    <img :src="skuImage.imgUrl" />
    <!-- 事件绑定区域与当前查看商品图区域一致 -->
    <div class="event" @mousemove="move($event)"></div>
    <!--放大镜区域 —— 查看商品图放大后的效果-->
    <div class="big">
      <img :src="skuImage.imgUrl" ref="big" />
    </div>
    <!--放大镜遮罩层-->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: "Zoom",
  props: ["skuInfo"],
  data() {
    return {
      currentIndex: 0,
    };
  },
  computed: {
    skuImageList() {
      return this.skuInfo.skuImageList || [];
    },
    skuImage() {
      return this.skuImageList[this.currentIndex] || {};
    },
  },
  methods: {
    getIndex(index) {
      this.currentIndex = index;
    },
    move(event) {
      // 使遮罩层与鼠标一起移动
      // 获取DOM元素
      const mask = this.$refs.mask;
      const big = this.$refs.big;
      let left = event.offsetX - mask.offsetWidth / 2;
      let top = event.offsetY - mask.offsetHeight / 2;
      // 限制遮罩层的移动范围
      if (left <= 0) left = 0;
      if (left >= mask.offsetWidth) left = mask.offsetWidth;
      if (top <= 0) top = 0;
      if (top >= mask.offsetHeight) top = mask.offsetHeight;
      // 修改遮罩层的left和top
      mask.style.left = left + "px";
      mask.style.top = top + "px";
      // 放大图片
      big.style.left = -2 * left + "px";
      big.style.top = -2 * top + "px";
    },
  },
  mounted() {
    this.$bus.$on("getIndex", this.getIndex);
  },
  beforeDestroy() {
    this.$bus.$off("getIndex", this.getIndex);
  },
};
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>
