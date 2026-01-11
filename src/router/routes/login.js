export default [
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth'
    }
  },
]
