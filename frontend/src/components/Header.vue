<template>
  <header class="header">
    <div class="logo-container">
      <div class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60" width="150" height="50">
          <path d="M25,45 L10,30 L25,15 L40,30 L25,45 Z" fill="#8B0000" />
          <path d="M55,45 L40,30 L55,15 L70,30 L55,45 Z" fill="#B22222" />
          <circle cx="40" cy="30" r="8" fill="#DCDCDC" />
          <text x="80" y="35" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="white">智联校园</text>
          <text x="80" y="50" font-family="Georgia, serif" font-size="12" fill="#f0e68c">Campus-Connect</text>
        </svg>
      </div>
    </div>
    <nav class="navigation">
      <div class="nav-links">
        <router-link
            to="/message-board"
            class="nav-item"
            exact-active-class="active"
        >留言板</router-link>
        <router-link
            to="/transactions"
            class="nav-item"
            exact-active-class="active"
        >交易</router-link>
        <router-link
            to="/tasks"
            class="nav-item"
            exact-active-class="active"
        >任务</router-link>
        <router-link
            to="/ratings"
            class="nav-item"
            exact-active-class="active"
        >评分</router-link>
      </div>
      <div class="action-container">
        <div class="search-container">
          <input
              type="text"
              placeholder="搜索标题..."
              class="search-input"
              v-model="searchQuery"
              @keyup.enter="performSearch"
          />
          <button class="search-button" @click="performSearch">搜索</button>
        </div>
        <div class="auth-container">
          <!-- 根据登录状态显示不同的内容 -->
          <template v-if="isAuthenticated">
            <el-dropdown trigger="click">
              <div class="user-profile">
                <img
                    :src="user.image || '/api/placeholder/40/40'"
                    alt="用户头像"
                    class="user-avatar"
                />
                <span class="user-name">{{ user.nickname || '用户' }}</span>
                <i class="el-icon-arrow-down dropdown-arrow"></i>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToUserCenter">
                    <i class="el-icon-user"></i>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <i class="el-icon-switch-button"></i>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link to="/user-login" class="auth-button">
              <i class="el-icon-user"></i>
              登录/注册
            </router-link>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'isAuthenticated']),
    user() {
      return this.currentUser || {};
    }
  },
  methods: {
    performSearch() {
      if (this.searchQuery.trim()) {
        // 发射组件事件而不是全局事件
        this.$emit('search', this.searchQuery.trim());
        // 其余代码保持不变
        const currentPath = this.$route.path;
        if (currentPath === '/' || !this.isInSupportedPage()) {
          this.$router.push('/message-board');
        }
      }
    },

    // 检查当前是否在四个主要模块之一
    isInSupportedPage() {
      const path = this.$route.path;
      return path.includes('/message-board') ||
          path.includes('/transactions') ||
          path.includes('/tasks') ||
          path.includes('/ratings');
    },

    // 跳转到个人中心
    goToUserCenter() {
      this.$router.push('/user-info');
      console.log('前往个人中心');
    },

    // 跳转到设置页面
    goToSettings() {
      this.$router.push('/settings');
      console.log('前往设置');
    },

    // 处理登出
    handleLogout() {
      this.$store.dispatch('logout');
      this.$router.push('/user-login');
    }
  },
  // 监听来自根组件的路由变化，更新搜索提示
  mounted() {
    // 当路由变化时清空搜索框
    this.$watch(() => this.$route.path, () => {
      this.searchQuery = '';
    });
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 25px;
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%); /* 暗红色渐变 */
  border-radius: 15px;
  margin-bottom: 15px;
}

.logo-container {
  flex: 0 0 auto;
  margin-right: 15px;
}

.logo {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.navigation {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 15px;
  padding-left: 30px; /* 内部留白效果 */
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 10px 18px;
  border-radius: 25px;
  font-family: 'Georgia', serif;
  font-weight: bold;
  transition: all 0.3s ease;
}

.nav-item:hover, .nav-item.active {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

.action-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-container {
  display: flex;
  /* transform: translateX(-100px); 向左移动 30px */
}

.search-input {
  padding: 10px 18px;
  border: none;
  border-radius: 25px 0 0 25px;
  outline: none;
  font-size: 0.9rem;
  width: 200px;
}

.search-button {
  background-color: #8B0000; /* 深红色 */
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 0 25px 25px 0;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #B22222; /* 稍亮的红色 */
}

.auth-button {
  background-color: #8B0000;
  color: white;
  text-decoration: none;
  padding: 10px 18px;
  border-radius: 25px;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-button:hover {
  background-color: #B22222;
  transform: translateY(-3px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* 用户头像和信息样式 */
.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 15px;
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.user-profile:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.user-profile:hover .user-avatar {
  border-color: white;
  transform: scale(1.1);
}

.user-name {
  color: white;
  font-weight: bold;
  font-size: 0.95rem;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  color: white;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.user-profile:hover .dropdown-arrow {
  transform: translateY(-1px);
}

/* Element UI 下拉菜单样式覆盖 */
:deep(.el-dropdown-menu) {
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: none;
  padding: 8px 0;
}

:deep(.el-dropdown-menu__item) {
  padding: 12px 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f5f5f5;
  color: #8B0000;
}

:deep(.el-dropdown-menu__item i) {
  font-size: 16px;
}

@media (max-width: 900px) {
  .header {
    flex-direction: column;
    padding: 15px;
  }

  .logo-container {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .navigation {
    flex-direction: column;
    width: 100%;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    margin-bottom: 15px;
    padding-left: 0;
  }

  .action-container {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .search-container {
    margin-bottom: 10px;
  }

  .user-name {
    max-width: 80px;
  }
}

@media (max-width: 600px) {
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .search-input {
    width: 140px;
  }

  .user-profile {
    padding: 6px 12px;
  }

  .user-avatar {
    width: 28px;
    height: 28px;
  }

  .user-name {
    font-size: 0.9rem;
    max-width: 60px;
  }
}
</style>