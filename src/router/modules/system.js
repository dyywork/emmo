import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/userList',
  name: 'System',
  meta: {
    title: '系统管理',
    icon: 'table'
  },
  children: [
    {
      path: 'userList',
      component: () => import('@/views/system/user/UserList'),
      name: 'UserList',
      meta: { title: '用户列表' }
    }
  ]
}

export default systemRouter
