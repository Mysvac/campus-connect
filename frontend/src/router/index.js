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

export default router
