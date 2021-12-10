<template>
  <div class="mg-pagination">
    <div class="page-button" :class="{ disabled: disabledPre }" @click="handlePageChange(-1)">
      <i class="iconfont mg-icon_shangyiye" />
    </div>
    <el-popover ref="popover" v-model="visible" :disabled="disabled" placement="bottom" width="120" trigger="hover">
      <div class="jump-page">
        <span>前往</span>
        <el-input v-model.number="jumpPage" size="small" style="width: 50px" @keyup.enter.native="handleConfirm" />
        <span>页</span>
      </div>
    </el-popover>
    <span v-popover:popover class="page-box">{{ page }}/{{ totalPage || 1 }}</span>
    <div class="page-button" :class="{ disabled: disabledNext }" @click="handlePageChange(1)">
      <i class="iconfont mg-icon_xiayiye" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    page: Number,
    totalPage: Number
  },
  data() {
    return {
      visible: false,
      jumpPage: this.page
    }
  },
  computed: {
    disabled() {
      return this.totalPage <= 0
    },
    disabledPre() {
      return this.page <= 1
    },
    disabledNext() {
      return this.page >= this.totalPage
    }
  },
  methods: {
    handlePageChange(page) {
      page = this.page + page
      if (page < 1 || page > this.totalPage) return
      this.$emit('page-change', page)
    },
    handleConfirm() {
      if (this.jumpPage > 0 && this.jumpPage <= this.totalPage) {
        this.visible = false
        if (this.jumpPage !== this.page) {
          this.handlePageChange(this.jumpPage - this.page)
        }
      }
    }
  }
}
</script>
<style>
  .jump-page {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
</style>
<style lang="scss" scoped>
  .mg-pagination {
    line-height: 26px;
    border: 1px solid rgba(37, 42, 61, 0.2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    margin-left: 10px;
    .page-button {
      padding: 0 4px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &.disabled {
        opacity: 0.3;
        pointer-events: none;
      }
    }

    .page-box {
      border-left: 1px solid rgba(37, 42, 61, 0.2);
      border-right: 1px solid rgba(37, 42, 61, 0.2);
      padding: 0 18px;
      color: #252a3d;
    }
  }
</style>
