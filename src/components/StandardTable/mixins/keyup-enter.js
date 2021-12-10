export default {
  props: {
    keyboard: Boolean,
  },
  mounted() {
    if (this.keyboard) {
      this.$refs.mgPaginationTable.$el.addEventListener('keyup', this.handleKeyUp, false)
    }
  },
  beforeDestroy() {
    if (this.keyboard) {
      this.$refs.mgPaginationTable.$el.removeEventListener('keyup', this.handleKeyUp, false)
    }
  },
  methods: {
    /**
     * 响应键盘事件
     */
    handleKeyUp(e) {
      e.preventDefault()
      e.stopPropagation()
      const activeRow = this.getCurrentActiveRow()
      this.getCurrentActiveCell(activeRow)
      switch (e.keyCode) {
        // enter
        case 13:
          this.setFocusCell(activeRow.nextSibling)
          break
        // keyLeft
        case 37:
          if (e.shiftKey) {
            this.$refs.mgMiniPagination.handlePageChange(-1)
            this.getCurrentHightLightRow()
          }
          break
        // keyRight
        case 39:
          if (e.shiftKey) {
            this.$refs.mgMiniPagination.handlePageChange(1)
            this.getCurrentHightLightRow()
          }
          break
        default:
      }
    },
    /**
     * 获取当前高亮行
     */
    getCurrentHightLightRow() {
      this.$nextTick(() => {
        this.getElTable().setCurrentRow(this.getData[0])
        setTimeout(() => {
          const currentRow = this.$el.querySelector('.el-table__body-wrapper .el-table__row.current-row')
          this.setFocusCell(currentRow)
        }, 0)
      })
    },
    /**
     * 获取当前活动的行
     */
    getCurrentActiveRow() {
      // 获取当前活动行
      let activeRow = document.activeElement
      while (activeRow && activeRow.tagName !== 'TR') {
        activeRow = activeRow.parentElement
      }
      this.activeRowIndex = activeRow.rowIndex
      return activeRow
    },
    /**
     * 获取当前活动的单元格
     */
    getCurrentActiveCell(activeRow) {
      return Array.from(activeRow.cells).find((el, index) => {
        this.activeColIndex = index
        return el.querySelector('input[type="text"]') === document.activeElement
      })
    },
    /**
     * 设置单元格焦点
     */
    setFocusCell(activeRow) {
      if (!activeRow || !(activeRow instanceof HTMLElement)) return
      this.activeRowIndex = activeRow.rowIndex
      activeRow.click()
      let cell = activeRow.cells[this.activeColIndex]
      // TODO: 查找表单元素的方法可再优化，目前比较局限
      cell = cell.querySelector('.el-input, .el-select')
      if (cell) {
        cell.__vue__.focus()
        cell.__vue__.$el.click()
      }
    },
  },
}
