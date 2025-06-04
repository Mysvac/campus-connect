<template>
  <div class="main-layout">
    <Header @search="handleSearch" />
    <div class="content-container">
      <MessageBoardLeft
          class="left-sidebar"
          @filter-by-tag="filterByTag"
          @show-new-post-form="showNewPostForm = true" />
      <MessageBoardMain
          class="main-content"
          :current-tag="currentTag"
          :search-query="searchQuery"
          :show-new-post-form="showNewPostForm"
          :selected-message-id="selectedMessageId"
          @hide-new-post-form="showNewPostForm = false"
          @messages-updated="updateMessages"
          @clear-search="clearSearch" />
      <MessageBoardRight
          class="right-sidebar"
          :messages="allMessages"
          @show-message-detail="showMessageFromHotTopics" />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import MessageBoardMain from "@/components/MessageBoard/MessageBoardMain.vue";
import MessageBoardLeft from "@/components/MessageBoard/MessageBoardLeft.vue";
import MessageBoardRight from "@/components/MessageBoard/MessageBoardRight.vue";

export default {
  name: 'MessageBoard',
  components: {
    Header,
    MessageBoardLeft,
    MessageBoardMain,
    MessageBoardRight
  },
  data() {
    return {
      currentTag: null,
      showNewPostForm: false,
      searchQuery: '',
      allMessages: [],
      selectedMessageId: null
    }
  },
  beforeMount() {
    // 在组件挂载前检查登录状态
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userDataExists = localStorage.getItem('currentUser') !== null;
    
    if (!isAuthenticated || !userDataExists) {
      console.log('MessageBoard: 未认证用户，跳转到登录页');
      this.$router.push('/user-login');
    }
  },
  methods: {

    filterByTag(tag) {
      this.currentTag = tag;
      this.showNewPostForm = false;
      this.searchQuery = ''; // 清除搜索条件
      this.selectedMessageId = null; // 关闭任何打开的消息详情
    },
    handleSearch(query) {
      this.searchQuery = query;
      this.currentTag = null; // 清除标签筛选
      this.showNewPostForm = false; // 隐藏发布表单
      this.selectedMessageId = null; // 关闭任何打开的消息详情
    },
    clearSearch() {
      this.searchQuery = '';
    },
    updateMessages(messages) {
      this.allMessages = [...messages];
    },
    showMessageFromHotTopics(messageId) {
      this.selectedMessageId = messageId;
      // 清除其他筛选条件
      this.searchQuery = '';
      this.currentTag = null;
      this.showNewPostForm = false;
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