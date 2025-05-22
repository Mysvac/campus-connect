<template>
  <div class="user-info-page">
    <!-- 头部组件 -->
    <Header @search="handleSearch" />

    <!-- 主体内容区域 -->
    <div class="main-content">
      <!-- 左侧筛选菜单 -->
      <div class="left-sidebar">
        <UserInfoLeft @filter-change="handleFilterChange" />
      </div>

      <!-- 右侧内容展示区域 -->
      <div class="content-area">
        <div class="content-container">
          <!-- 根据选中的筛选条件显示不同组件 -->
          <component :is="currentComponent" :key="activeFilter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import Header from "@/components/Header.vue";
import UserInfoLeft from "@/components/UserInfo/UserInfoLeft.vue";
import Info from "@/views/UserInfo/Info.vue";
import UserTransactions from "@/views/UserInfo/UserTransactions.vue";
import UserMessages from "@/views/UserInfo/UserMessages.vue";
import UserTasks from "@/views/UserInfo/UserTasks.vue";
import UserRatings from "@/views/UserInfo/UserRatings.vue";
import MyTransOrder from "@/views/UserInfo/MyTransOrder.vue";
import MyTasksStatus from "@/views/UserInfo/MyTasksStatus.vue";

export default {
  name: 'UserInfo',
  components: {
    Header,
    UserInfoLeft,
    Info,
    UserMessages,
    UserTransactions,
    MyTransOrder,
    UserTasks,
    MyTasksStatus,
    UserRatings
  },
  data() {
    return {
      activeFilter: 'profile', // 默认显示个人信息
      searchQuery: ''
    }
  },
  computed: {
    // 根据activeFilter动态切换组件
    currentComponent() {
      const componentMap = {
        'profile': 'Info',
        'messages': 'UserMessages',
        'transactions': 'UserTransactions',
        'mytransactions': 'MyTransOrder',
        'tasks': 'UserTasks',
        'mytasks':MyTasksStatus,
        'ratings': 'UserRatings'
      }
      return componentMap[this.activeFilter] || 'Info'
    }
  },
  methods: {
    // 处理左侧菜单筛选变化
    handleFilterChange(filterId) {
      this.activeFilter = filterId
      console.log('切换到:', filterId)
    },

    // 处理搜索事件
    handleSearch(query) {
      this.searchQuery = query
      console.log('搜索内容:', query)
      // 可以将搜索查询传递给当前活动的组件
      // 或者根据搜索内容切换到相应的管理页面
    }
  },
  mounted() {
    // 组件挂载时的初始化逻辑
    console.log('UserInfo页面已加载')
  }
}
</script>

<style scoped>
.user-info-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  padding: 15px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  overflow: hidden;
  background-image: url("https://www.transparenttextures.com/patterns/lined-paper-2.png");
}

.main-content {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
  margin-top: 0;
  flex-grow: 1;
  overflow: hidden;
}

.left-sidebar,
.content-area {
  height: 100%;
  min-height: 0;
  /* 这个属性很重要，确保flex子项不会溢出 */
}

.left-sidebar {
  background-color: #fff9f7;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(139, 0, 0, 0.1);
}

.content-area {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(139, 0, 0, 0.1);
  overflow: hidden;
}

.content-container {
  padding: 30px;
  height: 100%;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 180px 1fr;
  }
}

@media (max-width: 992px) {
  .main-content {
    grid-template-columns: 160px 1fr;
  }

  .content-container {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .left-sidebar {
    display: none;
  }

  .content-container {
    padding: 15px;
  }
}

/* 页面切换动画效果 */
.content-container > * {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>