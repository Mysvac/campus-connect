<template>
  <div class="main-layout">
    <Header @search="handleSearch" />
    <div class="content-container">
      <TasksLeft
          class="left-sidebar"
          @filter-by-tag="filterByTag"
          @show-new-task-form="showNewTaskForm = true" />
      <TasksMain
          class="main-content"
          :current-tag="currentTag"
          :show-new-task-form="showNewTaskForm"
          :selected-task-id="selectedTaskId"
          :search-query="searchQuery"
          @hide-new-task-form="showNewTaskForm = false"
          @update-tasks="updateTasks" />
      <TasksRight
          class="right-sidebar"
          :tasks="tasks"
          @show-task-detail="showTaskDetail" />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import TasksLeft from "@/components/Tasks/TasksLeft.vue";
import TasksMain from "@/components/Tasks/TasksMain.vue";
import TasksRight from "@/components/Tasks/TasksRight.vue";

export default {
  name: 'MainLayout',
  components: {
    Header,
    TasksLeft,
    TasksMain,
    TasksRight
  },
  data() {
    return {
      currentTag: null,
      showNewTaskForm: false,
      tasks: [],
      selectedTaskId: null,
      searchQuery: ''  // 添加搜索查询字段
    }
  },
  methods: {
    filterByTag(tag) {
      this.currentTag = tag;
      this.showNewTaskForm = false;
      this.searchQuery = ''; // 清除搜索条件
    },
    updateTasks(tasks) {
      this.tasks = tasks;
    },
    showTaskDetail(task) {
      this.selectedTaskId = task.tid;
      this.showNewTaskForm = false;
    },
    handleSearch(query) {
      this.searchQuery = query;
      this.currentTag = null;  // 清空标签过滤
      this.showNewTaskForm = false;
      this.selectedTaskId = null; // 清除选中的任务
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