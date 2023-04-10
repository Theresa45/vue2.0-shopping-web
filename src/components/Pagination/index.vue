<template>
  <!-- 分页器 -->
  <div class="sui-pagination clearfix">
    <ul>
      <li class="prev" :class="{ disabled: pageNo === 1 }" @click="prevPage">
        <a>«上一页</a>
      </li>
      <!-- 点击请求当前页码为1的数据，此时该按钮消失 -->
      <li v-if="startAndEnd.start > 1" @click="movePage('1')">
        <a>1</a>
      </li>
      <li class="dotted" v-if="startAndEnd.start > 2"><span>...</span></li>
      <template v-for="num in startAndEnd.end">
        <!-- 当当前页码数为1时 -->
        <li
          v-if="num >= startAndEnd.start"
          :key="num"
          :class="{ active: pageNo === num }"
          @click="movePage(num)"
        >
          <a>{{ num }}</a>
        </li>
      </template>

      <li class="dotted" v-if="startAndEnd.end < totalPages - 1">
        <span>...</span>
      </li>
      <li v-if="startAndEnd.end < totalPages" @click="movePage(totalPages)">
        <a>{{ totalPages }}</a>
      </li>
      <li
        class="next"
        :class="{ disabled: pageNo === totalPages }"
        @click="nextPage"
      >
        <a>下一页»</a>
      </li>
    </ul>
    <span>
      <em>共{{ totalPages }}页&nbsp;&nbsp;到第</em>
      <input type="text" v-model="page" />
      <em>页</em>
      <a @click="goPage">确定</a>
    </span>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  // 分页器所需要的数据都在Search组件上
  props: ["pageSize", "pageNo", "total", "pageCount"],
  data() {
    return {
      page: this.pageNo,
    };
  },
  computed: {
    // 总共页数
    totalPages() {
      //向上取整数
      return Math.ceil(this.total / this.pageSize);
    },
    // 连续页码的起始数字及结束数字
    startAndEnd() {
      const { totalPages, pageCount, pageNo } = this;

      let start = 0,
        end = 0;
      // 如果当前不是第一页或最后一页
      if (totalPages < pageCount) {
        start = 1;
        end = totalPages;
      } else {
        start = pageNo - Math.trunc(pageCount / 2);
        end = pageNo + Math.trunc(pageCount / 2);
        // 如果当前是第一页
        if (start < 1) {
          start = 1;
          end = pageCount;
        }
        // 如果当前是最后一页
        if (end > totalPages) {
          start = totalPages - pageCount + 1;
          end = totalPages;
        }
      }
      return { start, end };
    },
  },
  watch: {
    pageNo() {
      this.page = this.pageNo;
    },
  },
  methods: {
    // 页码跳转
    movePage(num) {
      this.$bus.$emit("getPageNo", +num);
    },
    // 页码跳转
    goPage() {
      const page = +this.page;
      if (page <= 1) {
        this.page = "1";
        this.$bus.$emit("getPageNo", 1);
      }
      if (page >= this.totalPages) {
        this.page = this.totalPages;
        this.$bus.$emit("getPageNo", this.totalPages);
      }
      if (page > 1 && page < this.totalPages)
        this.$bus.$emit("getPageNo", page);
    },
    prevPage() {
      if (this.page > 1) this.$bus.$emit("getPageNo", --this.page);
    },
    nextPage() {
      if (this.page < this.startAndEnd.end)
        this.$bus.$emit("getPageNo", ++this.page);
    },
  },
};
</script>

<style scoped lang="less">
.sui-pagination {
  margin: 18px 0;
  display: flex;
  align-content: center;
  justify-content: space-between;
  align-items: center;

  ul {
    li {
      margin-left: 5px;
      line-height: 18px;
      // display: inline-block;
      float: left;

      a {
        // position: relative;
        float: left;
        line-height: 18px;
        text-decoration: none;
        background-color: #f7f7f7;
        border: 1px solid #e0e9ee;
        font-size: 14px;
        padding: 6px 12px;
        color: #333;
      }

      &:hover {
        a {
          cursor: pointer;
        }
      }

      &.active {
        a {
          background-color: #fff;
          color: #e1251b;
          border-color: #fff;
          cursor: default;
        }
      }

      &.prev {
        a {
          background-color: #fafafa;
        }
      }

      &.disabled {
        a {
          color: #ccc;
          cursor: default;
        }
      }

      &.dotted {
        span {
          float: left;
          line-height: 18px;
          text-decoration: none;
          background-color: #fff;
          font-size: 14px;
          border: 0;
          padding: 6px 12px;
          color: #333;
        }
      }

      &.next {
        a {
          background-color: #f7f7f7;
        }
      }
    }
  }

  span {
    font-size: 14px;

    input {
      line-height: 18px;
      width: 30px;
      text-align: center;
    }

    a {
      line-height: 18px;
      text-decoration: none;
      background-color: #f7f7f7;
      border: 1px solid #e0e9ee;
      font-size: 14px;
      padding: 6px 12px;
      color: #333;
      margin-left: 5px;
    }

    &:hover {
      a {
        cursor: pointer;
      }
    }

    em {
      margin: 0px 5px;
    }
  }
}
</style>
