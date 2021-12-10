import { saveGlobalTableConfig, getGlobalTableConfig } from '@/api/config'
export default {
  props: {
    // 列是否可配置
    configurable: Boolean,
    // 业务类型
    businessType: String,
  },
  components: {
    ColumnConfig: () => import('../components/column-config/index.vue'),
  },
  data() {
    return {
      visible: false,
    }
  },
  created() {
    if (this.businessType) {
      getGlobalTableConfig(this.businessType).then((res) => {
        if (res.data?.columnData) {
          this.globalTableConfigId = res.data.globalTableConfigId
          this.$emit('update:columns', [])
          this.$nextTick(() => {
            this.$emit('update:columns', JSON.parse(res.data.columnData))
          })
        }
      })
    }
  },
  methods: {
    /**
     * 调整列宽
     */
    handleHeaderDragEnd(newWidth, oldWidth, column, event) {
      if (typeof this.$attrs['header-dragend'] === 'function') {
        this.$attrs['header-dragend'](newWidth, oldWidth, column, event)
      }
      const col = this.columns.find((item) => item.prop === column.property)
      col.minWidth = Math.ceil(newWidth)
      if (this.businessType) {
        saveGlobalTableConfig({
          businessType: this.businessType,
          columnData: JSON.stringify(this.columns),
          globalTableConfigId: this.globalTableConfigId,
        }).then((res) => {
          if (res.data) {
            this.globalTableConfigId = res.data
          }
        })
      }
    },
    /**
     * 响应列改变得事件
     */
    handleColumnChange(columns) {
      if (this.businessType) {
        saveGlobalTableConfig({
          businessType: this.businessType,
          columnData: JSON.stringify(columns),
          globalTableConfigId: this.globalTableConfigId,
        }).then((res) => {
          if (res.data) {
            this.globalTableConfigId = res.data
            this.$emit('update:columns', [])
            this.$nextTick(() => {
              this.$emit('update:columns', columns)
            })
          }
        })
      }
    },
  },
}
