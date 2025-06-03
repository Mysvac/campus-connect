<script>
export default {
  name: 'SidebarFilter',
  data() {
    return {
      filters: [
        { id: 'profile', name: '个人信息', active: true },
        { id: 'messages', name: '留言管理', active: false },
        { id: 'transactions', name: '交易管理', active: false },
        { id: 'mytransactions', name: '我的订单', active: false },
        { id: 'tasks', name: '任务管理', active: false },
        { id: 'mytasks', name: '我的任务', active: false },
        { id: 'ratings', name: '我的评分', active: false }
      ]
    };
  },
  methods: {
    selectFilter(filterId) {
      this.filters.forEach(filter => filter.active = false);
      const selected = this.filters.find(filter => filter.id === filterId);
      if (selected) selected.active = true;
      this.$emit('filter-change', filterId);
    }
  }
};
</script>

<template>
  <aside class="left-aside">
    <!-- 筛选区域 -->
    <div class="tags-section">
      <h3 class="section-title">管理菜单</h3>
      <div class="tags-container">
        <button
            v-for="filter in filters"
            :key="filter.id"
            class="cta"
            :class="{ active: filter.active }"
            @click="selectFilter(filter.id)"
        >
          <span>{{ filter.name }}</span>
          <svg width="15px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.left-aside {
  background-color: #fff9f7;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 6px rgba(139, 0, 0, 0.08);
  height: 100%;
  overflow-y: auto;
  max-height: 100vh;
}

/* 标签区域样式 */
.section-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
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

.tags-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cta {
  position: relative;
  padding: 12px 18px;
  transition: all 0.2s ease;
  border: none;
  background: none;
  align-self: flex-start;
}

.cta:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  border-radius: 50px;
  background: #F1C6B5;
  width: 45px;
  height: 45px;
  transition: all 0.3s ease;
}

.cta span {
  position: relative;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #4b2e2e;
}

.cta svg {
  position: relative;
  top: 0;
  margin-left: 10px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: #4b2e2e;
  stroke-width: 2;
  transform: translateX(-5px);
  transition: all 0.3s ease;
}

.cta:hover:before {
  width: 100%;
  background: #EBA293;
}

.cta:hover svg {
  transform: translateX(0);
}

.cta:active {
  transform: scale(0.95);
}

.cta.active span {
  color: white;
}

.cta.active:before {
  width: 100%;
  background: #B03A2E;
}
</style>
