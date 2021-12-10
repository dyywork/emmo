<template>
  <div>
    <el-table
      ref="mgTable"
      v-loading="loading"
      empty-text="暂无数据"
      border
      size="mini"
      :data="list"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <slot name="selection" />
      <template v-for="column in columns">
        <!-- 自定义的表格行 不能使用 v-bind="column"  -->
        <el-table-column
          v-if="column.slot"
          :key="column.prop"
          show-overflow-tooltip
          v-bind="column"
        >
          <template #default="scoped">
            <slot :name="column.slot" v-bind="scoped" />
          </template>
        </el-table-column>

        <!-- 使用默认表格列渲染 -->
        <template v-else-if="column.default">
          <slot :name="column.prop" />
        </template>

        <!-- 常规数值显示的表格行 -->
        <el-table-column v-else :key="column.prop" show-overflow-tooltip v-bind="column" />
      </template>
      <slot />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'StandardTable',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    api: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      list: [],
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { data } = await this.api()
      this.list = data
      console.log(data)
    }
  }
}
</script>

<style scoped>

</style>
