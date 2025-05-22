<template>
  <div class="sidebar">
    <el-menu default-active="1" class="el-menu-vertical-demo">
      <el-sub-menu index="1">
        <template #title>
          留言管理
        </template>
        <el-menu-item index="1-1" @click="goToPage('/backstage/message-board')">留言内容</el-menu-item>
        <el-menu-item index="1-2" @click="goToPage('/backstage/message-board-comment')">留言评论</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="2">
        <template #title>
          交易管理
        </template>
        <el-menu-item index="2-1" @click="goToPage('/backstage/transactions')">商品内容</el-menu-item>
        <el-menu-item index="2-2" @click="goToPage('/backstage/transactions-order')">商品订单</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="3">
        <template #title>
          任务管理
        </template>
        <el-menu-item index="3-1" @click="goToPage('/backstage/tasks')">任务内容</el-menu-item>
        <el-menu-item index="3-2" @click="goToPage('/backstage/tasks-status')">任务状态</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="4">
        <template #title>
          评分管理
        </template>
        <el-menu-item index="4-1" @click="goToPage('/backstage/ratings')">评分内容</el-menu-item>
        <el-menu-item index="4-2" @click="goToPage('/backstage/ratings-comment')">评分评论</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="5" @click="goToPage('/backstage/users')">用户管理</el-menu-item>

    </el-menu>
  </div>
</template>

<script>
export default {
  methods: {
    // 使用 router.push 实现路由跳转
    goToPage(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 17vw; /* 设置宽度为视口宽度的20% */
  height: calc(100vh - 50px); /* 减去导航栏高度 */
  background-color: #fff;
  border-right: 1px solid #ccc;
  overflow-y: auto;
}

.el-menu-vertical-demo {
  width: 100%;
}
</style>
