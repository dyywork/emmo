<template>
  <div class="mg-pagination-table">
    <div class="mg-table-topbar">
      <div class="topbar-left">
        <slot name="topleft" />
      </div>
      <div class="topbar-right">
        <slot name="topright" />
        <el-button v-if="configurable" icon="iconfont mg-icon_shezhi_wubiankuang" type="icon" @click="visible = true" />
        <template v-if="searchable">
          <el-button
            v-if="!showSearchBar"
            icon="iconfont mg-icon_sousuo_wubiankuang"
            type="icon"
            @click="handleShowSearch"
          />
          <el-button v-else plain icon="iconfont mg-icon_sousuo_wubiankuang" type="icon" @click="handleShowSearch" />
        </template>
      </div>
    </div>
    <el-table
      ref="mgTable"
      v-loading="loading"
      empty-text="暂无数据"
      border
      size="mini"
      :class="{ 'mg-customer-table--header': showSearchBar }"
      :data="initialData || list"
      :max-height="maxHeight"
      v-bind="$attrs"
      @header-dragend="handleHeaderDragEnd"
      v-on="$listeners"
    >
      <slot name="selection" />
      <template v-for="column in columns">
        <!-- 自定义的表格行 不能使用 v-bind="column"  -->
        <el-table-column
          v-if="column.slot"
          :key="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align"
          :prop="column.prop"
          :sortable="column.sortable"
          :sort-by="column.sortBy"
          :fixed="column.fixed"
          :show-overflow-tooltip="column.showOverflowTooltip"
        >
          <template #default="scoped">
            <slot :name="column.slot" v-bind="scoped" />
          </template>
          <!-- 自定义表头 -->
          <template v-if="column.headerSlot" #header="scoped">
            <div class="mg-customer-table-header-cell-label">{{ column.label }}</div>
            <div v-if="showSearchBar" class="mg-customer-table-header-cell-body">
              <slot :name="column.headerSlot" v-bind="scoped" />
            </div>
          </template>
        </el-table-column>

        <!-- 使用默认表格列渲染 -->
        <template v-else-if="column.default">
          <slot :name="column.prop" />
        </template>

        <!-- 常规数值显示的表格行 -->
        <el-table-column v-else :key="column.prop" show-overflow-tooltip v-bind="column">
          <template v-if="column.headerSlot" #header="scoped">
            <div class="mg-customer-table-header-cell-label">{{ column.label }}</div>
            <div v-if="showSearchBar" class="mg-customer-table-header-cell-body">
              <slot :name="column.headerSlot" v-bind="scoped" />
            </div>
          </template>
        </el-table-column>
      </template>
      <slot />
    </el-table>
    <el-pagination
      v-if="showPagination"
      background
      :current-page="page"
      layout="total, sizes, prev, pager, next, jumper"
      :page-size="pagination.size"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    // 是否启用搜索
    searchable: {
      type: Boolean,
      default: false
    },
    // 是否需要显示分页
    showPagination: {
      type: Boolean,
      default: true
    },
    // 是否需要mini显示分页
    showMiniPagination: {
      type: Boolean,
      default: true
    },
    initialData: Array,
    api: Function,
    apiParams: Object,
    autoLoad: Boolean,
    // 处理列表请求后的数据
    formatData: Function,
    maxHeight: {
      type: [String, Number],
      default: '500px'
    }
  },
  data() {
    return {
      pagination: {
        page: this.apiParams?.page || 1,
        size: this.apiParams?.size || 20
      },
      list: this.$attrs.data,
      loading: false,
      total: 0,
      showSearchBar: false
    }
  },
  computed: {
    page() {
      return this.pagination.page
    },
    totalPage() {
      return Math.ceil(this.total / this.pagination.size)
    },
    getRawInstance() {
      return this.$refs.mgTable
    }
  },
  watch: {
    'apiParams.page': function(page) {
      this.pagination.page = page
    },
    initialData: {
      immediate: true,
      handler(value, old) {
        // 只需要调用一次 doLayout
        if (old?.length === 0 && value?.length > 0) {
          this.$nextTick(() => {
            this.$refs.mgTable.doLayout()
          })
        }
      }
    }
  },
  created() {
    if (this.api && this.autoLoad) {
      this.loadData()
    }
  },
  mounted() {
    this.resetHeaderHeight()
  },
  methods: {
    resetHeaderHeight() {
      setTimeout(() => {
        // 当表格高度为 28px 时，解决 fixed 列 多出 1px 的问题，导致行不对其
        Array.from(document.querySelectorAll('.el-table__fixed-body-wrapper')).forEach((el) => {
          el.style.top = '29px'
        })
      }, 0)
    },
    handleShowSearch() {
      this.showSearchBar = !this.showSearchBar
      if (!this.showSearchBar) {
        this.resetHeaderHeight()
        this.$emit('resetHeaderForm')
      }
      this.$nextTick(() => {
        this.$refs.mgTable.doLayout()
      })
      this.$emit('searchable-change', this.showSearchBar)
    },
    handleCurrentChange(page) {
      this.pagination.page = page
      this.loadData()
    },
    handleSizeChange(size) {
      this.pagination.page = 1
      this.pagination.size = size
      this.loadData()
    },
    handlePageChange(page) {
      this.handleCurrentChange(page)
    },
    loadData() {
      this.loading = true
      this.api({
        ...this.apiParams,
        ...this.pagination
      })
        .then(async(res) => {
          if (typeof this.formatData === 'function') {
            await this.formatData(res.data?.items)
          }
          this.list = res.data?.items
          this.$emit('update:initialData', [...(this.list || [])])
          this.total = res.data?.total || 0
          if (this.pagination.page > 1 && this.list.length === 0) {
            this.pagination.page = 1
            this.loadData()
          }
        })
        .finally(() => {
          this.loading = false
          if (this.$attrs['show-summary']) {
            this.$nextTick(() => {
              this.$refs.mgTable.doLayout()
            })
          }
        })
    },
    handleSingleClick(e) {
      console.log(e)
    },
    setTableTotal(num) {
      this.total = num
    }
  }
}
</script>

<style lang="scss" scoped>
  .mg-pagination-table {
    .mg-table-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .topbar-left,
      .topbar-right {
        display: flex;
        align-items: center;
      }
    }

    .mg-table--header {
      .mg-customer-table-header-cell-label {
        border-bottom: 1px solid #ebeef5;
      }
    }

    .mg-customer-table-header-cell-label {
      height: 28px;
      line-height: 28px;
      box-sizing: border-box;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
    .mg-customer-table-header-cell-body {
      padding: 0 5px;
    }
  }
</style>
