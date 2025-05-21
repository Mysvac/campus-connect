<template>
  <div class="userinfo-layout">
    <Header @search="handleSearch" />
    <div class="personal-center-fullscreen">
      <div class="profile-header">
        <div class="profile-avatar-container">
          <div class="profile-avatar">
            <img :src="userInfo.image || defaultAvatar" alt="用户头像" />
            <div class="edit-avatar" @click="triggerImageUpload">
              <i class="fas fa-camera"></i>
              <span>修改头像</span>
            </div>
          </div>
          <input
              type="file"
              ref="imageInput"
              style="display: none"
              accept="image/*"
              @change="handleImageChange"
          />
        </div>
        <div class="profile-basic-info">
          <h2>{{ userInfo.nickname || '未设置昵称' }}</h2>
          <p class="user-role">
            <span :class="'role-badge role-' + userInfo.permission">
              {{ permissionLabels[userInfo.permission] }}
            </span>
          </p>
          <p class="user-wallet">
            <i class="fas fa-wallet"></i> 余额: {{ formatCurrency(userInfo.wallet) }}
          </p>
        </div>
      </div>

      <div class="profile-content">
        <div class="profile-content-left">
          <h3 class="section-title">个人资料</h3>

          <form @submit.prevent="saveProfile" class="profile-form">
            <div class="form-group">
              <label for="phone">手机号码</label>
              <input
                  type="text"
                  id="phone"
                  v-model="userInfo.phone"
                  class="form-control"
                  maxlength="11"
                  :disabled="true"
              />
              <small>手机号码不可修改</small>
            </div>

            <div class="form-group">
              <label for="nickname">昵称</label>
              <input
                  type="text"
                  id="nickname"
                  v-model="userInfo.nickname"
                  class="form-control"
                  maxlength="20"
                  placeholder="请输入昵称（最多20个字符）"
              />
            </div>

            <div class="form-group">
              <label>性别</label>
              <div class="gender-options">
                <label class="gender-option">
                  <input type="radio" v-model="userInfo.gender" :value="0" />
                  <span>保密</span>
                </label>
                <label class="gender-option">
                  <input type="radio" v-model="userInfo.gender" :value="1" />
                  <span>男</span>
                </label>
                <label class="gender-option">
                  <input type="radio" v-model="userInfo.gender" :value="2" />
                  <span>女</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label for="email">邮箱</label>
              <input
                  type="email"
                  id="email"
                  v-model="userInfo.email"
                  class="form-control"
                  maxlength="32"
                  placeholder="请输入邮箱（选填）"
              />
            </div>

            <div class="form-group">
              <label for="profile">个人简介</label>
              <textarea
                  id="profile"
                  v-model="userInfo.profile"
                  class="form-control"
                  maxlength="50"
                  placeholder="介绍一下自己吧（最多50个字符）"
                  rows="3"
              ></textarea>
              <div class="character-count">{{ userInfo.profile?.length || 0 }}/50</div>
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn">保存修改</button>
            </div>
          </form>
        </div>

        <div class="profile-content-right">
          <div class="account-security">
            <h3 class="section-title">账号安全</h3>
            <div class="security-options">
              <div class="security-option" @click="showChangePasswordModal = true">
                <div class="option-icon">
                  <i class="fas fa-lock"></i>
                </div>
                <div class="option-text">
                  <h4>修改密码</h4>
                  <p>定期修改密码可以保障账号安全</p>
                </div>
                <div class="option-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 修改密码弹窗 -->
      <div class="modal-overlay" v-if="showChangePasswordModal" @click="showChangePasswordModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>修改密码</h3>
            <button class="close-btn" @click="showChangePasswordModal = false">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="changePassword">
              <div class="form-group">
                <label for="oldPassword">当前密码</label>
                <input
                    type="password"
                    id="oldPassword"
                    v-model="passwordForm.oldPassword"
                    class="form-control"
                    placeholder="请输入当前密码"
                    required
                />
              </div>
              <div class="form-group">
                <label for="newPassword">新密码</label>
                <input
                    type="password"
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    class="form-control"
                    placeholder="请输入新密码"
                    required
                />
              </div>
              <div class="form-group">
                <label for="confirmPassword">确认密码</label>
                <input
                    type="password"
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    class="form-control"
                    placeholder="请再次输入新密码"
                    required
                />
                <small v-if="passwordMismatch" class="error-text">两次输入的密码不一致</small>
              </div>
              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="showChangePasswordModal = false">取消</button>
                <button type="submit" class="confirm-btn">确认修改</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import Header from "@/components/Header.vue";

// 默认头像
const defaultAvatar = '/assets/default-avatar.png';

// 权限标签
const permissionLabels = {
  0: '已封禁',
  1: '普通用户',
  2: '商家',
  3: '管理员'
};

// 用户信息
const userInfo = reactive({
  uid: '',
  permission: 1,
  phone: '',
  wallet: 0,
  nickname: '',
  gender: 0,
  email: '',
  profile: '',
  image: ''
});

// 图片上传相关
const imageInput = ref(null);

// 修改密码相关
const showChangePasswordModal = ref(false);
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 计算属性：密码是否匹配
const passwordMismatch = computed(() => {
  return passwordForm.newPassword &&
      passwordForm.confirmPassword &&
      passwordForm.newPassword !== passwordForm.confirmPassword;
});

// 组件挂载时获取用户数据
onMounted(async () => {
  try {
    // 实际项目中应该从后端API获取
    await fetchUserInfo();
  } catch (error) {
    console.error('获取用户信息失败:', error);
    // 显示错误提示
  }
});

// 获取用户信息 (模拟API调用)
const fetchUserInfo = async () => {
  // 模拟API调用，实际项目中应替换为真实的API请求
  // const response = await api.get('/user/profile');
  // Object.assign(userInfo, response.data);

  // 模拟数据
  Object.assign(userInfo, {
    uid: '10001',
    permission: 1,
    phone: '13800138000',
    wallet: 10000,
    nickname: '校园用户',
    gender: 1,
    email: 'user@example.com',
    profile: '这是我的个人简介，欢迎大家来认识我！',
    image: ''
  });
};

// 触发图片上传
const triggerImageUpload = () => {
  imageInput.value.click();
};

// 处理图片上传
const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 验证文件类型
  if (!file.type.match('image.*')) {
    alert('请选择图片文件');
    return;
  }

  // 验证文件大小 (限制为2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过2MB');
    return;
  }

  try {
    // 实际项目中应该上传到服务器
    // const formData = new FormData();
    // formData.append('image', file);
    // const response = await api.post('/user/upload-avatar', formData);
    // userInfo.image = response.data.imageUrl;

    // 模拟上传成功
    const reader = new FileReader();
    reader.onload = (e) => {
      userInfo.image = e.target.result;
    };
    reader.readAsDataURL(file);

    alert('头像上传成功');
  } catch (error) {
    console.error('上传头像失败:', error);
    alert('上传头像失败，请重试');
  }
};

// 保存个人资料
const saveProfile = async () => {
  try {
    // 实际项目中应该发送到后端API
    // await api.put('/user/profile', {
    //   nickname: userInfo.nickname,
    //   gender: userInfo.gender,
    //   email: userInfo.email,
    //   profile: userInfo.profile
    // });

    // 模拟保存成功
    setTimeout(() => {
      alert('个人资料保存成功');
    }, 500);
  } catch (error) {
    console.error('保存个人资料失败:', error);
    alert('保存个人资料失败，请重试');
  }
};

// 修改密码
const changePassword = async () => {
  // 验证两次输入的密码是否一致
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    return;
  }

  try {
    // 实际项目中应该发送到后端API
    // await api.put('/user/change-password', {
    //   oldPassword: passwordForm.oldPassword,
    //   newPassword: passwordForm.newPassword
    // });

    // 模拟修改成功
    setTimeout(() => {
      alert('密码修改成功');
      // 清空表单并关闭弹窗
      passwordForm.oldPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
      showChangePasswordModal.value = false;
    }, 500);
  } catch (error) {
    console.error('修改密码失败:', error);
    alert('修改密码失败，请检查当前密码是否正确');
  }
};

// 格式化货币显示
const formatCurrency = (value) => {
  return `¥${(value / 100).toFixed(2)}`;
};

// 处理搜索
const handleSearch = (query) => {
  console.log('搜索:', query);
  // 实现搜索功能
};
</script>

<style scoped>
.userinfo-layout {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 占满整个视口 */
  min-height: 0;
  padding: 16px; /* 四周有边距 */
  box-sizing: border-box;
}

.header {
  flex-shrink: 0;
}

.personal-center-fullscreen {
  flex: 1 1 0;
  overflow-y: auto;
  width: 100%;
  background-color: #f8f1ee;
  /* 其余样式保持不变 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0; /* 去除多余内边距，靠外层控制 */
  box-sizing: border-box;
}

/* 全屏个人中心样式 */
.personal-center-fullscreen {
  width: 100vw;
  min-height: calc(100vh - 150px);
  height: 100%;
  font-family: "Noto Sans SC", "微软雅黑", sans-serif;
  background-color: #f8f1ee;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}

/* 个人资料头部样式 */
.profile-header {
  background-color: #fff9f7;
  border-radius: 8px;
  padding: 16px 20px; /* 减少内边距 */
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 6px rgba(139, 0, 0, 0.08);
  margin-bottom: 12px; /* 缩小与下方间距 */
  width: 100%;
  box-sizing: border-box;
}

.profile-avatar-container {
  position: relative;
  flex-shrink: 0; /* 防止头像缩小 */
}

.profile-avatar {
  width: 100px; /* 稍微缩小头像 */
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 4px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-avatar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(176, 58, 46, 0.8);
  color: white;
  padding: 8px 0;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  opacity: 0;
}

.profile-avatar:hover .edit-avatar {
  opacity: 1;
}

.profile-basic-info {
  flex: 1;
}

.profile-basic-info h2 {
  font-size: 24px;
  margin: 0 0 10px 0;
  color: #5C2E2E;
}

.user-role {
  margin: 0 0 15px 0;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
}

.role-0 {
  background-color: #757575;
  color: white;
}

.role-1 {
  background-color: #81C784;
  color: white;
}

.role-2 {
  background-color: #4FC3F7;
  color: white;
}

.role-3 {
  background-color: #B03A2E;
  color: white;
}

.user-wallet {
  font-size: 16px;
  color: #5C2E2E;
  font-weight: 600;
}

/* 个人资料内容区域 */
.profile-content {
  display: flex;
  gap: 16px; /* 缩小左右内容间距 */
  width: 100%;
  box-sizing: border-box;
}

.profile-content-left {
  flex: 2;
  background-color: #fff9f7;
  border-radius: 15px;
  padding: 16px 20px; /* 减少内边距 */
  box-shadow: 0 4px 6px rgba(139, 0, 0, 0.08);
}

.profile-content-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* 保持原样 */
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 25px;
  color: #5C2E2E;
  position: relative;
  padding-bottom: 10px;
  font-weight: bold;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: #D4A373;
  border-radius: 3px;
}

/* 表单样式 */
.profile-form {
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #5C2E2E;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #E8DACC;
  border-radius: 8px;
  background-color: #FFFBF9;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #B03A2E;
  box-shadow: 0 0 0 2px rgba(176, 58, 46, 0.2);
}

.form-control:disabled {
  background-color: #f5f0ed;
  cursor: not-allowed;
}

.form-group small {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #888;
}

.gender-options {
  display: flex;
  gap: 20px;
}

.gender-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.gender-option input {
  margin-right: 8px;
}

.character-count {
  position: absolute;
  right: 10px;
  bottom: -20px;
  font-size: 12px;
  color: #888;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  padding: 12px 25px;
  background-color: #B03A2E;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.save-btn:hover {
  background-color: #A93226;
}

/* 账号安全区域 */
.account-security {
  background-color: #fff9f7;
  border-radius: 15px;
  padding: 16px 20px; /* 减少内边距 */
  box-shadow: 0 4px 6px rgba(139, 0, 0, 0.08);
  flex: 1;
}

.security-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.security-option {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #FFFBF9;
  border-radius: 10px;
  border: 1px solid #E8DACC;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.security-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(139, 0, 0, 0.12);
}

.option-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #FCE4D6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: #B03A2E;
  font-size: 18px;
}

.option-text {
  flex: 1;
}

.option-text h4 {
  margin: 0 0 5px 0;
  color: #5C2E2E;
}

.option-text p {
  margin: 0;
  font-size: 14px;
  color: #888;
}

.option-arrow {
  color: #B03A2E;
}

/* 修改密码弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 450px;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
}

.modal-header {
  padding: 15px 20px;
  background-color: #FCE4D6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #5C2E2E;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #5C2E2E;
  cursor: pointer;
}

.modal-body {
  padding: 25px;
}

.error-text {
  color: #B03A2E;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 25px;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: #E8DACC;
  color: #5C2E2E;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #D9C9B8;
}

.confirm-btn {
  padding: 10px 20px;
  background-color: #B03A2E;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.confirm-btn:hover {
  background-color: #A93226;
}

/* 响应式设计 */
@media (max-width: 1100px) {
  .profile-content {
    flex-direction: column;
    gap: 12px;
  }

  .profile-content-left,
  .profile-content-right {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .userinfo-layout {
    padding: 8px;
  }

  .personal-center-fullscreen {
    padding: 15px 10px;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 12px 8px;
  }

  .profile-avatar-container {
    margin: 0 auto;
  }

  .profile-content-left,
  .account-security {
    padding: 12px 8px;
  }

  .profile-content {
    gap: 8px;
  }

  .gender-options {
    justify-content: space-between;
  }

  .security-option {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .profile-avatar {
    width: 80px;
    height: 80px;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn, .confirm-btn, .save-btn {
    width: 100%;
    margin-top: 10px;
  }
}
</style>