<template>
  <div>
    <!-- 全局组件在.vue文件中不需要导入：三级联动 -->
    <TypeNav></TypeNav>
    <!-- 轮播图 -->
    <ListContainer></ListContainer>
    <TodayRecommed></TodayRecommed>
    <Rank></Rank>
    <Like></Like>
    <!-- 只有在父组件发送请求，才能在父组件处遍历渲染子组件 -->
    <Floor v-for="floor in floorList" :key="floor.id" :floor="floor"></Floor>
    <Brand></Brand>
  </div>
</template>

<script>
import { mapState } from "vuex";

import ListContainer from "./ListContainer";
import TodayRecommed from "./TodayRecommed";
import Rank from "./Rank";
import Like from "./Like";
import Floor from "./Floor";
import Brand from "./Brand";

export default {
  name: "Home",
  components: {
    ListContainer,
    TodayRecommed,
    Rank,
    Like,
    Floor,
    Brand,
  },
  mounted() {
    // 通知Vuex存储Floor的数据
    this.$store.dispatch("FloorList");
  },
  computed: {
    ...mapState({
      floorList: (state) => state.floor.floorList,
    }),
  },
};
</script>
<style scoped></style>
