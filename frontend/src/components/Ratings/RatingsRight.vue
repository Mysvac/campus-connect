<template>
  <aside class="right-aside">
    <div class="hot-topics">
      <h3 class="section-title">热门评分</h3>

      <div class="topic-list">
        <div
            class="topic-item"
            v-for="(topic, index) in hotTopics"
            :key="topic.sid"
            @click="$emit('view-rating', topic.sid)"
        >
          <span class="topic-rank" :class="{'top-three': index < 3}">{{ index + 1 }}</span>
          <div class="topic-content">
            <p class="topic-title">{{ topic.goal }}</p>
            <p class="topic-meta">{{ topic.num }}人参与 · {{ topic.score.toFixed(1) }}分</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'RatingRightAside',
  props: {
    ratings: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    hotTopics() {
      // 按参与人数排序
      return [...this.ratings]
          .sort((a, b) => b.num - a.num)
          .slice(0, 8); // 只显示前8个
    }
  }
}
</script>

<style scoped>
.right-aside {
  background-color: #fff9f7;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(139, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 100vh; /* 可根据需要调整 */
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #5C2E2E;
  position: relative;
  padding-bottom: 10px;
  font-weight: bold;
  text-align: center;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%; /* 让横线从中间开始 */
  transform: translateX(-50%); /* 再向左移动一半宽度，实现真正居中 */
  width: 40px;
  height: 3px;
  background: #EBA293; /* 柔和粉橘，统一风格 */
  border-radius: 3px;
}

.topic-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  flex-grow: 1;
}

.topic-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.topic-item:hover {
  background-color: #FDEDEA; /* 柔粉 hover */
}

.topic-rank {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: #F1C6B5;
  color: #4b2e2e;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: bold;
  flex-shrink: 0;
}

.topic-rank.top-three {
  background: #B03A2E;
  color: white;
}

.topic-content {
  flex-grow: 1;
}

.topic-title {
  margin: 0 0 5px;
  font-size: 0.95rem;
  color: #4b2e2e;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.topic-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: #6c757d;
}
</style>