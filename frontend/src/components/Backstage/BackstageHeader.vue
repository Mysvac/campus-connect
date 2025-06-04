<script setup>
import { ref, onMounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const username = ref('用户') // Default value

// 跳转到个人信息页面
const goToPage = (path) => {
  router.push(path)
}

// 登出功能
const handleLogout = () => {
  router.push('/admin-login');
};

onMounted(() => {
})
</script>

<template>
  <div style="height: 50px; border-bottom: 1px solid #ccc; display: flex; align-items: center;">
    <div style="width: 150px; text-align: center; font-weight: bold; color: dodgerblue;">后台管理</div>
    <div style="flex: 1;"></div>
    <div style="width: 100px;">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goToPage('/backstage/manager-user')">个人信息</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.el-dropdown-link:focus {
  outline: none;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>