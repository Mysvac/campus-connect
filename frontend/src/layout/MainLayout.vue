<template>
  <div class="main-layout">
    <Header />
    <div class="content-container">
      <MessageBoardLeftAside
          class="left-sidebar"
          @filter-by-tag="filterByTag"
          @show-new-post-form="showNewPostForm = true" />
      <MessageBoardMain
          class="main-content"
          :current-tag="currentTag"
          :show-new-post-form="showNewPostForm"
          @hide-new-post-form="showNewPostForm = false" />
      <MessageBoardRightAside class="right-sidebar" />
    </div>
  </div>
</template>

<script>


import Header from "@/components/Header.vue";
import MessageBoardLeftAside from "@/components/MessageBoard/MessageBoardLeft.vue";
import MessageBoardMain from "@/components/MessageBoard/MessageBoardMain.vue";
import MessageBoardRightAside from "@/components/MessageBoard/MessageBoardRight.vue";

export default {
  name: 'MainLayout',
  components: {
    Header,
    MessageBoardLeftAside,
    MessageBoardMain,
    MessageBoardRightAside
  },
  data() {
    return {
      currentTag: null,
      showNewPostForm: false
    }
  },
  methods: {
    filterByTag(tag) {
      this.currentTag = tag;
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