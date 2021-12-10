<script>
  import TableTemplate from './components/template.vue'
  import KeyupEnter from './mixins/keyup-enter'
  import ConfigColumn from './mixins/column-config'
  export default {
    extends: TableTemplate,
    mixins: [KeyupEnter, ConfigColumn],
    props: {
      columns: {
        type: Array,
        default: () => [],
      },
      // 是否启用表头搜索
      searchable: {
        type: Boolean,
        default: false,
      },
      // 分页数据
      pageData: {
        type: Array,
        default: () => [],
      },
      // 最大高度
      maxHeight: {
        type: [String, Number],
        default: '500px',
      },
      // 默认分页配置
      page: {
        type: Number,
        default: 1,
      },
      size: {
        type: Number,
        default: 20,
      },
      // 合计配置项 (如何实现了 summary-method 方法，则以它为准)
      summaryOption: Array,
    },
    components: {
      mgMiniPagination: () => import('./components/mg-mini-pagination.vue'),
    },
    data() {
      return {
        loading: false,
        showSearchBar: false,
        pagination: {
          page: this.page,
          size: this.size,
        },
        total: 0,
        list: [],
      }
    },
    watch: {
      pageData: {
        immediate: true,
        handler(value) {
          this.inititalPageData(value)
        },
      },
    },
    computed: {
      totalPage() {
        return Math.ceil(this.total / this.pagination.size)
      },
      getData() {
        return this.list[this.pagination.page - 1]
      },
      filterColumns() {
        return this.columns.filter((column) => column.headerSlot)
      },
    },
    mounted() {
      this.resetHeaderHeight()
    },
    methods: {
      /**
       * 初始化分页数据
       */
      inititalPageData(data) {
        this.total = data.length
        this.list = this.$baseLodash.chunk(data, this.pagination.size)
      },
      /**
       * 合计
       */
      handleSummary() {
        const columns = this.getColumns()
        if (this.$attrs['summary-method'] && typeof this.$attrs['summary-method'] === 'function') {
          return this.$attrs['summary-method'](columns, this.pageData)
        }
        const sums = []
        if (this.summaryOption) {
          const data = this.pageData
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '合计'
              return
            }
            const summaryItem = this.summaryOption.find((item) => item.label === column.label)
            if (summaryItem) {
              const values = data.map((item) => item[column.property])
              let total = values.reduce((sum, value) => {
                if (!isNaN(value)) return this.np.plus(sum, value)
                return sum
              }, 0)

              if (typeof summaryItem.format === 'function') {
                total = summaryItem.format(total)
              }
              sums[index] = this.$format.amount(total)
            } else {
              sums[index] = ''
            }
          })
        }
        return sums
      },
      /**
       * 当表格高度为 28px 时，解决 fixed 列 多出 1px 的问题，导致行不对其
       */
      resetHeaderHeight() {
        setTimeout(() => {
          Array.from(document.querySelectorAll('.el-table__fixed-body-wrapper')).forEach((el) => {
            el.style.top = '29px'
          })
        }, 0)
      },
      /**
       * 显示/隐藏搜索
       */
      handleShowSearch() {
        this.showSearchBar = !this.showSearchBar
        // 触发搜索按钮点击状态变更事件
        this.$emit('searchable-change', this.showSearchBar)
      },
      /**
       * 小分页器
       */
      handlePageChange(page) {
        this.pagination.page = page
      },
      /**
       * 获取el-table实例
       */
      getElTable() {
        return this.$refs.mgPaginationTable
      },
      /**
       * 全部得列
       */
      getColumns() {
        return this.getElTable()?.columns || []
      },
      /**
       * 过滤
       */
      filterChange(column, value) {
        const filterData = this.pageData.filter((item) => {
          return item[column.property].includes(value)
        })
        this.pagination.page = 1
        this.inititalPageData(filterData)
      },
      /**
       * 清除过滤
       */
      clearFilter() {
        this.inititalPageData(this.pageData)
      },
    },
  }
</script>
