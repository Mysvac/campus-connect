<template>
  <main class="task-board-main">
    <!-- 新建任务表单 -->
    <div class="main-section new-task-form" v-if="showNewTaskForm">
      <h2 class="form-title">发布新任务</h2>
      <form @submit.prevent="submitNewTask" class="form-container">
        <div class="form-group">
          <label for="task-name">任务名</label>
          <input type="text" id="task-name" v-model="newTask.name" required maxlength="20" placeholder="请输入任务名称(最多20字)">
        </div>

        <div class="form-group">
          <label for="task-money">金额 (元)</label>
          <input type="number" id="task-money" v-model.number="newTask.money" required min="1" placeholder="请输入任务金额">
        </div>

        <div class="form-group">
          <label for="task-contact">联系方式</label>
          <input type="text" id="task-contact" v-model="newTask.contact" required maxlength="50" placeholder="请输入联系方式">
        </div>

        <div class="form-group content-group">
          <label for="task-details">详情</label>
          <textarea id="task-details" v-model="newTask.details" required placeholder="请输入任务详情..."></textarea>
        </div>

        <div class="form-group">
          <label for="task-tag">标签</label>
          <div class="custom-select">
            <select id="task-tag" v-model="newTask.tag" required>
              <option value="" disabled selected>请选择标签</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
            <div class="select-arrow"></div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$emit('hide-new-task-form')">取消</button>
          <button type="submit" class="submit-btn">
            <span>发布</span>
            <svg width="15px" height="10px" viewBox="0 0 13 10">
              <path d="M1,5 L11,5"></path>
              <polyline points="8 1 12 5 8 9"></polyline>
            </svg>
          </button>
        </div>
      </form>
    </div>

    <!-- 任务详情 -->
    <div class="main-section task-detail" v-else-if="selectedTask">
      <div class="modal-header">
        <h3>任务详情</h3>
        <button class="close-btn" @click="closeTaskDetail">×</button>
      </div>

      <div class="detail-content">
        <!-- 任务内容 -->
        <div class="detail-task-card">
          <div class="task-header">
            <div class="user-info">
              <img :src="'https://via.placeholder.com/40'" alt="用户头像" class="user-avatar">
              <div>
                <h4 class="user-name">用户{{ selectedTask.uid }}</h4>
                <span class="post-time">{{ formatTime(selectedTask.time) }}</span>
              </div>
            </div>
            <div class="task-tags">
              <span class="task-tag">{{ selectedTask.tag }}</span>
              <span class="task-status" :class="getStatusClass(selectedTask.status)">
                {{ getStatusText(selectedTask.status) }}
              </span>
            </div>
          </div>

          <h3 class="task-title">{{ selectedTask.name }}</h3>

          <div class="task-content">
            <p>{{ selectedTask.details }}</p>
          </div>

          <div class="task-meta">
            <div class="money">
              <i class="icon">💰</i>
              <span>金额: {{ selectedTask.money }}元</span>
            </div>
            <!-- 只有当任务已接取或发布者是当前用户时才显示联系方式 -->
            <div class="contact" v-if="selectedTask.status >= 1 || selectedTask.uid === currentUserId">
              <i class="icon">📞</i>
              <span>联系: {{ selectedTask.contact }}</span>
            </div>
            <div class="contact placeholder" v-else>
              <i class="icon">📞</i>
              <span>联系方式: 接取任务后可见</span>
            </div>
          </div>

          <div class="task-actions" v-if="selectedTask.status === 0">
            <button class="action-btn accept" @click="acceptTask(selectedTask)">
              <i class="icon">✓</i>
              <span>接取任务</span>
            </button>
          </div>
          <div class="task-actions" v-else-if="selectedTask.status === 1">
            <button class="action-btn complete" @click="completeTask(selectedTask)">
              <i class="icon">✓</i>
              <span>完成任务</span>
            </button>
            <button class="action-btn terminate" @click="terminateTask(selectedTask)">
              <i class="icon">✗</i>
              <span>终止任务</span>
            </button>
          </div>
        </div>

        <!-- 备注部分 -->
        <div class="notes-section">
          <h4>备注</h4>
          <div class="notes-content" v-if="selectedTask.notes">
            {{ selectedTask.notes }}
          </div>
          <div class="no-notes" v-else>
            <p>暂无备注</p>
          </div>

        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="main-section task-section" v-else>
      <!-- 搜索结果提示 -->
      <div class="search-results-info" v-if="searchQuery">
      </div>

      <transition-group name="task-fade" tag="div" class="task-grid">
        <div class="task-card" v-for="task in filteredTasks" :key="task.tid" @click="showTaskDetail(task)">
          <div class="task-header">
            <div class="task-tags">
              <span class="task-tag">{{ task.tag }}</span>
              <span class="task-status" :class="getStatusClass(task.status)">
                {{ getStatusText(task.status) }}
              </span>
            </div>
          </div>
          <h3 class="task-title">{{ task.name }}</h3>
          <div class="task-content">
            <p>{{ truncateContent(task.details) }}</p>
          </div>
          <div class="task-money">
            <i class="icon">💰</i>
            <span>{{ task.money }}元</span>
          </div>
          <div class="task-footer">
            <div class="user-info">
              <img :src="'https://via.placeholder.com/30'" alt="用户头像" class="user-avatar-small">
              <span class="post-time-sm">{{ formatTime(task.time) }}</span>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- 没有搜索结果时显示 -->
      <div class="no-results" v-if="searchQuery && filteredTasks.length === 0">
        <p>没有找到匹配 "{{ searchQuery }}" 的任务</p>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'TaskBoardMain',
  props: {
    showNewTaskForm: {
      type: Boolean,
      default: false
    },
    currentTag: {
      type: String,
      default: null
    },
    selectedTaskId: {
      type: Number,
      default: null
    },
    searchQuery: { // 添加searchQuery prop
      type: String,
      default: ''
    }
  },


  data() {
    return {
      // 模拟当前登录用户ID
      currentUserId: 1001,
      tasks: [
        {
          tid: 1,
          uid: 1001,
          name: '数据库作业',
          details: '完成数据库第五章习题，需要提交PDF格式。',
          tag: '1',
          status: 0, // 0-待接取 1-进行中 2-终止 3-完成
          money: 50,
          contact: 'WeChat: db_helper',
          notes: '',
          time: 1712659200000
        },
        {
          tid: 2,
          uid: 1002,
          name: '项目组会议记录',
          details: '周四下午3点在图书馆二楼讨论小组项目进展，需要一名记录员。',
          tag: '2',
          status: 0,
          money: 30,
          contact: 'QQ: 123456789',
          notes: '',
          time: 1712572800000
        },
        {
          tid: 3,
          uid: 1003,
          name: '英语翻译',
          details: '翻译一篇英语论文摘要，约500字。',
          tag: '3',
          status: 1, // 进行中
          money: 100,
          contact: 'Phone: 135****6789',
          notes: '已完成初稿，需要校对',
          time: 1712400000000
        },
        {
          tid: 4,
          uid: 1001,
          name: '宿舍送餐',
          details: '帮忙从校门口取一份外卖送到6号宿舍楼',
          tag: '4',
          status: 3, // 已完成
          money: 15,
          contact: 'WeChat: food_lover',
          notes: '任务已完成并支付',
          time: 1712313600000
        },
        {
          tid: 5,
          uid: 1004,
          name: '实验数据录入',
          details: '将书面实验数据录入Excel表格，约200条记录。',
          tag: '5',
          status: 2, // 已终止
          money: 80,
          contact: 'Email: lab@example.com',
          notes: '因截止日期调整，任务终止',
          time: 1712227200000
        },
        {
          tid: 6,
          uid: 1005,
          name: '海报设计',
          details: '为社团活动设计宣传海报，需要有PS经验。',
          tag: '6',
          status: 0,
          money: 150,
          contact: 'WeChat: designer_club',
          notes: '',
          time: 1712140800000
        }
      ],
      newTask: {
        name: '',
        details: '',
        tag: '',
        money: '',
        contact: ''
      },
      nextTid: 7,
      selectedTask: null,
      newNote: '',
      cachedFilteredTasks: [], // 用于缓存过滤后的任务
      isFiltering: false // 标记是否正在过滤
    }
  },
  computed: {
    filteredTasks() {
      if (this.isFiltering) {
        return this.cachedFilteredTasks;
      }

      let filtered = this.tasks;

      // 按标签筛选
      if (this.currentTag) {
        filtered = filtered.filter(task => task.tag === this.currentTag);
      }

      // 按搜索关键词筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(task =>
            task.name.toLowerCase().includes(query) ||
            task.details.toLowerCase().includes(query)
        );
      }

      this.cachedFilteredTasks = filtered;
      return filtered;
    }
  },
  watch: {
    currentTag() {
      this.isFiltering = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.isFiltering = false;
        }, 50); // 短暂延迟，避免闪烁
      });
    },
    // 监听selectedTaskId的变化
    selectedTaskId(newId) {
      if (newId) {
        const task = this.tasks.find(t => t.tid === newId);
        if (task) {
          this.showTaskDetail(task);
        }
      }
    },
    // 监听搜索查询的变化
    searchQuery() {
      this.isFiltering = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.isFiltering = false;
        }, 50); // 短暂延迟，避免闪烁
      });
    }
  },

  mounted() {
    // 初始化时发送任务数据
    this.$emit('update-tasks', this.tasks);
  },

  methods: {
    formatTime(timestamp) {
      const now = Date.now();
      const diff = now - timestamp;

      // 一天内
      if (diff < 86400000) {
        return '今天';
      }
      // 两天内
      else if (diff < 172800000) {
        return '昨天';
      }
      // 一周内
      else if (diff < 604800000) {
        return Math.floor(diff / 86400000) + '天前';
      }
      // 其他情况显示具体日期
      else {
        const date = new Date(timestamp);
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      }
    },
    getStatusText(status) {
      const statusMap = {
        0: '待接取',
        1: '进行中',
        2: '已终止',
        3: '已完成'
      };
      return statusMap[status] || '未知';
    },
    getStatusClass(status) {
      const classMap = {
        0: 'status-waiting',
        1: 'status-ongoing',
        2: 'status-terminated',
        3: 'status-completed'
      };
      return classMap[status] || '';
    },
    truncateContent(content) {
      if (content.length > 60) {
        return content.substring(0, 60) + '...';
      }
      return content;
    },
    submitNewTask() {
      // 表单验证
      if (!this.newTask.name.trim()) {
        alert('请输入任务名');
        return;
      }
      if (!this.newTask.details.trim()) {
        alert('请输入详情');
        return;
      }
      if (!this.newTask.tag) {
        alert('请选择标签');
        return;
      }
      if (!this.newTask.money || this.newTask.money <= 0) {
        alert('请输入有效金额');
        return;
      }
      if (!this.newTask.contact.trim()) {
        alert('请输入联系方式');
        return;
      }

      // 创建新任务
      const newTask = {
        tid: this.nextTid++,
        uid: this.currentUserId, // 使用当前用户ID
        name: this.newTask.name,
        details: this.newTask.details,
        tag: this.newTask.tag,
        status: 0, // 默认待接取
        money: this.newTask.money,
        contact: this.newTask.contact,
        notes: '',
        time: Date.now()
      };

      // 添加到任务列表头部
      this.tasks.unshift(newTask);

      // 重置表单
      this.newTask = {
        name: '',
        details: '',
        tag: '',
        money: '',
        contact: ''
      };

      // 隐藏表单
      this.$emit('hide-new-task-form');

      // 提示成功
      setTimeout(() => {
        alert('任务发布成功！');
      }, 300);

      // 发出任务更新事件
      this.$emit('update-tasks', this.tasks);
    },
    showTaskDetail(task) {
      // 显示任务详情
      this.selectedTask = JSON.parse(JSON.stringify(task)); // 创建深拷贝
      this.newNote = ''; // 清空备注框
    },
    closeTaskDetail() {
      // 找到原始任务并更新状态
      if (this.selectedTask) {
        const originalTask = this.tasks.find(t => t.tid === this.selectedTask.tid);
        if (originalTask) {
          originalTask.status = this.selectedTask.status;
          originalTask.notes = this.selectedTask.notes;
        }
      }

      // 关闭任务详情
      this.selectedTask = null;

      this.$emit('update-tasks', this.tasks);
    },
    acceptTask(task) {
      // 将任务状态改为进行中
      task.status = 1;

      // 更新原始任务的状态
      const originalTask = this.tasks.find(t => t.tid === task.tid);
      if (originalTask) {
        originalTask.status = 1;
      }

      alert('已接取任务！');

      this.$emit('update-tasks', this.tasks);
    },
    completeTask(task) {
      // 将任务状态改为已完成
      task.status = 3;

      // 更新原始任务的状态
      const originalTask = this.tasks.find(t => t.tid === task.tid);
      if (originalTask) {
        originalTask.status = 3;
      }

      alert('任务已标记为完成！');
      this.$emit('update-tasks', this.tasks);
    },
    terminateTask(task) {
      // 将任务状态改为已终止
      task.status = 2;

      // 更新原始任务的状态
      const originalTask = this.tasks.find(t => t.tid === task.tid);
      if (originalTask) {
        originalTask.status = 2;
      }

      alert('任务已标记为终止！');
      this.$emit('update-tasks', this.tasks);
    },
    // 添加清除搜索的方法
    clearSearch() {
      // 清除搜索并通知父组件
      this.$emit('clear-search');
    }
  }
}
</script>

<style scoped>
.task-board-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  background-color: #f5f5f5;
  font-family: 'Georgia', serif;

}

.task-section {
  background-color: #FAD689;
  background-image: url("https://www.transparenttextures.com/patterns/purty-wood.png");
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
}

.new-task-form {
  background-color: #fffdf0;
  background-image: url("https://www.transparenttextures.com/patterns/inspiration-geometry.png");
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
}

/* 使用网格布局来排列正方形便签 */
.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 10px;
}

.section-title, .form-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #8B0000;
  position: relative;
  padding-bottom: 10px;
  text-align: center;
  font-family: 'Georgia', serif;
}

.section-title::after, .form-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  border-radius: 3px;
}

/* 正方形便签样式 */
.task-card {
  background-color: #fffdf0;
  border-radius: 2px;
  padding: 15px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.15);
  position: relative;
  border-bottom: 1px solid #e0d070;
  border-right: 1px solid #e0d070;
  font-family: 'Georgia', serif;
  display: flex;
  flex-direction: column;
  aspect-ratio: 1/1; /* 保持正方形比例 */
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* 便签折角效果 */
.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  border-width: 0 16px 16px 0;
  border-style: solid;
  border-color: #e0d070 #f9f9f9;
}

.task-card:hover {
  transform: translateY(-5px) rotate(1deg);
  box-shadow: 5px 5px 7px rgba(0, 0, 0, 0.2);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.task-tag {
  background-color: rgba(139, 0, 0, 0.1);
  color: #8B0000;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid #8B0000;
}

.task-status {
  padding: 3px 6px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
}

.status-waiting {
  background-color: #fff3e0;
  color: #e65100;
  border: 1px solid #e65100;
}

.status-ongoing {
  background-color: #e3f2fd;
  color: #1565c0;
  border: 1px solid #1565c0;
}

.status-completed {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #2e7d32;
}

.status-terminated {
  background-color: #fbe9e7;
  color: #c62828;
  border: 1px solid #c62828;
}

.task-title {
  font-size: 1rem;
  margin: 5px 0;
  color: #8B0000;
  font-weight: bold;
  /* 最多显示两行，超出省略 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-content {
  margin: 8px 0;
  color: #333;
  line-height: 1.4;
  font-size: 0.9rem;
  flex-grow: 1;
  overflow: hidden;
}

.task-money {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #e65100;
  font-weight: bold;
  margin: 5px 0;
  font-size: 0.95rem;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  font-size: 0.8rem;
  color: #666;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #8B0000;
}

.user-avatar-small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #8B0000;
}

.post-time-sm {
  font-size: 0.75rem;
  color: #777;
}

.task-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 15px 0;
}

.money, .contact {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.money {
  color: #e65100;
  font-weight: bold;
}

.contact {
  color: #333;
}

/* 新建任务表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #8B0000;
  font-family: 'Georgia', serif;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #8B0000;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #333;
  background-color: #fffdf0;
  font-family: 'Georgia', serif;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #B22222;
  box-shadow: 0 0 0 2px rgba(178, 34, 34, 0.2);
}

.new-task-form .form-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
}

.new-task-form .content-group {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.new-task-form #task-details {
  flex-grow: 1;
  min-height: 150px;
  resize: none;
}

/* Custom Select Styling */
.custom-select {
  position: relative;
  display: inline-block;
  width: 100%;
}

.custom-select select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  padding: 10px;
  border: 1px solid #8B0000;
  border-radius: 8px;
  background-color: #fffdf0;
  color: #333;
  cursor: pointer;
  font-family: 'Georgia', serif;
  font-size: 0.95rem;
}

.custom-select .select-arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #8B0000;
  pointer-events: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.cancel-btn,
.submit-btn {
  padding: 10px 25px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Georgia', serif;
  display: flex;
  align-items: center;
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid #8B0000;
  color: #8B0000;
}

.cancel-btn:hover {
  background-color: rgba(139, 0, 0, 0.1);
}

.submit-btn {
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 6px rgba(139, 0, 0, 0.3);
  position: relative;
  gap: 8px;
}

.submit-btn svg {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: white;
  stroke-width: 2;
  transform: translateX(-5px);
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(139, 0, 0, 0.4);
}

.submit-btn:hover svg {
  transform: translateX(0);
}

/* 任务详情样式 */
.task-detail {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.task-detail .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
  color: white;
}

.task-detail .modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-family: 'Georgia', serif;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 5px;
}

.close-btn:hover {
  transform: scale(1.2);
}

.task-detail .detail-content {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}

/* 详情页中的任务卡片样式 */
.detail-task-card {
  background-color: #fffdf0;
  border-radius: 2px;
  padding: 20px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.15);
  position: relative;
  border-bottom: 1px solid #e0d070;
  border-right: 1px solid #e0d070;
  font-family: 'Georgia', serif;
  margin-bottom: 20px;
}

.detail-task-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  border-width: 0 16px 16px 0;
  border-style: solid;
  border-color: #e0d070 #f9f9f9;
}

.task-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
  border-top: 1px solid #e0d070;
  padding-top: 15px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
  border: none;
}

.action-btn.accept {
  background-color: #fff3e0;
  color: #e65100;
}

.action-btn.accept:hover {
  background-color: #ffe0b2;
}

.action-btn.accept {
  background-color: #fff3e0;
  color: #e65100;
}

.action-btn.accept:hover {
  background-color: #ffe0b2;
}

.action-btn.complete {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.action-btn.complete:hover {
  background-color: #c8e6c9;
}

.action-btn.terminate {
  background-color: #fbe9e7;
  color: #c62828;
}

.action-btn.terminate:hover {
  background-color: #ffccbc;
}

/* 备注部分样式 */
.notes-section {
  margin-top: 30px;
}

.notes-section h4 {
  font-size: 1.1rem;
  color: #8B0000;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
  font-weight: bold;
}

.notes-content {
  padding: 15px;
  background-color: #fff8e1;
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #333;
  margin-bottom: 20px;
}

.no-notes {
  text-align: center;
  padding: 15px;
  color: #777;
  font-style: italic;
  margin-bottom: 20px;
}


.add-note-form textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #8B0000;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: none;
  background-color: #fffdf0;
  font-family: 'Georgia', serif;
}

.add-note-form textarea:focus {
  outline: none;
  border-color: #B22222;
  box-shadow: 0 0 0 3px rgba(178, 34, 34, 0.2);
}

/* 动画效果 */
.task-fade-enter-active, .task-fade-leave-active {
  transition: all 0.3s ease;
}

.task-fade-enter-from, .task-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.no-results{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: #333;
  font-style: italic;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .task-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  .task-card {
    padding: 12px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>