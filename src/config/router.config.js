// eslint-disable-next-line
import {BlankLayout, CenterLayout, HomeLayout, MenuLayout} from '@/layouts'

export const asyncRouterMap = []

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: HomeLayout,
    redirect: '/login',
    hidden: true,
    children: [
      {
        path: '/menu',
        component: MenuLayout,
        redirect: '/menu/myfile',
        children: [
          {
            // 文件
            path: '/menu/myfile',
            name: 'myfile',
            component: () => import('@/views/center/myfile')
          },
          {
            // 哈希检索
            path: '/menu/hashsearch',
            name: 'hashsearch',
            component: () => import('@/views/center/hashsearch')
          },
          {
            // 奖励
            path: '/menu/myreward',
            name: 'myreward',
            component: () => import('@/views/center/myreward')
          },
          {
            // 个人中心
            path: '/menu/mycenter',
            name: 'mycenter',
            component: () => import('@/views/center/mycenter')
          }
        ]
      }, {
        // 关于我们
        path: '/about',
        name: 'about',
        component: () => import('@/views/about')
      },
      {
        path: '/center',
        component: CenterLayout,
        redirect: '/menu/myfile',
        children: [
          {
            path: '/center/filesearch',
            name: 'filesearch',
            component: () => import('@/views/center/filesearch')
          },
          {
            // 上传列表
            path: '/center/upload',
            name: 'uploadlist',
            component: () => import('@/views/center/upload')
          },
          {
            // 个人中心（账户信息）
            path: '/center/userinfo',
            name: 'userinfo',
            component: () => import('@/views/center/userinfo')
          },
          {
            path: '/center/myorder',
            name: 'myorder',
            component: () => import('@/views/center/myorder')
          },
          {
            path: '/center/myorder/detail',
            name: 'detail',
            component: () => import('@/views/center/myorder/detail')
          },
          {
            path: '/center/myspace',
            name: 'myspace',
            component: () => import('@/views/center/myspace')
          },
          {
            path: '/center/withdraw',
            name: 'withdraw',
            component: () => import('@/views/center/withdraw')
          },
          {
            // 语言设置
            path: '/center/lang',
            name: 'lang',
            component: () => import('@/views/center/lang')
          }
        ]
      }
    ]
  },
  {
    // 登录
    path: '/login',
    component: BlankLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/views/Login')
      }
    ]
  },
  {
    // 用户服务协议
    path: '/agreement',
    component: BlankLayout,
    children: [
      {
        path: '',
        name: 'agreement',
        component: () => import('@/views/Agreement')
      }
    ]
  },
  {
    // 隐私协议
    path: '/privacy',
    component: BlankLayout,
    children: [
      {
        path: '',
        name: 'privacy',
        component: () => import('@/views/Privacy')
      }
    ]
  },
  {
    // 购买云空间
    path: '/buy',
    component: BlankLayout,
    children: [
      {
        path: '',
        name: 'buy',
        component: () => import('@/views/Buy')
      }
    ]
  },
  {
    path: '/*',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
