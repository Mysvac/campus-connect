import { createRouter, createWebHistory } from 'vue-router'
import MessageBoard from "@/views/MessageBoard.vue";
import Ratings from "@/views/Ratings.vue";
import Transactions from "@/views/Transactions.vue";
import Tasks from "@/views/Tasks.vue";
import AdminLogin from "@/views/login/AdminLogin.vue";
import UserLogin from "@/views/login/UserLogin.vue";
import AdminRegister from "@/views/register/AdminRegister.vue";
import UserRegister from "@/views/register/UserRegister.vue";

const routes = [

  // 默认重定向
  {
    path: "/",
    redirect: "/user-login", // 默认跳转到登录
  },

    //默认
    {
    path: '/user-login',
    name: 'UserLogin',
    component: UserLogin,
  },

  {
    path: '/transactions',
    name: 'transactions',
    component: Transactions,
  },

  {
    path: '/message-board',
    name: 'messageBoard',
    component: MessageBoard,
  },

  {
    path: '/ratings',
    name: 'Ratings',
    component: Ratings,
  },

  {
    path: '/tasks',
    name: 'Tasks',
    component: Tasks,
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: AdminLogin,
  },

  {
    path: '/admin-register',
    name: 'AdminRegister',
    component: AdminRegister,
  },

  {
    path: '/user-register',
    name: 'UserRegister',
    component: UserRegister,
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 定义需要登录才能访问的路由
const requireAuthPages = ['/message-board', '/ratings', '/tasks', '/transactions'];

// 全局路由守卫
router.beforeEach((to, from, next) => {
  console.log(`路由守卫: 从 ${from.path} 到 ${to.path}`);
  
  // 检查用户是否已登录
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userDataExists = localStorage.getItem('currentUser') !== null;
  const isLoggedIn = isAuthenticated && userDataExists;
  
  // 如果是需要认证的页面，但用户未登录，则跳转到登录页
  if (requireAuthPages.includes(to.path) && !isLoggedIn) {
    console.log('需要登录才能访问，跳转到登录页');
    next('/user-login');
  } 
  // 如果已登录并访问登录或注册页，则跳转到首页
  else if (isLoggedIn && (to.path === '/user-login' || to.path === '/user-register' || to.path === '/')) {
    console.log('已登录用户访问登录/注册页，跳转到首页');
    next('/message-board');
  } 
  else {
    next(); // 放行
  }
});

export default router
