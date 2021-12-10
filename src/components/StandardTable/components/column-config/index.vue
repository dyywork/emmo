<template>
  <el-dialog :visible="isOpen" title="表格字段设置" width="844px" :close-on-click-modal="false" @close="handleClose">
    <div class="columns-config">
      <div class="show-columns">
        <div class="header">
          <span>可拖动表格字段进行排序</span>
          <span class="reset-btn" @click="handleReset">
            重置
            <i class="iconfont mg-icon_shuaxinshuju" />
          </span>
        </div>
        <draggable v-model="showColumns" group="columns" class="drag-group" v-bind="dragOptions">
          <span class="drag-group-item" v-for="col in showColumns" v-bind:key="col.prop || col.type">
            {{ col.label }}
          </span>
        </draggable>
      </div>
    </div>
    <span slot="footer">
      <div class="column-count">列字段总数:{{ showColumns.length }}</div>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :disabled="columns.length === 0">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    display: 'Transitions',
    props: {
      visible: Boolean,
      columns: {
        type: Array,
        default: () => [],
      },
    },
    components: { draggable },
    data() {
      return {
        showColumns: [],
      }
    },
    watch: {
      columns: {
        immediate: true,
        handler(list) {
          this.showColumns = [...list]
        },
      },
    },
    computed: {
      dragOptions() {
        return {
          ghostClass: 'ghost',
        }
      },
      isOpen() {
        return this.visible
      },
    },
    methods: {
      handleReset() {
        this.showColumns = [].concat(this.columns)
      },
      handleClose() {
        this.$emit('update:visible', false)
      },
      handleSubmit() {
        const noChange = this.showColumns.every((item, index) => this.columns[index].label === item.label)
        if (!noChange) {
          this.$emit('column-change', this.showColumns)
        }
        this.handleClose()
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-dialog__body {
      padding: 10px 20px;
    }
  }
  .columns-config {
    display: flex;
    .show-columns {
      flex: 1;
      margin-right: 5px;
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        line-height: 18px;
        margin-bottom: 10px;
        .reset-btn {
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #999;
          i {
            font-size: 14px;
            margin-left: 2px;
          }
        }
      }
      .drag-group {
        height: 320px;
        overflow: auto;
        background: #fff;
        border: 1px solid rgba(37, 42, 61, 0.1);
        padding: 10px 0 10px 10px;
        box-sizing: border-box;
        .drag-group-item {
          padding: 5px 10px;
          cursor: move;
          margin-right: 10px;
          margin-bottom: 10px;
          display: inline-block;
          background: rgba(37, 42, 61, 0.05);
        }
      }
    }
  }
  .column-count {
    font-size: 12px;
    color: rgba(37, 42, 61, 0.8);
    line-height: 32px;
    float: left;
  }
</style>
<style>
  .ghost {
    background: rgba(230, 0, 18, 0.15) !important;
  }
</style>
