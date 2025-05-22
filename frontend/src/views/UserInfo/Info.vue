<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// 响应式数据
const editMode = ref(false)
const loading = ref(false)

// 用户信息表单数据 - 根据数据库表结构
const userForm = ref({
  uid: null,
  permission: 1, // 0封禁，1普通，2商家，3管理
  phone: '',
  password: '',
  confirmPassword: '', // 确认密码字段，用于验证
  nickname: '',
  gender: 0, // 0保密，1男，2女
  email: '',
  profile: '',
  image: ''
})

// 权限选项
const permissionOptions = [
  { value: 0, label: '封禁', disabled: true },
  { value: 1, label: '普通用户' },
  { value: 2, label: '商家' },
  { value: 3, label: '管理员', disabled: true }
]

// 性别选项
const genderOptions = [
  { value: 0, label: '保密' },
  { value: 1, label: '男' },
  { value: 2, label: '女' }
]

// 计算属性
const currentUser = computed(() => store.getters.currentUser)

const permissionText = computed(() => {
  const option = permissionOptions.find(opt => opt.value === userForm.value.permission)
  return option ? option.label : '未知'
})

const genderText = computed(() => {
  const option = genderOptions.find(opt => opt.value === userForm.value.gender)
  return option ? option.label : '保密'
})

// 表单验证
const validateForm = () => {
  if (!userForm.value.phone) {
    alert('请输入手机号')
    return false
  }

  if (!/^1[3-9]\d{9}$/.test(userForm.value.phone)) {
    alert('请输入正确的手机号格式')
    return false
  }

  if (!userForm.value.nickname) {
    alert('请输入昵称')
    return false
  }

  if (userForm.value.nickname.length > 20) {
    alert('昵称不能超过20个字符')
    return false
  }

  if (userForm.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.value.email)) {
    alert('请输入正确的邮箱格式')
    return false
  }

  if (userForm.value.email && userForm.value.email.length > 32) {
    alert('邮箱不能超过32个字符')
    return false
  }

  if (userForm.value.profile && userForm.value.profile.length > 50) {
    alert('简介不能超过50个字符')
    return false
  }

  // 如果修改了密码，需要验证
  if (userForm.value.password) {
    if (userForm.value.password.length < 6) {
      alert('密码长度不能少于6位')
      return false
    }

    if (userForm.value.password !== userForm.value.confirmPassword) {
      alert('两次输入的密码不一致')
      return false
    }
  }

  return true
}

// 方法
const toggleEditMode = () => {
  if (editMode.value) {
    // 取消编辑时恢复原始数据
    loadUserInfo()
    userForm.value.password = ''
    userForm.value.confirmPassword = ''
  }
  editMode.value = !editMode.value
}

const saveUserInfo = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  try {
    // 准备提交的数据
    const submitData = { ...userForm.value }

    // 如果没有修改密码，删除密码字段
    if (!submitData.password) {
      delete submitData.password
    }
    delete submitData.confirmPassword

    // 这里应该调用API保存用户信息
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用

    // 更新store中的用户信息
    await store.dispatch('updateUserInfo', submitData)

    editMode.value = false
    userForm.value.password = ''
    userForm.value.confirmPassword = ''
    console.log('用户信息保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败，请重试')
  } finally {
    loading.value = false
  }
}

const loadUserInfo = () => {
  if (currentUser.value) {
    userForm.value = {
      ...currentUser.value,
      password: '',
      confirmPassword: ''
    }
  } else {
    // 模拟用户数据
    userForm.value = {
      uid: 10001,
      permission: 1,
      phone: '13800138000',
      password: '',
      confirmPassword: '',
      nickname: '智联用户',
      gender: 0,
      email: 'user@example.com',
      profile: '这是一个热爱学习的大学生',
      image: '/api/placeholder/120/120'
    }
  }
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) { // 限制2MB
      alert('图片大小不能超过2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      userForm.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 生命周期
onMounted(() => {
  loadUserInfo()
})
</script>

<template>
  <div class="info-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">个人信息</h2>
      <div class="header-actions">
        <button
            v-if="!editMode"
            @click="toggleEditMode"
            class="edit-btn"
        >
          编辑信息
        </button>
        <div v-else class="edit-actions">
          <button
              @click="saveUserInfo"
              :disabled="loading"
              class="save-btn"
          >
            {{ loading ? '保存中...' : '保存' }}
          </button>
          <button
              @click="toggleEditMode"
              class="cancel-btn"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 用户信息表单 -->
    <div class="info-form">
      <!-- 头像和基本信息行 -->
      <div class="main-info-row">
        <!-- 头像区域 -->
        <div class="avatar-section">
          <div class="avatar-container">
            <img
                :src="userForm.image || '/api/placeholder/120/120'"
                alt="用户头像"
                class="avatar"
            />
            <div v-if="editMode" class="avatar-overlay">
              <input
                  type="file"
                  accept="image/*"
                  @change="handleAvatarChange"
                  class="avatar-input"
                  id="avatar-upload"
              />
              <label for="avatar-upload" class="avatar-label">
                更换头像
              </label>
            </div>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="basic-info">
          <div class="info-grid">
            <!-- 用户ID -->
            <div class="info-item">
              <label class="info-label">用户ID</label>
              <div class="info-value readonly">
                {{ userForm.uid || '未分配' }}
              </div>
            </div>

            <!-- 权限等级 -->
            <div class="info-item">
              <label class="info-label">权限等级</label>
              <div v-if="!editMode" class="info-value">
                <span :class="['permission-badge', `permission-${userForm.permission}`]">
                  {{ permissionText }}
                </span>
              </div>
              <select
                  v-else
                  v-model="userForm.permission"
                  class="info-select"
                  :disabled="currentUser?.permission !== 3"
              >
                <option
                    v-for="option in permissionOptions"
                    :key="option.value"
                    :value="option.value"
                    :disabled="option.disabled"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- 手机号 -->
            <div class="info-item">
              <label class="info-label">手机号 <span class="required">*</span></label>
              <div v-if="!editMode" class="info-value">
                {{ userForm.phone || '未设置' }}
              </div>
              <input
                  v-else
                  v-model="userForm.phone"
                  type="tel"
                  class="info-input"
                  placeholder="请输入11位手机号"
                  maxlength="11"
                  required
              />
            </div>

            <!-- 昵称 -->
            <div class="info-item">
              <label class="info-label">昵称 <span class="required">*</span></label>
              <div v-if="!editMode" class="info-value">
                {{ userForm.nickname || '未设置' }}
              </div>
              <input
                  v-else
                  v-model="userForm.nickname"
                  type="text"
                  class="info-input"
                  placeholder="请输入昵称（最多20字符）"
                  maxlength="20"
                  required
              />
            </div>

            <!-- 性别 -->
            <div class="info-item">
              <label class="info-label">性别</label>
              <div v-if="!editMode" class="info-value">
                {{ genderText }}
              </div>
              <select
                  v-else
                  v-model="userForm.gender"
                  class="info-select"
              >
                <option
                    v-for="option in genderOptions"
                    :key="option.value"
                    :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- 邮箱 -->
            <div class="info-item">
              <label class="info-label">邮箱</label>
              <div v-if="!editMode" class="info-value">
                {{ userForm.email || '未设置' }}
              </div>
              <input
                  v-else
                  v-model="userForm.email"
                  type="email"
                  class="info-input"
                  placeholder="请输入邮箱地址（最多32字符）"
                  maxlength="32"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 密码修改区域 (编辑模式下显示) -->
      <div v-if="editMode" class="password-section">
        <div class="section-title">密码修改</div>
        <div class="password-row">
          <div class="info-item">
            <label class="info-label">新密码</label>
            <input
                v-model="userForm.password"
                type="password"
                class="info-input"
                placeholder="留空表示不修改密码"
            />
          </div>
          <div class="info-item">
            <label class="info-label">确认密码</label>
            <input
                v-model="userForm.confirmPassword"
                type="password"
                class="info-input"
                placeholder="请再次输入新密码"
            />
          </div>
        </div>
      </div>

      <!-- 个人简介区域 -->
      <div class="profile-section">
        <label class="info-label section-title">个人简介</label>
        <div v-if="!editMode" class="profile-value">
          {{ userForm.profile || '这个人很懒，什么都没有留下...' }}
        </div>
        <div v-else class="profile-edit">
          <textarea
              v-model="userForm.profile"
              class="profile-textarea"
              placeholder="请输入个人简介（最多50字符）"
              maxlength="50"
              rows="4"
          ></textarea>
          <div class="char-count">
            {{ (userForm.profile || '').length }}/50
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-container {
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #f8f9fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(139, 0, 0, 0.1);
}

.page-title {
  font-size: 1.8rem;
  color: #8B0000;
  margin: 0;
  font-weight: bold;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .save-btn, .cancel-btn {
  padding: 10px 25px;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #8B0000;
  color: white;
}

.edit-btn:hover {
  background-color: #B22222;
}

.save-btn {
  background-color: #28a745;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background-color: #218838;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.info-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100vh - 140px);
  overflow-y: auto;
}

.main-info-row {
  display: flex;
  gap: 30px;
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(139, 0, 0, 0.1);
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #8B0000;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-input {
  display: none;
}

.avatar-label {
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  text-align: center;
  padding: 5px;
}

.basic-info {
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-weight: 600;
  color: #5C2E2E;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.section-title {
  font-size: 1.1rem;
  color: #8B0000;
  font-weight: bold;
  margin-bottom: 15px;
}

.required {
  color: #dc3545;
}

.info-value {
  padding: 12px 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  color: #495057;
  min-height: 20px;
}

.info-value.readonly {
  background-color: #e9ecef;
  color: #6c757d;
}

.permission-badge {
  padding: 6px 15px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
}

.permission-0 {
  background-color: #dc3545;
  color: white;
}

.permission-1 {
  background-color: #17a2b8;
  color: white;
}

.permission-2 {
  background-color: #ffc107;
  color: #212529;
}

.permission-3 {
  background-color: #28a745;
  color: white;
}

.info-input, .info-select {
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.info-input:focus, .info-select:focus {
  outline: none;
  border-color: #8B0000;
  box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
}

.password-section {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(139, 0, 0, 0.1);
}

.password-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.profile-section {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(139, 0, 0, 0.1);
  flex: 1;
}

.profile-value {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  color: #495057;
  min-height: 60px;
  line-height: 1.5;
}

.profile-edit {
  position: relative;
}

.profile-textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.profile-textarea:focus {
  outline: none;
  border-color: #8B0000;
  box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 5px;
}

.edit-actions {
  display: flex;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-info-row {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .password-row {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
  }

  .info-container {
    padding: 10px;
  }
}
</style>