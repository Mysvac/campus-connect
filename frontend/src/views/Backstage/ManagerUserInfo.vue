<template>
  <div class="user-profile">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="image" style="width: 100px; height: 100px" />
        <el-skeleton-item variant="p" style="width: 250px" />
        <el-skeleton-item variant="text" style="width: 100px" />
        <el-skeleton-item variant="text" style="width: 100px" />
      </template>
      <template #default>
        <el-descriptions v-if="userInfo" title="个人信息" border>
          <el-descriptions-item :rowspan="2" :width="140" label="头像" align="center">
            <el-image
                style="width: 100px; height: 100px"
                :src="userInfo.image || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                fit="cover"
            />
          </el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ userInfo.uid }}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{ userInfo.nickname }}</el-descriptions-item>
          <el-descriptions-item label="权限组">
            <el-tag size="small" :type="getPermissionTagType(userInfo.permission)">
              {{ getPermissionText(userInfo.permission) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag size="small" :type="userInfo.permission === 0 ? 'danger' : 'success'">
              {{ userInfo.permission === 0 ? '封禁' : '正常' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ getGenderText(userInfo.gender) }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ userInfo.email || '-' }}</el-descriptions-item>
          <el-descriptions-item label="余额">{{ formatWallet(userInfo.wallet) }}</el-descriptions-item>
          <el-descriptions-item label="个人简介" :span="2">
            {{ userInfo.profile || '暂无简介' }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-skeleton>
    <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        show-icon
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api'
import { baseURL } from '@/api/index.js'
import { ElMessage } from 'element-plus'

export default {
  name: 'UserProfile',
  setup() {
    const userInfo = ref(null)
    const loading = ref(true)
    const error = ref(null)

    // 获取当前登录的管理员数据
    onMounted(() => {
      // 从localStorage获取当前用户ID
      const currentUserId = localStorage.getItem('userId')
      
      if (!currentUserId) {
        error.value = '无法获取当前用户信息，请重新登录'
        loading.value = false
        return
      }
      
      // 调用API获取用户信息
      adminApi.getUserById(currentUserId)
        .then(response => {
          if (response.data && response.data.code === 1) {
            userInfo.value = response.data.data
            
            // 处理图片URL
            if (userInfo.value.image && !userInfo.value.image.startsWith('http') && !userInfo.value.image.startsWith('data:')) {
              userInfo.value.image = baseURL + userInfo.value.image
            }
            
            loading.value = false
          } else {
            error.value = '获取用户信息失败：' + (response.data?.msg || '未知错误')
            loading.value = false
          }
        })
        .catch(err => {
          console.error('获取用户信息出错:', err)
          error.value = '获取用户信息失败，请稍后重试'
          loading.value = false
        })
    })

    // 获取权限组文本
    const getPermissionText = (permission) => {
      const permissionMap = {
        0: '封禁',
        1: '普通用户',
        2: '商家',
        3: '管理员'
      }
      return permissionMap[permission] || '未知'
    }

    // 获取权限标签类型
    const getPermissionTagType = (permission) => {
      const typeMap = {
        0: 'danger',
        1: '',
        2: 'warning',
        3: 'success'
      }
      return typeMap[permission] || 'info'
    }

    // 获取性别文本
    const getGenderText = (gender) => {
      const genderMap = {
        0: '保密',
        1: '男',
        2: '女'
      }
      return genderMap[gender] || '未知'
    }

    // 格式化钱包余额
    const formatWallet = (wallet) => {
      return `¥${(wallet / 100).toFixed(2)}`
    }

    return {
      userInfo,
      loading,
      error,
      getPermissionText,
      getPermissionTagType,
      getGenderText,
      formatWallet
    }
  }
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
}
</style>
