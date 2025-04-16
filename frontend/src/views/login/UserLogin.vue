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

        <el-form :model="{ name, password }" class="login-form">
          <el-form-item label="账号" required>
            <el-input
                v-model="name"
                placeholder="请输入账号"
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
              <el-button type="primary" block @click="handleLogin">登录</el-button>
              <el-button type="text" @click="goToRegister">注册</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import ImageCarousel from '@/components/ImageCarousel.vue';

const name = ref('');
const password = ref('');

const carouselItems = ref([
  { id: 1, imageUrl: 'https://th.bing.com/th/id/R.4749c7cd4b6c4d572898d66924b2c136?rik=xusw0kwpp0Lykw&riu=http%3a%2f%2fusst.yanzhaowang.com%2fupload%2fimages%2fschool%2f10252%2f5b3b152df740e377951349c636ca4a7a.jpg&ehk=XhCuJHKb%2bJ7ZlYhwnEhVnCHcDrlOFbUCrjwf9SHZpWc%3d&risl=&pid=ImgRaw&r=0', altText: 'Image 1' },
  { id: 2, imageUrl: '', altText: 'Image 2' },
  { id: 3, imageUrl: '', altText: 'Image 3' },
  { id: 4, imageUrl: '', altText: 'Image 4' },
]);

const router = useRouter();

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
