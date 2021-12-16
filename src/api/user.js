import request from '@/utils/request'

// 用户列表
export function getList(params) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}
// 新增用户
export function createUser(data) {
  return request({
    url: '/api/user/create',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/api/user/delete/${id}`,
    method: 'delete'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
