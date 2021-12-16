<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createUser } from '@/api/user'
export default {
  name: 'CreateUser',
  data() {
    return {
      dialogVisible: false,
      form: {
        userName: '',
        email: '',
        address: ''
      },
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { msg } = await createUser(this.form)
          this.$emit('getList')
          this.$message.success(msg)
          this.dialogVisible = false
        }
      })
    },
    handleClose(done) {
      done()
    },
    show() {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
