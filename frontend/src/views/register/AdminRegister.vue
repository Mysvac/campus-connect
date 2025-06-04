<template>
  <div class="app-container">
    <div class="register-container">
      <h2 class="title">管理员注册</h2>
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
  permission: 2, // 管理员权限
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
        permission: 2, // 管理员用户
        wallet: 0,
        profile: "",
        image: ""
      };

      const response = await userApi.register(userData);
      const { code, msg } = response.data;
      
      if (code === 1) {
        ElMessage.success('管理员注册成功');
        router.push('/admin-login');
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

