import Vue from 'vue'
import VueRouter from 'vue-router'
import { LayoutMain } from '@/layouts'
import exception from './module/exception'
import progress from '@/components/progressBar'
import { getToken } from '@/utils/token'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

/**
 * hidden 菜单栏不展示, Boolean 类型
 * keepAlive 缓存该路由, Boolean 类型, 默认值 false
 * links 外链接, 如: https://www.xxx.cn
 */
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'LayoutMain',
      component: LayoutMain,
      redirect: '/dashboard',
      type: 'all',
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          meta: {
            title: 'Dashboard',
            icon: 'pie-chart',
            keepAlive: true
          },
          type: 'all',
          component: () => import('@/views/admin/Dashboard')
        },
        {
          path: '/list-bts',
          name: 'listBts',
          meta: {
            title: 'Danh sách trạm',
            icon: 'cluster',
            keepAlive: true
          },
          type: 'all',
          component: () => import('@/views/admin/ListBts')
        },
        {
          path: '/bts/:id',
          name: 'bts',
          meta: {
            title: 'Chi tiết BTS',
            icon: '',
            hidden: true
          },
          type: 'all',
          component: () => import('@/views/admin/Bts')
        },
        {
          path: '/list-user',
          name: 'listUsers',
          meta: {
            title: 'Danh sách nhân viên',
            icon: 'usergroup-add',
            keepAlive: true
          },
          type: 'all',
          component: () => import('@/views/admin/ListUser')
        },
        {
          path: '/history',
          name: 'history',
          meta: {
            title: 'Lịch sử',
            icon: 'area-chart',
            keepAlive: true
          },
          type: 'all',
          component: () => import('@/views/admin/History')
        },
        {
          path: '/history/:id',
          name: 'history',
          meta: {
            title: 'Lịch sử BTS',
            icon: '',
            hidden: true
          },
          type: 'all',
          component: () => import('@/views/admin/HistoryBts')
        },
        {
          path: '/report',
          name: 'report',
          meta: {
            title: 'Báo cáo',
            icon: 'fund',
            keepAlive: true
          },
          type: 'all',
          component: () => import('@/views/admin/Report')
        },
        {
          path: '/device-profile',
          name: 'deviceprofile',
          meta: {
            title: 'Quản lý profile thiết bị',
            icon: 'codepen',
            keepAlive: true
          },
          type: 'all',
          component: () => import('@/views/admin/DeviceProfile')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录',
        icon: 'login',
        hidden: true
      },
      component: () => import('@/views/login/Login')
    },
    ...exception
  ]
})

const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
  progress.start()
  const token = getToken()
  if (!token) {
    if (to.name !== LOGIN_PAGE_NAME) {
      next({
        name: LOGIN_PAGE_NAME
      })
    } else {
      next()
    }
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    next({
      name: 'dashboard'
    })
  } else {
    next()
  }
})

router.afterEach(to => {
  progress.finish()
})

export default router
