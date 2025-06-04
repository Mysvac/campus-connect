import { createRouter, createWebHistory } from 'vue-router'
import MessageBoard from "@/views/MessageBoard.vue";
import Ratings from "@/views/Ratings.vue";
import Transactions from "@/views/Transactions.vue";
import Tasks from "@/views/Tasks.vue";
import AdminLogin from "@/views/login/AdminLogin.vue";
import UserLogin from "@/views/login/UserLogin.vue";
import AdminRegister from "@/views/register/AdminRegister.vue";
import UserRegister from "@/views/register/UserRegister.vue";
import BackstageLayout from "@/layout/BackstageLayout.vue";
import MessageBoardManage from "@/views/Backstage/MessageBoardManage.vue";
import MessageBoardCommentManage from "@/views/Backstage/MessageBoardCommentManage.vue";
import TransactionsManage from "@/views/Backstage/TransactionsManage.vue";
import TransactionsOrderManage from "@/views/Backstage/TransactionsOrderManage.vue";
import TasksManage from "@/views/Backstage/TasksManage.vue";
import RatingsManage from "@/views/Backstage/RatingsManage.vue";
import RatingsCommentManage from "@/views/Backstage/RatingsCommentManage.vue";
import usersManage from "@/views/Backstage/UsersManage.vue";
import ManagerUserInfo from "@/views/Backstage/ManagerUserInfo.vue";
import UserInfo from "@/views/UserInfo.vue";

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

  {
    path: '/user-info',
    name: 'UserInfo',
    component: UserInfo,
  },

  // 带导航栏和侧边栏的页面
  {
    path: "/backstage",
    component: BackstageLayout, // 带导航栏和侧边栏的布局
    children: [
      {path: "message-board", name: "MessageBoardManage", component: MessageBoardManage },
      {path: "message-board-comment", name: "MessageBoardCommentManage", component: MessageBoardCommentManage },
      {path: "transactions", name: "TransactionsManage", component: TransactionsManage },      {path: "transactions-order", name: "TransactionsOrderManage", component: TransactionsOrderManage },
      {path: "tasks", name: "TasksManage", component: TasksManage },
      {path: "ratings", name: "RatingsManage", component: RatingsManage },
      {path: "ratings-comment", name: "RatingsCommentManage", component: RatingsCommentManage },
      {path: "users", name: "usersManage", component: usersManage },
      {path: "manager-user", name: "ManagerUserInfo", component: ManagerUserInfo}
    ],
  },
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 定义需要登录才能访问的路由
const requireAuthPages = [ '/ratings', '/tasks', '/transactions','/user-info'];

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
