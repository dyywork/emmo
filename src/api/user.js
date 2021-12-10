import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
