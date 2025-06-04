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
              <option v-for="option in tagOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
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
        <div class="detail-task-card">          <div class="task-header">            <div class="user-info">
              <img :src="getUserAvatar(selectedTask)" alt="用户头像" class="user-avatar">
              <div>
                <h4 class="user-name">{{ selectedTask.username || `用户${selectedTask.uid}` }}</h4>
                <span class="post-time">{{ formatTime(selectedTask.time) }}</span>
              </div>
            </div>
            <div class="task-tags">
              <span class="task-tag">{{ getTagName(selectedTask.tag) }}</span>
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
          </div>          <div class="task-actions" v-if="selectedTask.status === 0">
            <button class="action-btn accept" @click="acceptTask(selectedTask)">
              <i class="icon">✓</i>
              <span>申请任务</span>
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
          <div class="task-actions" v-else-if="selectedTask.status === 2">
            <div class="status-info terminated">
              <i class="icon">⚠️</i>
              <span>任务已终止</span>
            </div>
          </div>
          <div class="task-actions" v-else-if="selectedTask.status === 3">
            <div class="status-info completed">
              <i class="icon">✅</i>
              <span>任务已完成</span>
            </div>
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

        <!-- 申请者管理（仅任务发布者可见） -->
        <div class="applicants-section" v-if="selectedTask && selectedTask.uid === currentUserId && selectedTask.status === 0">
          <h4>申请者列表</h4>
          <div class="applicants-list" v-if="taskApplicants.length > 0">            <div class="applicant-item" v-for="applicant in taskApplicants" :key="applicant.uid">              <div class="applicant-info">
                <img :src="getUserAvatar(applicant)" alt="用户头像" class="user-avatar">
                <div class="applicant-details">
                  <span class="applicant-name">{{ applicant.username || `用户${applicant.uid}` }}</span>
                  <span class="apply-time">{{ formatTime(applicant.time) }}</span>
                  <span class="apply-message" v-if="applicant.message">{{ applicant.message }}</span>
                </div>
              </div>
              <div class="applicant-actions">
                <button class="action-btn accept-applicant" @click="acceptApplicant(selectedTask.tid, applicant.uid)">
                  <i class="icon">✓</i>
                  <span>接受</span>
                </button>
                <button class="action-btn reject-applicant" @click="rejectApplicant(selectedTask.tid, applicant.uid)">
                  <i class="icon">✗</i>
                  <span>拒绝</span>
                </button>
              </div>
            </div>
          </div>
          <div class="no-applicants" v-else>
            <p>暂无申请者</p>
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
        <div class="task-card" v-for="task in filteredTasks" :key="task.tid" @click="showTaskDetail(task)">          <div class="task-header">
            <div class="task-tags">
              <span class="task-tag">{{ getTagName(task.tag) }}</span>
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
          </div>          <div class="task-footer">
            <div class="user-info">
              <img :src="getUserAvatar(task)" alt="用户头像" class="user-avatar-small">
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
import { tasksApi, userApi } from '@/api';
import { baseURL } from '@/api/index';

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
      tasks: [],
      isLoading: true,
      error: null,
      newTask: {
        name: '',
        details: '',
        tag: '',
        money: '',
        contact: ''
      },
      selectedTask: null,
      newNote: '',
      cachedFilteredTasks: [], // 用于缓存过滤后的任务
      isFiltering: false, // 标记是否正在过滤
      // 初始化默认标签，保证即使API调用失败也有标签可选
      tagOptions: [
        { id: 1, name: '快递代取' },
        { id: 2, name: '食品代购' },
        { id: 3, name: '失物招领' },
        { id: 4, name: '运动伙伴' },
        { id: 5, name: '学习互助' },
        { id: 6, name: '校园兼职' },
        { id: 7, name: '活动组织' },        { id: 8, name: '其他' }
      ],      taskApplicants: [], // 新增申请者列表
      userAvatarCache: {}, // 用户头像缓存
      userAvatarPromiseCache: {}, // 用户头像Promise缓存，防止并发请求
      usernameCache: {}, // 用户名结果缓存
      usernamePromiseCache: {} // 用户名Promise缓存，防止并发请求
    }
  },computed: {
    filteredTasks() {
      if (this.isFiltering) {
        return this.cachedFilteredTasks;
      }

      let filtered = this.tasks;      // 按标签筛选
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
        this.fetchTaskDetail(newId);
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
    },
    // 当tasks数据发生变化时，向父组件发送更新事件
    tasks: {
      handler(newVal) {
        this.$emit('update-tasks', newVal);
      },
      deep: true
    }
  },

  created() {
    // 获取任务标签
    this.fetchTaskTags();
    
    // 获取任务列表
    this.fetchTasks();

    // 如果初始selectedTaskId存在，则自动加载该任务详情
    if (this.selectedTaskId) {
      this.fetchTaskDetail(this.selectedTaskId);
    }
  },
  methods: {    // 获取任务标签
    fetchTaskTags() {
      // 即使API请求失败，我们也有预设的标签
      tasksApi.getTaskTags()
        .then(response => {
          if (response.data && response.data.code === 1 && response.data.data && response.data.data.length > 0) {
            // 确保API返回的标签格式正确，如果不正确则进行转换
            const apiTags = response.data.data;
            // 检查第一个标签的格式是否有正确的name属性
            if (apiTags.length > 0 && apiTags[0].name && typeof apiTags[0].name === 'string' && isNaN(apiTags[0].name)) {
              // name是非数字字符串，格式正确，更新标签
              this.tagOptions = apiTags;
              console.log('成功获取任务标签:', apiTags);
            } else {
              // 如果name是数字字符串或格式不对，说明格式可能不对，需要保留原有的tagOptions
              console.log('API返回的标签格式不正确，保留默认标签');
            }
          } else {
            console.log('使用默认任务标签数据');
          }
        })
        .catch(error => {
          console.error('获取任务标签出错:', error);
          console.log('使用默认任务标签数据');
        });
    },    // 获取任务列表
    async fetchTasks() {
      this.isLoading = true;
      try {
        const response = await tasksApi.getTasks();
        if (response.data && response.data.code === 1) {
          const tasksData = response.data.data || [];
          // 为任务数据添加用户名
          this.tasks = await this.enrichWithUsernames(tasksData);
          // 向父组件发送任务数据
          this.$emit('update-tasks', this.tasks);
        } else {
          console.error('获取任务列表失败:', response.data.msg);
          this.error = response.data.msg || '获取任务列表失败';
        }
      } catch (error) {
        console.error('获取任务列表出错:', error);
        this.error = '网络错误，请稍后再试';
      } finally {
        this.isLoading = false;
      }
    },    // 获取任务详情
    async fetchTaskDetail(taskId) {
      this.isLoading = true;
      try {
        const response = await tasksApi.getTaskDetail(taskId);
        if (response.data && response.data.code === 1) {
          // 为任务详情添加用户名
          const taskWithUsername = await this.enrichWithUsernames([response.data.data]);
          const taskDetail = taskWithUsername[0];
          
          // 更新本地任务列表中的任务，或添加新任务
          const index = this.tasks.findIndex(t => t.tid === taskId);
          if (index !== -1) {
            this.tasks.splice(index, 1, taskDetail);
          } else {
            this.tasks.push(taskDetail);
          }
          
          // 显示任务详情
          this.showTaskDetail(taskDetail);
        } else {
          console.error('获取任务详情失败:', response.data.msg);
          alert('获取任务详情失败: ' + (response.data.msg || '未知错误'));
        }
      } catch (error) {
        console.error('获取任务详情出错:', error);
        alert('网络错误，请稍后再试');
      } finally {
        this.isLoading = false;
      }
    },

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
    },      getStatusText(status) {
      const statusMap = {
        0: '待接取',
        1: '进行中',
        2: '终止',
        3: '已完成'
      };
      return statusMap[status] || '未知';
    },      getStatusClass(status) {
      const classMap = {
        0: 'status-waiting',
        1: 'status-ongoing',
        2: 'status-terminated',
        3: 'status-completed'
      };
      return classMap[status] || '';
    },
    
    truncateContent(content) {
      if (!content) return ''; // 添加空值检查
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
      }      // 创建任务数据
      const taskData = {
        name: this.newTask.name,
        details: this.newTask.details,
        tag: this.newTask.tag,
        money: parseInt(this.newTask.money),
        contact: this.newTask.contact,
        status: 0,
        time: Date.now()
      };

      this.isSubmitting = true;
      
      tasksApi.createTask(taskData)
        .then(response => {
          if (response.data && response.data.code === 1) {
            // 重置表单
            this.newTask = {
              name: '',
              details: '',
              tag: '',
              money: '',
              contact: ''
            };
            
            // 重新获取任务列表
            this.fetchTasks();
            
            // 隐藏表单
            this.$emit('hide-new-task-form');
            
            // 显示成功提示
            setTimeout(() => {
              alert('任务发布成功！');
            }, 300);
          } else {
            console.error('发布任务失败:', response.data.msg);
            alert('发布任务失败: ' + (response.data.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('发布任务出错:', error);
          alert('网络错误，请稍后再试');
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    
    showTaskDetail(task) {
      // 显示任务详情
      this.selectedTask = JSON.parse(JSON.stringify(task)); // 创建深拷贝
      this.newNote = ''; // 清空备注框

      // 获取申请者列表
      this.fetchTaskApplicants(task.tid);
    },
    
    closeTaskDetail() {
      this.selectedTask = null;
    },
      acceptTask(task) {
      const applicationData = {
        message: '我想接取这个任务' // 可以让用户输入申请消息
      };

      tasksApi.applyTask(task.tid, applicationData)
        .then(response => {
          if (response.data && response.data.code === 1) {
            // 申请任务成功，任务状态仍然是待接取状态，等待发布者同意
            // 不需要修改任务状态，只需要刷新任务列表
            
            // 更新任务列表
            this.fetchTasks();
            
            // 通知用户
            alert('已成功申请任务，等待发布者同意！');
          } else {
            console.error('申请任务失败:', response.data.msg);
            alert('申请任务失败: ' + (response.data.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('申请任务出错:', error);
          alert('网络错误，请稍后再试');
        });
    },
      completeTask(task) {
      tasksApi.completeTask(task.tid, this.currentUserId)
        .then(response => {
          if (response.data && response.data.code === 1) {
            // 将本地任务状态改为已完成
            task.status = 3;
            
            // 更新任务列表
            this.fetchTasks();
            
            // 通知用户
            alert('任务已标记为完成！');
          } else {
            console.error('完成任务失败:', response.data.msg);
            alert('完成任务失败: ' + (response.data.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('完成任务出错:', error);
          alert('网络错误，请稍后再试');
        });
    },
      terminateTask(task) {
      tasksApi.terminateTask(task.tid)
        .then(response => {
          if (response.data && response.data.code === 1) {
            // 将本地任务状态改为已终止
            task.status = 2;

            // 更新任务列表
            this.fetchTasks();
            
            // 通知用户
            alert('任务已标记为终止！');
          } else {
            console.error('终止任务失败:', response.data.msg);
            alert('终止任务失败: ' + (response.data.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('终止任务出错:', error);
          alert('网络错误，请稍后再试');
        });
    },
      // 获取标签名称
      getTagName(tagId) {
      // 如果tagId为空，直接返回未分类
      if (!tagId){
      return '未分类';}
      
      // 尝试使用id查找
      let tag = this.tagOptions.find(t => t.id == tagId);
      
      // 处理标签name是数字字符串的情况
      if (tag && typeof tag.name === 'string' && !isNaN(tag.name)) {
        // 如果name是数字字符串，那么返回对应index的预设标签名称
        const index = parseInt(tag.name);
        const defaultNames = ['快递代取', '食品代购', '失物招领', '运动伙伴', '学习互助', '校园兼职', '活动组织', '其他'];
        const defaultName = (index > 0 && index <= defaultNames.length) ? defaultNames[index-1] : '未分类';
        return defaultName;
      }
      
      // 如果没找到使用id查找的标签，尝试直接用tagId作为name匹配
      if (!tag) {
        tag = this.tagOptions.find(t => t.name === tagId);
      }
      
      // 如果还是没找到，尝试直接返回tagId本身（如果它是字符串）
      return tag ? tag.name : (typeof tagId === 'string' ? tagId : '未分类');
    },
    
    // 添加清除搜索的方法
    clearSearch() {
      // 清除搜索并通知父组件
      this.$emit('clear-search');
    },    // 获取任务申请者列表
    async fetchTaskApplicants(taskId) {
      try {
        const response = await tasksApi.getTaskApplicants(taskId);
        if (response.data && response.data.code === 1) {
          const applicantsData = response.data.data || [];
          // 为申请者数据添加用户名
          this.taskApplicants = await this.enrichWithUsernames(applicantsData);
        } else {
          console.error('获取任务申请者列表失败:', response.data.msg);
          this.taskApplicants = [];
        }
      } catch (error) {
        console.error('获取任务申请者列表出错:', error);
        this.taskApplicants = [];
      }
    },

    // 接受申请者
    acceptApplicant(taskId, userId) {
      tasksApi.acceptApplicant(taskId, userId)
        .then(response => {
          if (response.data && response.data.code === 1) {
            // 更新任务状态
            const task = this.tasks.find(t => t.tid === taskId);
            if (task) {
              task.status = 1; // 进行中
            }
            
            // 更新申请者列表
            this.fetchTaskApplicants(taskId);
            
            // 通知用户
            alert('已接受申请者！');
          } else {
            console.error('接受申请者失败:', response.data.msg);
            alert('接受申请者失败: ' + (response.data.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('接受申请者出错:', error);
          alert('网络错误，请稍后再试');
        });
    },

    // 拒绝申请者
    rejectApplicant(taskId, userId) {
      tasksApi.rejectApplicant(taskId, userId)
        .then(response => {
          if (response.data && response.data.code === 1) {
            // 更新申请者列表
            this.fetchTaskApplicants(taskId);
            
            // 通知用户
            alert('已拒绝申请者！');
          } else {
            console.error('拒绝申请者失败:', response.data.msg);
            alert('拒绝申请者失败: ' + (response.data.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('拒绝申请者出错:', error);
          alert('网络错误，请稍后再试');        });
    },

    // 用户名获取相关方法
    async fetchUsername(uid) {
      // 确保uid是字符串类型进行比较
      const uidStr = String(uid);
      
      // 如果已经缓存了用户名结果，直接返回
      if (this.usernameCache[uidStr]) {
        return this.usernameCache[uidStr];
      }

      // 如果正在请求中，等待现有的Promise
      if (this.usernamePromiseCache[uidStr]) {
        return await this.usernamePromiseCache[uidStr];
      }
      
      // 创建新的Promise并缓存
      const promise = this.fetchUsernameFromAPI(uidStr);
      this.usernamePromiseCache[uidStr] = promise;

      try {
        const username = await promise;
        // 请求成功后，缓存结果并清除Promise缓存
        this.usernameCache[uidStr] = username;
        delete this.usernamePromiseCache[uidStr];
        return username;
      } catch (error) {
        // 请求失败时，清除Promise缓存，但不缓存错误结果
        delete this.usernamePromiseCache[uidStr];
        console.error('获取用户名失败:', error);
        return `用户${uid}`;
      }
    },

    // 实际的用户名API请求方法
    async fetchUsernameFromAPI(uidStr) {
      const response = await userApi.getUsername(uidStr);
      if (response.data && response.data.code === 1) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '获取用户名失败');
      }
    },

    // 为任务和申请者添加用户名
    async enrichWithUsernames(tasks) {
      const promises = [];
      
      for (const task of tasks) {
        // 获取任务发布者用户名
        promises.push(
          this.fetchUsername(task.uid).then(username => {
            task.username = username;
          })
        );
      }
      
      await Promise.all(promises);
      return tasks;
    },

    // 头像获取相关方法
    async fetchUserAvatar(uid) {
      // 检查缓存
      if (this.userAvatarCache[uid]) {
        return this.userAvatarCache[uid];
      }

      // 检查是否已有pending的请求
      if (this.userAvatarPromiseCache[uid]) {
        return this.userAvatarPromiseCache[uid];
      }

      // 创建新的请求Promise
      const promise = this.fetchUserAvatarFromAPI(uid);
      this.userAvatarPromiseCache[uid] = promise;

      try {
        const avatarUrl = await promise;
        this.userAvatarCache[uid] = avatarUrl;
        return avatarUrl;
      } catch (error) {
        console.error('获取用户头像失败:', error);
        const fallbackUrl = `https://via.placeholder.com/40?text=U${uid}`;
        this.userAvatarCache[uid] = fallbackUrl;
        return fallbackUrl;
      } finally {
        // 清除Promise缓存
        delete this.userAvatarPromiseCache[uid];
      }
    },    async fetchUserAvatarFromAPI(uid) {
      try {
        const response = await userApi.getUserData(uid);
        if (response.data && response.data.code === 1 && response.data.data) {
          const userData = response.data.data;
          // 同时处理image_path和image字段
          const imagePath = userData.image_path || userData.image;
          if (imagePath) {
            // 如果头像路径是相对路径，拼接baseURL
            if (imagePath.startsWith('/') || imagePath.startsWith('image/')) {
              const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
              return `${cleanBaseURL}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
            }
            // 如果是完整URL，直接返回
            return imagePath;
          }
        }
        // 如果没有头像数据，返回默认头像
        return `https://via.placeholder.com/40?text=U${uid}`;
      } catch (error) {
        console.error('从API获取用户头像失败:', error);
        // 发生错误时也返回默认头像
        return `https://via.placeholder.com/40?text=U${uid}`;
      }
    },

    getUserAvatar(userObj) {
      if (!userObj || !userObj.uid) {
        return 'https://via.placeholder.com/40?text=U';
      }
      
      const cached = this.userAvatarCache[userObj.uid];
      if (cached) {
        return cached;
      }
      
      // 异步获取头像，但不阻塞渲染
      this.fetchUserAvatar(userObj.uid);
      
      // 返回占位符，等待头像加载完成后会自动更新
      return `https://via.placeholder.com/40?text=U${userObj.uid}`;
    },

    // ...existing code...
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

.status-unstarted {
  background-color: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid #7b1fa2;
}

.task-title {
  font-size: 1rem;
  margin: 5px 0;
  color: #8B0000;
  font-weight: bold;  /* 最多显示两行，超出省略 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
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

/* 状态信息样式 */
.status-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  justify-content: center;
}

.status-info.terminated {
  background-color: #fbe9e7;
  color: #c62828;
  border: 1px solid #c62828;
}

.status-info.completed {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #2e7d32;
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

/* 申请者管理样式 */
.applicants-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.applicants-section h4 {
  font-size: 1.1rem;
  color: #8B0000;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
  font-weight: bold;
}

.applicants-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.applicant-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.applicant-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.applicant-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.applicant-name {
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.apply-time {
  font-size: 0.85rem;
  color: #666;
}

.apply-message {
  font-size: 0.9rem;
  color: #555;
  font-style: italic;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.applicant-actions {
  display: flex;
  gap: 8px;
}

.action-btn.accept-applicant {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #2e7d32;
  padding: 6px 12px;
  font-size: 0.85rem;
}

.action-btn.accept-applicant:hover {
  background-color: #c8e6c9;
}

.action-btn.reject-applicant {
  background-color: #fbe9e7;
  color: #c62828;
  border: 1px solid #c62828;
  padding: 6px 12px;
  font-size: 0.85rem;
}

.action-btn.reject-applicant:hover {
  background-color: #ffccbc;
}

.no-applicants {
  text-align: center;
  padding: 20px;
  color: #777;
  font-style: italic;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
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