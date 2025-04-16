<template>
  <aside class="left-aside">
    <!-- 新建评分按钮 -->
    <button class="new-post-btn" @click="$emit('show-new-post-form')">
      新建评分
    </button>

    <!-- 标签分区 -->
    <div class="tags-section">
      <h3 class="section-title">标签分区</h3>
      <div class="tags-container">
        <button
            v-for="tag in tags"
            :key="tag.id"
            class="cta"
            :class="{ active: tag.active }"
            @click="selectTag(tag.id)"
        >
          <span>{{ tag.name }}</span>
          <svg width="15px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'MessageBoardLeftAside',
  data() {
    return {
      tags: [
        { id: 1, name: '1', active: true },
        { id: 2, name: '2', active: false },
        { id: 3, name: '3', active: false },
        { id: 4, name: '4', active: false },
        { id: 5, name: '5', active: false },
        { id: 6, name: '6', active: false },
        { id: 7, name: '7', active: false },
        { id: 8, name: '8', active: false }
      ]
    }
  },
  methods: {
    selectTag(tagId) {
      this.tags.forEach(tag => tag.active = false);
      const selectedTag = this.tags.find(tag => tag.id === tagId);
      if (selectedTag) selectedTag.active = true;
      const tagName = selectedTag ? selectedTag.name : '全部';
      this.$emit('filter-by-tag', tagName === '全部' ? null : tagName);
    }
  }
}
</script>

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
  max-height: 100vh; /* 可根据需要调整 */
}

/* 新建留言按钮样式（复古红+活泼感） */
.new-post-btn {
  padding: 10px 20px;
  background-color: #B03A2E;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
  font-family: "Noto Sans SC", "微软雅黑", sans-serif;
}

.new-post-btn:hover {
  background-color: #a93226;
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
  background: #D4A373; /* 柔和金棕色，带点温暖感 */
  border-radius: 3px;
}

.tags-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* CTA 按钮样式用于标签按钮 */
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
  background: #F1C6B5; /* 带点粉棕色，轻松校园感 */
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

/* 激活状态 */
.cta.active span {
  color: white;
}

.cta.active:before {
  width: 100%;
  background: #B03A2E;
}
</style>