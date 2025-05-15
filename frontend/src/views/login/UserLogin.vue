<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 右上角管理系统链接 -->
      <div class="admin-link">
        <el-link @click="goToAdminSystem">管理系统</el-link>
      </div>

      <!-- 左侧走马灯 -->
      <div class="carousel-area">
        <ImageCarousel :items="carouselItems" :height="300" :width="300" />
      </div>

      <!-- 右侧登录表单 -->
      <div class="form-area">
        <h2 class="login-title">欢迎来到智联校园<br>━(*｀∀´*)ノ亻!</h2>

        <el-form :model="{ phone, password }" class="login-form">
          <el-form-item label="手机号" required>
            <el-input
                v-model="phone"
                placeholder="请输入手机号"
                clearable
                prefix-icon="el-icon-user"
            />
          </el-form-item>

          <el-form-item label="密码" required>
            <el-input
                v-model="password"
                placeholder="请输入密码"
                type="password"
                show-password
                clearable
                prefix-icon="el-icon-lock"
            />
          </el-form-item>

          <el-form-item>
            <div class="button-container">
              <el-button type="primary" block @click="handleLogin" :loading="loading">登录</el-button>
              <el-button type="text" @click="goToRegister">注册</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ImageCarousel from '@/components/ImageCarousel.vue';
import { userApi } from '@/api';

const phone = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();
const store = useStore();

const carouselItems = ref([
  { id: 1, imageUrl: 'https://th.bing.com/th/id/R.4749c7cd4b6c4d572898d66924b2c136?rik=xusw0kwpp0Lykw&riu=http%3a%2f%2fusst.yanzhaowang.com%2fupload%2fimages%2fschool%2f10252%2f5b3b152df740e377951349c636ca4a7a.jpg&ehk=XhCuJHKb%2bJ7ZlYhwnEhVnCHcDrlOFbUCrjwf9SHZpWc%3d&risl=&pid=ImgRaw&r=0', altText: 'Image 1' },
  { id: 2, imageUrl: '', altText: 'Image 2' },
  { id: 3, imageUrl: '', altText: 'Image 3' },
  { id: 4, imageUrl: '', altText: 'Image 4' },
]);

// 检查登录状态，如果已登录则跳转到首页
onMounted(() => {
  // 检查localStorage而不是store，因为store可能还没同步
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userDataExists = localStorage.getItem('currentUser') !== null;
  
  if (isAuthenticated && userDataExists) {
    console.log('已登录，跳转到消息板');
    router.push('/message-board');
  } else {
    // 确保我们清除了可能错误设置的认证标记
    if (isAuthenticated && !userDataExists) {
      console.log('认证标记异常，重置状态');
      localStorage.removeItem('isAuthenticated');
    }
  }
});

const goToPage = (path) => {
  router.push(path).catch(err => {
    console.error("跳转失败:", err);
  });
};

const goToRegister = () => {
  goToPage('/user-register');
};

const goToAdminSystem = () => {
  goToPage('/admin-login');
};

const handleLogin = async () => {
  // 表单验证
  if (!phone.value) {
    ElMessage.error('请输入手机号');
    return;
  }
  if (!password.value) {
    ElMessage.error('请输入密码');
    return;
  }

  try {
    loading.value = true;
    const response = await userApi.login({
      phone: phone.value,
      password: password.value
    });

    const { code, msg, data } = response.data;
    
    if (code === 1) {
      ElMessage.success('登录成功');
      // 使用Vuex存储用户信息
      store.dispatch('login', data);
      // 跳转到首页或其他页面
      router.push('/message-board');
    } else {
      ElMessage.error(msg || '登录失败，请检查账号密码');
    }
  } catch (error) {
    console.error('登录失败:', error);
    ElMessage.error('登录请求失败，请检查网络连接');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff8dc; /* 米黄色背景 */
  background-image: url("https://www.transparenttextures.com/patterns/food.png");
  background-repeat: repeat;
  background-size: auto;
  position: relative;
}


/* 登录框布局 */
.login-box {
  display: flex;
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  max-width: 750px;
  width: 100%;
  box-shadow: 0 6px 20px rgba(100, 0, 0, 0.2);
  border: 1px solid #8b0000; /* 深红色描边 */
}

/* 走马灯样式 */
.carousel-area {
  width: 300px;
  margin-right: 20px;
}


/* 表单区域样式 */
.form-area {
  flex: 1;
  text-align: center;
}

.login-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #8b0000; /* 深红色 */
}

/* 按钮容器 */
.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

/* 登录按钮：深红色背景 + 金色文字 */
.el-button--primary {
  background-color: #8b0000;
  border-color: #8b0000;
  color: #f5deb3;
}

.el-button--primary:hover {
  background-color: #a10000;
  color: #fff8dc;
}

/* 注册按钮：金色文字 */
.el-button--text {
  color: #b8860b;
}

/* 管理系统链接（右上角固定不变） */
.admin-link {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 16px;
  color: #8b0000;
  cursor: pointer;
  font-weight: bold;
}

.admin-link:hover {
  text-decoration: underline;
}
</style>
