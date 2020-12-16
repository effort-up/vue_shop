import Vue from 'vue'
import VueRouter from 'vue-router'


const Login = () => import('../views/login/Login.vue')
const Home = () => import('../views/home/Home.vue')
const Welcome = () => import('../views/home/childcomps/Welcome.vue')
const Users = () => import('../views/user/Users.vue')
const Rights = () => import('../views/power/rights/Rights.vue')
const Roles = () => import('../views/power/roles/Roles.vue')
const Categories = () => import('../views/goods/categories/Categories.vue')
const Params = () => import('../views/goods/params/Params.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      },
    ]
  },
]



const router = new VueRouter({
  routes
})
//导航守卫(任何人都可以访问登录页面，但其他页面需要 token 值才能访问)
router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next()   //如果请求路径是登录页面，则返回 next
  const tokenStr = window.sessionStorage.getItem('token') 
  if(!tokenStr) return next('/login')  // 如果请求路径是其他路径，则需要判断 token(令牌) 是否存在，存在才可以访问其他页面
  next()
})

export default router
