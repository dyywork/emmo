<template>
  <div class="app-container">
    <el-card>
      <el-row style="margin-bottom: 10px">
        <el-button type="primary" size="mini" @click="$refs.create.show()">新增</el-button>
      </el-row>
      <standard-table
        ref="table"
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
    <create-user ref="create" @getList="getSearchList" />
  </div>
</template>

<script>
import StandardTable from '@/components/StandardTable/StandardTable'
import createUser from '@/views/system/user/components/createUser'
import { getList } from '@/api/user'
export default {
  name: 'UserList1',
  components: { StandardTable, createUser },
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

    },
    getSearchList() {
      this.$refs.table.getList()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
