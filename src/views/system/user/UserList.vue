<template>
  <div class="app-container">
    <el-card>
      <standard-table
        :columns="columns"
        :api="getList"
      >
        <el-table-column label="操作">
          <template #default="{row}">
            <el-link type="danger" :underline="false" @click="handleDelete(row)">删除</el-link>
          </template>
        </el-table-column>
      </standard-table>
    </el-card>
  </div>
</template>

<script>
import StandardTable from '@/components/StandardTable/StandardTable'
import { getList } from '@/api/user'
export default {
  name: 'UserList1',
  components: { StandardTable },
  data() {
    return {
      columns: [
        { label: '序号', type: 'index', minWidth: 50 },
        { label: '用户名', prop: 'userName' },
        { label: '邮箱', prop: 'email' },
        { label: '地址', prop: 'address' },
        { label: '状态', prop: 'status' },
        { label: '创建时间', prop: 'createdAt' }
      ]
    }
  },
  methods: {
    getList,
    handleDelete(row) {

    }
  }
}
</script>

<style scoped lang="scss">

</style>
