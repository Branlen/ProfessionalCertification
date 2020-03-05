import Vue from 'vue'
import Router from 'vue-router'

import login from '@/pages/login/login'
import register from '@/pages/login/register'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


/**
 * 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * hidden: true // (默认 false)
 * 
 * 当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * redirect: 'noredirect'
 * 
 * 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 * 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 * 若你想不管路由下面的 children 声明的个数都显示你的根路由
 * 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * alwaysShow: true
 * name: 'router-name' //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta: {
 * roles: ['admin', 'editor'] //设置该路由进入的权限，支持多个权限叠加
 * title: 'title' //设置该路由在侧边栏和面包屑中展示的名字
 * icon: 'svg-name' //设置该路由的图标
 * noCache: true //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 * breadcrumb: false // 如果设置为false，则不会在breadcrumb面包屑中显示
 * }
 */


/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [{
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import('@/pages/login/forget')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/certification',
    children: [{
      path: 'certification',
      name: 'Certification',
      component: () => import('@/pages/home/index'),
      meta: {
        title: '首页',
        icon: 'home'
      }
    }]
  },
  {
    path: '/studentManger',
    component: Layout,
    redirect: '/studentManger/index',
    children: [{
      path: "index",
      component: () => import('@/pages/student/index'),
      name: 'studentManger',
      meta: {
        title: '学生管理',
        icon: 'link'
      }
    }]
  },
  {
    path: '/courseManger',
    component: Layout,
    redirect: '/courseManger/index',
    children: [{
      path: "index",
      component: () => import('@/pages/course/index'),
      name: 'courseManger',
      meta: {
        title: '课程管理',
        icon: 'tree'
      }
    }]
  },
  {
    path: '/TimeTableManager',
    component: Layout,
    redirect: '/TimeTableManager/index',
    children: [{
      path: "index",
      component: () => import('@/pages/courseTimeTable/index'),
      name: 'TimeTableManager',
      meta: {
        title: '课表管理',
        icon: 'dashboard '
      }
    }]
  },
  {
    path: '/courseOutline',
    component: Layout,
    // redirect: '/courseObject/index',
    meta: {
      title: '课程考核管理',
      icon: 'tree'
    },
    children: [{
      path: "/courseOutline/courseAssessment",
      component: () => import('@/pages/courseAssessment/index'),
      name: 'courseAssessment',
      meta: {
        title: '课程考核方式管理',
        icon: 'table'
      }
    }, ]
  },
  {
    path: '/graduateOutline',
    component: Layout,

    meta: {
      title: '毕业大纲管理',
      icon: 'link'
    },
    children: [{
      path: "/graduateOutline/graduateReq",
      component: () => import('@/pages/graduateReq/index'),
      name: 'graduateReq',
      meta: {
        title: '毕业要求管理',
        icon: 'share'
      }
    }]
  },
  {
    path: '/scoreManage',
    component: Layout,
    redirect: '/scoreManage/index',
    children: [{
      path: "index",
      component: () => import('@/pages/score/index'),
      name: 'scoreManage',
      meta: {
        title: '成绩管理',
        icon: '消息中心'
      }
    }, ]
  },
  {
    path: '/courseAchivementManage',
    component: Layout,
    redirect: '/courseAchivementManage/index',
    children: [{
      path: "index",
      component: () => import('@/pages/courseAchivement/index'),
      name: 'courseAchivementManage',
      meta: {
        title: '课程达成度管理',
        icon: 'example'
      }
    }, ]
  },
  {
    path: '/graduateAchivement',
    component: Layout,
    redirect: '/graduateAchivement/index',
    children: [{
      path: "index",
      component: () => import('@/pages/graduateAchivement/index'),
      name: 'graduateAchivement',
      meta: {
        title: '毕业要求达成度管理',
        icon: 'form'
      }
    }, ]
  },
  {
    path: '/userManger',
    component: Layout,
    redirect: '/userManger/index',
    children: [{
      path: "index",
      component: () => import('@/pages/user/index'),
      name: 'userManger',
      meta: {
        title: '用户管理',
        icon: 'user'
      }
    }, ]
  },
  {
    path: '/404',
    component: () => import('@/pages/404'),
    hidden: true
  }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
