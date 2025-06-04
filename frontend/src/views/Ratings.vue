<template>
  <div class="main-layout">
    <Header @search="handleSearch" />
    <div class="content-container">
      <RatingsLeft
          class="left-sidebar"
          @filter-by-tag="filterByTag"
          @show-new-post-form="showNewPostForm = true" />
      <RatingsMain
          ref="mainContent"
          class="main-content"
          :current-tag="currentTag"
          :search-query="searchQuery"
          :show-new-post-form="showNewPostForm"
          :selected-rating-id="selectedRatingId"
          @hide-new-post-form="showNewPostForm = false"
          @ratings-updated="updateRatings" />
      <RatingsRight
          class="right-sidebar"
          :ratings="allRatings"
          @view-rating="viewRatingFromHotTopics" />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import RatingsLeft from "@/components/Ratings/RatingsLeft.vue";
import RatingsMain from "@/components/Ratings/RatingsMain.vue";
import RatingsRight from "@/components/Ratings/RatingsRight.vue";

export default {
  name: 'Ratings',
  components: {
    Header,
    RatingsLeft,
    RatingsMain,
    RatingsRight
  },
  data() {
    return {
      currentTag: null,
      searchQuery: '',
      showNewPostForm: false,
      allRatings: [],
      selectedRatingId: null
    }
  },
  methods: {
    filterByTag(tag) {
      this.currentTag = tag;
      this.searchQuery = '';  // 清空搜索查询
      this.showNewPostForm = false;
      this.selectedRatingId = null; // 清除选中的评分
    },
    handleSearch(query) {
      this.searchQuery = query;
      this.currentTag = null;  // 清空标签过滤
      this.showNewPostForm = false;
      this.selectedRatingId = null; // 清除选中的评分
    },
    updateRatings(ratings) {
      this.allRatings = [...ratings];
    },
    viewRatingFromHotTopics(ratingId) {
      this.selectedRatingId = ratingId;
      // 清除其他筛选条件
      this.searchQuery = '';
      this.currentTag = null;
      this.showNewPostForm = false;

      // 通知主内容组件显示详情
      this.$nextTick(() => {
        if (this.$refs.mainContent) {
          this.$refs.mainContent.viewRatingDetails(ratingId);
        }
      });
    }
  }
}
</script>


<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  padding: 15px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  overflow: hidden;
  background-image: url("https://www.transparenttextures.com/patterns/lined-paper-2.png");
}

.content-container {
  display: grid;
  grid-template-columns: 220px 1fr 280px;
  gap: 20px;
  margin-top: 0;
  flex-grow: 1;
  overflow: hidden;
}

.left-sidebar, .right-sidebar, .main-content {
  height: 100%;
  min-height: 0; /* 这个属性很重要，确保flex子项不会溢出 */
}

@media (max-width: 1200px) {
  .content-container {
    grid-template-columns: 180px 1fr 240px;
  }
}

@media (max-width: 992px) {
  .content-container {
    grid-template-columns: 160px 1fr;
  }

  .right-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .content-container {
    grid-template-columns: 1fr;
  }

  .left-sidebar {
    display: none;
  }
}
</style>