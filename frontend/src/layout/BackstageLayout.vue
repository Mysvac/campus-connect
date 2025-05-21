<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <Header />

    <!-- 主体部分：左侧侧边栏 + 右侧内容区域 -->
    <div class="main-content">
      <Aside />
      <div class="content">
        <router-view /> <!-- 动态加载右侧内容 -->
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Backstage/BackstageHeader.vue";
import Aside from "../components/Backstage/BackstageAside.vue";

export default {
  name: "Layout",
  components: {
    Header,
    Aside,
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 占满屏幕高度 */
}

.main-content {
  display: flex;
  flex: 1; /* 占满剩余高度 */
}

.content {
  flex: 1; /* 填充右侧内容区域 */
  padding: 16px;
  overflow: auto; /* 如果内容过多支持滚动 */
}
</style>
