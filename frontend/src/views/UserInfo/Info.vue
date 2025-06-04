<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { userApi } from '@/api'
import { baseURL } from '@/api/index.js'

const store = useStore()

// 响应式数据
const editMode = ref(false)
const loading = ref(false)

// 充值相关
const showRechargeDialog = ref(false)
const rechargeAmount = ref('')
const rechargeLoading = ref(false)

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
  // uid 必须有值
  if (!userForm.value.uid) {
    alert('用户ID不能为空')
    return false
  }

  // 手机号必须填写
  if (!userForm.value.phone) {
    alert('请输入手机号')
    return false
  }


  // 其他字段的验证（如果有值才验证格式）
  if (userForm.value.nickname && userForm.value.nickname.length > 20) {
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

  // 如果修改了密码，需要验证两个密码字段都不为空且一致
  if (userForm.value.password && userForm.value.password.trim() !== '') {
    if (userForm.value.password.length < 6) {
      alert('密码长度不能少于6位')
      return false
    }

    if (!userForm.value.confirmPassword || userForm.value.confirmPassword.trim() === '') {
      alert('请确认密码')
      return false
    }

    if (userForm.value.password !== userForm.value.confirmPassword) {
      alert('两次输入的密码不一致')
      return false
    }
  } else if (userForm.value.confirmPassword && userForm.value.confirmPassword.trim() !== '') {
    // 如果只填了确认密码而没填新密码
    alert('请先输入新密码')
    return false
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
    // 准备提交的数据，uid和手机号必须填，其他字段如果为空则设为null
    const submitData = {
      uid: userForm.value.uid, // 必填
      phone: userForm.value.phone, // 必填
      permission: userForm.value.permission,
      nickname: userForm.value.nickname || null,
      gender: userForm.value.gender !== undefined ? userForm.value.gender : null,
      email: userForm.value.email || null,
      profile: userForm.value.profile || null,
      image: userForm.value.image || null,
      wallet: userForm.value.wallet
    }    // 如果两个密码都为空，传null表示不修改密码；如果有密码则传递
    if (userForm.value.password && userForm.value.password.trim() !== '') {
      submitData.password = userForm.value.password
    } else {
      // 如果不修改密码，传递null
      submitData.password = null
    }

    console.log('提交的数据:', submitData)

    // 调用API保存用户信息
    const { userApi } = await import('@/api')
    const response = await userApi.updateUser(submitData)
    
    if (response.data && response.data.code === 1) {
      // 更新store中的用户信息
      const updatedUserData = {
        uid: submitData.uid,
        nickname: submitData.nickname,
        phone: submitData.phone,
        email: submitData.email,
        gender: submitData.gender,
        profile: submitData.profile,
        image: submitData.image,
        permission: submitData.permission,
        wallet: userForm.value.wallet || 0
      }
      
      // 更新localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUserData))
      
      // 更新store（如果有）
      if (store.dispatch) {
        await store.dispatch('login', updatedUserData)
      }      editMode.value = false
      userForm.value.password = ''
      userForm.value.confirmPassword = ''
        // 显示更详细的成功信息
      let changesList = []
      if (submitData.nickname) changesList.push('昵称')
      if (submitData.email) changesList.push('邮箱')
      if (submitData.profile) changesList.push('个人简介')
      if (submitData.password !== null) changesList.push('密码')
      
      let successMsg = '用户信息保存成功'
      if (changesList.length > 0) {
        successMsg += `\n已更新：${changesList.join('、')}`
      }
      
      //alert(successMsg)
    } else {
      alert('保存失败：' + (response.data?.msg || '未知错误'))
    }
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败，请重试')
  } finally {
    loading.value = false
  }
}

const loadUserInfo = async () => {
  try {
    const { userApi } = await import('@/api')
    
    // 获取当前登录用户的ID
    let currentUserId = null
    
    // 优先从store获取
    if (store.getters.currentUser?.uid) {
      currentUserId = store.getters.currentUser.uid
    } else {
      // 从localStorage获取
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      if (currentUser.uid) {
        currentUserId = currentUser.uid
      }
    }
    
    if (!currentUserId) {
      console.warn('无法获取当前用户ID')
      // 使用默认数据
      userForm.value = {
        uid: null,
        permission: 1,
        phone: '',
        password: '',
        confirmPassword: '',
        nickname: '用户',
        gender: 0,
        email: '',
        profile: '',
        image: ''
      }
      return
    }
    
    // 使用新的接口获取用户数据
    const response = await userApi.getUserData(currentUserId)
    
    if (response.data && response.data.code === 1) {
      const userData = response.data.data
      userForm.value = {
        ...userData,
        password: '',
        confirmPassword: ''
      }
    } else {
      console.error('获取用户信息失败:', response.data?.msg || '未知错误')
      // 如果获取失败，使用默认数据
      userForm.value = {
        uid: currentUserId,
        permission: 1,
        phone: '',
        password: '',
        confirmPassword: '',
        nickname: '用户',
        gender: 0,
        email: '',
        profile: '',
        image: ''
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 发生错误时使用默认数据
    userForm.value = {
      uid: null,
      permission: 1,
      phone: '',
      password: '',
      confirmPassword: '',
      nickname: '用户',
      gender: 0,
      email: '',
      profile: '',
      image: ''
    }
  }
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 文件大小验证
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB')
      return
    }

    // 文件类型验证
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('只支持JPG、JPEG、PNG格式的图片')
      return
    }

    // 创建FormData对象并添加文件
    const formData = new FormData()
    formData.append('file', file)

    // 显示上传中提示
    loading.value = true

    // 调用API上传图片
    userApi.uploadImage(formData)
      .then(response => {
        if (response.data) {
          // 获取服务器返回的图片相对路径
          const imageUrl = response.data

          // 拼接完整的图片URL用于显示
          const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
          userForm.value.image = cleanBaseURL + imageUrl

          // 显示成功提示
          alert('头像上传成功')
        } else {
          console.error('上传头像失败:', response.data?.msg)
          alert('上传头像失败: ' + (response.data?.msg || '未知错误'))
        }
      })
      .catch(error => {
        console.error('上传头像出错:', error)
        alert('网络错误，请稍后再试')
      })
      .finally(() => {
        loading.value = false
      })
  }
}

// 充值相关方法
const openRechargeDialog = () => {
  rechargeAmount.value = ''
  showRechargeDialog.value = true
}

const closeRechargeDialog = () => {
  showRechargeDialog.value = false
  rechargeAmount.value = ''
}

const validateRechargeAmount = () => {
  const amount = parseFloat(rechargeAmount.value)
  
  if (!rechargeAmount.value || isNaN(amount)) {
    alert('请输入有效的充值金额')
    return false
  }
  
  if (amount <= 0) {
    alert('充值金额必须大于0')
    return false
  }
  
  if (amount > 10000) {
    alert('单次充值金额不能超过10000元')
    return false
  }
  
  // 检查小数位数不超过2位
  if ((amount * 100) % 1 !== 0) {
    alert('充值金额最多支持2位小数')
    return false
  }
  
  return true
}

const confirmRecharge = async () => {
  if (!validateRechargeAmount()) {
    return
  }
  
  const amount = parseFloat(rechargeAmount.value)
  
  rechargeLoading.value = true
  
  try {
    const response = await userApi.recharge(amount)
    
    if (response.data && response.data.code === 1) {
      alert('充值成功！')
      closeRechargeDialog()
      
      // 更新用户信息显示
      await loadUserInfo()
      
      // 更新store中的用户信息
      const updatedUserData = response.data.data
      if (updatedUserData && store.dispatch) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
        const newUserData = {
          ...currentUser,
          wallet: updatedUserData.wallet
        }
        localStorage.setItem('currentUser', JSON.stringify(newUserData))
        await store.dispatch('login', newUserData)
      }
    } else {
      console.error('充值失败:', response.data?.msg)
      alert('充值失败: ' + (response.data?.msg || '未知错误'))
    }
  } catch (error) {
    console.error('充值出错:', error)
    alert('网络错误，请稍后再试')
  } finally {
    rechargeLoading.value = false
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
      <h2 class="page-title">个人信息</h2>      <div class="header-actions">
        <button
            class="charge-btn"
            @click="openRechargeDialog"
        >
          充值
        </button>
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
            </div>            <!-- 手机号 -->
            <div class="info-item">
              <label class="info-label">手机号 <span class="required">*</span></label>
              <div v-if="!editMode" class="info-value">
                {{ userForm.phone || '未设置' }}
              </div>
              <input
                  v-else
                  v-model="userForm.phone"
                  type="tel"
                  class="info-input readonly-input"
                  placeholder="手机号不可修改"
                  maxlength="11"
                  readonly
                  disabled
              />
            </div><!-- 昵称 -->
            <div class="info-item">
              <label class="info-label">昵称</label>
              <div v-if="!editMode" class="info-value">
                {{ userForm.nickname || '未设置' }}
              </div>
              <input
                  v-else
                  v-model="userForm.nickname"
                  type="text"
                  class="info-input"
                  placeholder="留空表示不修改（最多20字符）"
                  maxlength="20"
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
              </div>              <input
                  v-else
                  v-model="userForm.email"
                  type="email"
                  class="info-input"
                  placeholder="留空表示不修改（最多32字符）"
                  maxlength="32"
              />
            </div>

            <!-- 钱包余额 -->
            <div class="info-item">
              <label class="info-label">钱包余额</label>
              <div class="info-value">
                {{ userForm.wallet !== undefined && userForm.wallet !== null ? (userForm.wallet / 100).toFixed(2) : '0.00' }} 元
              </div>
            </div>
          </div>
        </div>
      </div>      <!-- 密码修改区域 (编辑模式下显示) -->
      <div v-if="editMode" class="password-section">
        <div class="section-title">密码修改</div>
        <div class="password-tip">
          💡 如果不想修改密码，请将两个密码字段都留空
        </div>
        <div class="password-row">
          <div class="info-item">
            <label class="info-label">新密码</label>
            <input
                v-model="userForm.password"
                type="password"
                class="info-input"
                placeholder="留空表示不修改密码（最少6位）"
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
        </div>        <div v-else class="profile-edit">
          <textarea
              v-model="userForm.profile"
              class="profile-textarea"
              placeholder="留空表示不修改个人简介（最多50字符）"
              maxlength="50"
              rows="4"
          ></textarea>
          <div class="char-count">
            {{ (userForm.profile || '').length }}/50
          </div>        </div>
      </div>
    </div>
  </div>

  <!-- 充值对话框 -->
  <div v-if="showRechargeDialog" class="dialog-overlay" @click="closeRechargeDialog">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3>账户充值</h3>
        <button class="close-btn" @click="closeRechargeDialog">×</button>
      </div>
      
      <div class="dialog-body">
        <div class="current-balance">
          <span class="balance-label">当前余额：</span>
          <span class="balance-amount">{{ userForm.wallet !== undefined && userForm.wallet !== null ? (userForm.wallet / 100).toFixed(2) : '0.00' }} 元</span>
        </div>
        
        <div class="recharge-form">
          <label class="form-label">充值金额（元）</label>
          <input
            v-model="rechargeAmount"
            type="number"
            step="0.01"
            min="0.01"
            max="10000"
            placeholder="请输入充值金额"
            class="amount-input"
            :disabled="rechargeLoading"
          />
          <div class="amount-tips">
            <span class="tip">• 最低充值金额：0.01元</span>
            <span class="tip">• 最高单次充值：10000元</span>
          </div>
        </div>
      </div>
      
      <div class="dialog-footer">
        <button 
          class="cancel-btn" 
          @click="closeRechargeDialog"
          :disabled="rechargeLoading"
        >
          取消
        </button>
        <button 
          class="confirm-btn" 
          @click="confirmRecharge"
          :disabled="rechargeLoading"
        >
          {{ rechargeLoading ? '充值中...' : '确认充值' }}
        </button>
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

.edit-tips {
  background: linear-gradient(135deg, #fff7e6 0%, #fff2e6 100%);
  border: 1px solid #ffd591;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.1);
}

.tip-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
}

.tip-content strong {
  color: #d46b08;
  font-weight: 600;
}

.tip-content ul {
  margin: 8px 0 0 0;
  padding-left: 0;
  list-style: none;
}

.tip-content li {
  margin: 5px 0;
  color: #8c4a02;
  font-size: 14px;
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

.edit-btn,.charge-btn ,.save-btn, .cancel-btn {
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

.readonly-input {
  background-color: #f8f9fa !important;
  color: #6c757d !important;
  cursor: not-allowed !important;
  border-color: #dee2e6 !important;
}

.readonly-input:focus {
  border-color: #dee2e6 !important;
  box-shadow: none !important;
}

.password-section {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(139, 0, 0, 0.1);
}

.password-tip {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
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

/* 充值对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #8B0000, #A52A2A);
  color: white;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dialog-body {
  padding: 24px;
}

.current-balance {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance-label {
  color: #6c757d;
  font-size: 14px;
}

.balance-amount {
  font-size: 18px;
  font-weight: 600;
  color: #8B0000;
}

.recharge-form {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
}

.amount-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.amount-input:focus {
  outline: none;
  border-color: #8B0000;
}

.amount-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.amount-tips {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tip {
  font-size: 12px;
  color: #6c757d;
}

.dialog-footer {
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn, .confirm-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 80px;
}

.cancel-btn {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #e9ecef;
}

.cancel-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.confirm-btn {
  background: linear-gradient(135deg, #8B0000, #A52A2A);
  color: white;
}

.confirm-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #A52A2A, #8B0000);
  transform: translateY(-1px);
}

.cancel-btn:disabled, .confirm-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.confirm-btn:disabled {
  transform: none;
}
</style>