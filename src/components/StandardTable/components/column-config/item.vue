<template>
  <div class="dragable-item">
    <el-tooltip content="至少显示一列" placement="top" :disabled="!disabled">
      <img :src="icon" @click="handleClick" />
    </el-tooltip>
    <span class="content"><slot /></span>
    <span class="more-icon" v-show="!hide"></span>
  </div>
</template>

<script>
  import addIcon from './assets/icon_add.png'
  import deleteIcon from './assets/icon_delete.png'
  import deleteDisabledIcon from './assets/icon_delete_disabled.png'
  export default {
    props: {
      hide: Boolean,
      disabled: Boolean,
    },
    data() {
      return {}
    },
    computed: {
      icon() {
        if (this.disabled) return deleteDisabledIcon
        if (this.hide) return addIcon
        return deleteIcon
      },
    },
    methods: {
      handleClick() {
        if (this.disabled) return
        this.$emit('icon-click')
      },
    },
  }
</script>

<style lang="scss">
  .dragable-item {
    display: flex;
    align-items: center;
    padding: 10px;
    background: rgba(37, 42, 61, 0.05);
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0px;
    }
    img {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .content {
      flex: 1;
      margin-left: 10px;
      color: #252a3d;
      font-size: 12px;
      font-weight: 600;
    }
    .more-icon {
      width: 10px;
      height: 1px;
      background: rgba(37, 42, 61, 0.4);
      position: relative;
      &::before {
        content: '';
        width: 10px;
        height: 1px;
        background: rgba(37, 42, 61, 0.4);
        position: absolute;
        top: -4px;
      }
      &::after {
        content: '';
        width: 10px;
        height: 1px;
        background: rgba(37, 42, 61, 0.4);
        position: absolute;
        top: 4px;
      }
    }
  }
</style>
