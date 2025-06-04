<template>
  <div class="app-container">
    <div class="register-container">
      <h2 class="title">用户注册</h2>
      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-item">
          <label for="name">昵称</label>
          <input type="text" id="name" v-model="customer.name" placeholder="请输入昵称" required/>
        </div>
        <div class="form-item">
          <label for="phone">手机号</label>
          <input type="text" id="phone" v-model="customer.phone" placeholder="请输入手机号" required/>
        </div>
        <div class="form-item">
          <label for="email">邮箱</label>
          <input type="email" id="email" v-model="customer.email" placeholder="请输入邮箱" required/>
        </div>
        <div class="form-item">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="customer.password" placeholder="请输入密码" required/>
        </div>
        <div class="form-item">
          <label for="confirmPassword">确认密码</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="确认密码" required/>
        </div>

        <div class="form-item horizontal-radio">
          <label class="radio-label">用户身份</label>
          <div class="radio-group">
            <label class="radio-option">
              <input type="radio" value="student" v-model="customer.role" required />
              校内用户
            </label>
            <label class="radio-option">
              <input type="radio" value="merchant" v-model="customer.role" />
              商家
            </label>
          </div>
        </div>


        <div class="form-item">
          <button type="submit" class="submit-btn" :disabled="loading">{{ loading ? '注册中...' : '注册' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';
import { userApi } from '@/api';

const router = useRouter();
const loading = ref(false);

const customer = ref({
  name: '',
  password: '',
  phone: '',
  email: '',
  role: 'student'
});

const confirmPassword = ref('');

const validateForm = () => {
  if (!customer.value.name) {
    ElMessage.error('请输入昵称');
    return false;
  }
  
  if (!customer.value.phone) {
    ElMessage.error('请输入手机号');
    return false;
  }

  const phoneRegex = /^[0-9]{11}$/;
  if (!phoneRegex.test(customer.value.phone)) {
    ElMessage.error('请输入有效的11位手机号');
    return false;
  }

  if (!customer.value.email) {
    ElMessage.error('请输入邮箱');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer.value.email)) {
    ElMessage.error('请输入有效的邮箱地址');
    return false;
  }

  if (!customer.value.password) {
    ElMessage.error('请输入密码');
    return false;
  }
  
  if (customer.value.password.length < 6) {
    ElMessage.error('密码长度不能少于6位');
    return false;
  }

  if (customer.value.password !== confirmPassword.value) {
    ElMessage.error('密码和确认密码不一致');
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (validateForm()) {
    try {
      loading.value = true;
      
      const userData = {
        nickname: customer.value.name,
        phone: customer.value.phone,
        email: customer.value.email,
        password: customer.value.password,
        gender: 0, // 默认未设置
        permission: 1, // 普通用户
        wallet: 0,
        profile: "",
        image: ""
      };

      const response = await userApi.register(userData);
      const { code, msg } = response.data;
      
      if (code === 1) {
        ElMessage.success('注册成功');
        router.push('/user-login');
      } else {
        ElMessage.error(msg || '注册失败，请重试');
      }
    } catch (error) {
      console.error('注册失败:', error);
      ElMessage.error('注册请求失败，请检查网络连接');
    } finally {
      loading.value = false;
    }
  }
};
</script>


<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.app-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f5f0;
  background-image: linear-gradient(135deg, #fdf6ee 25%, transparent 25%),
  linear-gradient(225deg, #fdf6ee 25%, transparent 25%),
  linear-gradient(45deg, #fdf6ee 25%, transparent 25%),
  linear-gradient(315deg, #fdf6ee 25%, #f9f5f0 25%);
  background-position: 10px 0, 10px 0, 0 0, 0 0;
  background-size: 20px 20px;
  background-repeat: repeat;
  padding: 20px;
  box-sizing: border-box;
}

.register-container {
  width: 100%;
  max-width: 600px;
  padding: 40px;
  background-color: #fffaf5;
  border: 2px solid #800000;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(128, 0, 0, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.title {
  color: #800000;
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 25px;
  border-bottom: 2px dashed #b8860b;
  padding-bottom: 10px;
  width: 100%;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 100%;
}

.form-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.form-item label {
  font-size: 16px;
  color: #800000;
  margin-bottom: 5px;
}

.form-item input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #b22222;
  border-radius: 5px;
  outline: none;
  background-color: #fff9f0;
  color: #333;
}

.form-item input:focus {
  border-color: #8b0000;
  background-color: #fff4e8;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #800000;
  border: none;
  border-radius: 6px;
  color: #fff8dc;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #600000;
}

.submit-btn:focus {
  outline: none;
}

@media (min-width: 768px) {
  .form-item {
    flex-direction: row;
    align-items: center;
  }

  .form-item label {
    width: 30%;
    margin-bottom: 0;
    margin-right: 10px;
  }

  .form-item input {
    width: 70%;
  }
}
.horizontal-radio {
  display: flex;
  align-items: center;
}

.radio-label {
  width: 80px;
  font-weight: bold;
  color: #8b0000; /* 红色学术风 */
}

.radio-group {
  display: flex;
  flex-direction: row;
  gap: 20px; /* 控制左右间距 */
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 6px; /* 控制文字和按钮间距 */
  white-space: nowrap; /* 避免文字换行 */
}


.radio-option input[type="radio"] {
  accent-color: #8b0000;
  transform: scale(1.2);
}



</style>