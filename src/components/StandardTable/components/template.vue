<template>
  <div class="mg-pagination-table">
    <div class="mg-table-topbar">
      <div class="topbar-left">
        <slot name="topleft" />
      </div>
      <div class="topbar-right">
        <slot name="topright" />
        <el-button type="icon" @click="visible = true" v-if="configurable" icon="iconfont mg-icon_shezhi_wubiankuang" />
        <template v-if="searchable">
          <el-button
            v-if="!showSearchBar"
            @click="handleShowSearch"
            type="icon"
            icon="iconfont mg-icon_sousuo_wubiankuang"
          />
          <el-button v-else plain @click="handleShowSearch" type="icon" icon="iconfont mg-icon_sousuo_wubiankuang" />
        </template>
        <mg-mini-pagination
          ref="mgMiniPagination"
          :page="pagination.page"
          :total-page="totalPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>
    <el-table
      ref="mgPaginationTable"
      empty-text="暂无数据"
      border
      v-loading="loading"
      :class="{ 'mg-customer-table--header': showSearchBar }"
      :max-height="maxHeight"
      highlight-current-row
      :summary-method="handleSummary"
      :data="getData"
      @header-dragend="handleHeaderDragEnd"
      v-on="$listeners"
      v-bind="$attrs"
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
        <el-table-column v-else show-overflow-tooltip v-bind="column" :key="column.prop">
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
    <ColumnConfig :visible.sync="visible" :columns="columns" @column-change="handleColumnChange" />
  </div>
</template>

<script>
  export default {
    name: 'BaseTableTemplate',
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
