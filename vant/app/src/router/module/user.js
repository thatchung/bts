const userRouter = {
  path: '/user',
  name: 'user',
  meta: {
    icon: 'user',
    title: 'Cộng tác viên'
  },
  component: () => import('@/views/home/Home')
}

export default userRouter
