<template>
  <div>

    <!-- 任务信息列表 -->
    <el-table :data="paginatedTaskData" style="width: 100%" stripe v-loading="isLoading">
      <el-table-column label="任务编号" prop="tid" width="80">
        <template #default="{ row }">
          <span>{{ row.tid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="发布人ID" prop="uid" width="80">
        <template #default="{ row }">
          <span>{{ row.uid }}</span>
        </template>
      </el-table-column>      <el-table-column label="任务名" prop="name" width="110">
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="金额" prop="money" width="70">
        <template #default="{ row }">
          <span>{{ row.money }} 元</span>
        </template>
      </el-table-column>

      <el-table-column label="联系方式" prop="contact" width="120">
        <template #default="{ row }">
          <span>{{ row.contact }}</span>
        </template>
      </el-table-column>

      <el-table-column label="详情" prop="details" min-width="300">
        <template #default="{ row }">
          <el-tooltip
              :content="row.details"
              placement="top"
              :hide-after="0"
              :enterable="false"
              :disabled="row.details.length < 30"
          >
            <span>{{ row.details.length > 30 ? row.details.substring(0, 30) + '...' : row.details }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="状态" prop="status" width="80">
        <template #default="{ row }">
          <el-tag
              :type="getStatusType(row.status)"
              size="small"
          >
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="标签" prop="tag" width="80">
        <template #default="{ row }">
          <el-tag
              :type="getTagType(row.tag)"
              size="small"
          >
            {{ row.tag }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="发布时间" prop="time" width="140">
        <template #default="{ row }">
          <span>{{ formatTime(row.time) }}</span>
        </template>
      </el-table-column>      <el-table-column label="操作" width="80">
        <template #default="scope">
          <el-button
              type="danger"
              size="small"
              @click="deleteRow(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-container" style="margin-top: 20px; display: flex; justify-content: center;">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredTaskData.length"
      >
      </el-pagination>
    </div>

    <!-- 添加任务对话框 -->
    <el-dialog title="发布新任务" v-model="dialogVisible" width="40%">
      <el-form :model="newTask" label-width="100px" :rules="rules" ref="taskForm">
        <el-form-item label="发布人ID" prop="uid">
          <el-input v-model.number="newTask.uid" type="number" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="任务名" prop="name">
          <el-input v-model="newTask.name" placeholder="请输入任务名"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model.number="newTask.money" type="number" placeholder="请输入金额"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="newTask.contact" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="详情" prop="details">
          <el-input v-model="newTask.details" type="textarea" :rows="4" placeholder="请输入任务详情"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="newTask.status" placeholder="请选择状态">
            <el-option
                v-for="status in statusOptions"
                :key="status.value"
                :label="status.label"
                :value="status.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-select v-model="newTask.tag" placeholder="请选择标签">
            <el-option
                v-for="tag in tagOptions"
                :key="tag.value"
                :label="tag.label"
                :value="tag.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitNewTask">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import taskApi from '@/api/taskApi';
import api from '@/api';

export default {
  name: "TaskManagement",
  data() {
    return {
      selectedTag: "",
      selectedStatus: "",
      taskData: [],
      isLoading: false,
      dialogVisible: false,
      newTask: {
        uid: '',
        name: '',
        money: 0,
        contact: '',
        details: '',
        status: 0,
        tag: '',
        time: null
      },
      currentPage: 1,
      pageSize: 7,
      currentUserId: null, // 当前登录用户ID，从登录状态获取
      tagOptions: [], // 标签选项，从API获取
      statusOptions: [
        { value: 0, label: '待接取' },
        { value: 1, label: '进行中' },
        { value: 2, label: '终止' },
        { value: 3, label: '已完成' }
      ],
      rules: {
        uid: [
          { required: true, message: '请输入发布人ID', trigger: 'blur' },
          { type: 'number', message: '发布人ID必须为数字', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入任务名', trigger: 'blur' },
          { max: 20, message: '任务名长度不能超过20个字符', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { type: 'number', message: '金额必须为数字', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { max: 50, message: '联系方式长度不能超过50个字符', trigger: 'blur' }
        ],
        details: [
          { required: true, message: '请输入任务详情', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        tag: [
          { required: true, message: '请选择标签', trigger: 'change' },
          { max: 10, message: '标签长度不能超过10个字符', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    filteredTaskData() {
      // 只显示当前登录人id发布的任务
      let result = this.taskData.filter(item => item.uid === this.currentUserId);

      // 按标签筛选
      if (this.selectedTag) {
        result = result.filter(item => item.tag === this.selectedTag);
      }

      // 按状态筛选
      if (this.selectedStatus !== "" && this.selectedStatus !== null) {
        result = result.filter(item => item.status === this.selectedStatus);
      }

      return result;
    },
    paginatedTaskData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredTaskData.slice(start, end);
    },
  },
  methods: {    // 获取任务列表
    fetchTasks() {
      console.log('fetchTasks 被调用, 当前用户ID:', this.currentUserId);
      this.isLoading = true;
      
      // 如果没有用户ID，先获取当前用户信息
      if (!this.currentUserId) {
        console.log('用户ID为空，尝试获取用户ID');
        this.getCurrentUserId().then(() => {
          console.log('获取用户ID成功，开始加载任务:', this.currentUserId);
          this.loadUserTasks();
        }).catch(() => {
          console.log('获取用户ID失败');
          this.isLoading = false;
        });
      } else {
        console.log('用户ID已存在，直接加载任务:', this.currentUserId);
        this.loadUserTasks();
      }
    },    // 获取当前用户ID
    async getCurrentUserId() {
      try {
        // 检查用户是否已认证
        if (localStorage.getItem('isAuthenticated') !== 'true') {
          console.log('[DEBUG] User not authenticated');
          return null;
        }
        
        // 优先从localStorage获取当前用户信息
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.uid) {
          console.log('[DEBUG] Got user ID from localStorage:', currentUser.uid);
          this.currentUserId = currentUser.uid;
          return currentUser.uid;
        }
        
        console.log('[DEBUG] No user ID found in localStorage');
        return null;
      } catch (error) {
        console.error('[DEBUG] Error getting current user ID:', error);
        return null;
      }
    },// 加载用户任务
    async loadUserTasks() {
      try {
        console.log('开始获取用户任务, 用户ID:', this.currentUserId);
        const response = await taskApi.getUserTasks(this.currentUserId);
        console.log('getUserTasks API 响应:', response);
          if (response.data && response.data.code === 1) {
          this.taskData = response.data.data;
          console.log('成功加载任务数据:', this.taskData.length, '条任务');
        } else {
          console.error('获取任务列表失败:', response.data.msg);
          ElMessage.error('获取任务列表失败: ' + (response.data.msg || '未知错误'));
          this.taskData = [];
        }
      } catch (error) {
        console.error('获取任务列表失败:', error);
        ElMessage.error('获取任务列表失败');
        this.taskData = [];
      } finally {
        this.isLoading = false;
      }
    },// 显示添加对话框
    showAddDialog() {
      this.dialogVisible = true;
      this.newTask = {
        uid: this.currentUserId,
        name: '',
        money: 0,
        contact: '',
        details: '',
        status: 2, // 后端默认为未开始状态
        tag: '',
        time: null
      };
      // 如果有表单引用，重置验证
      if (this.$refs.taskForm) {
        this.$refs.taskForm.resetFields();
      }
    },

    // 提交新任务
    async submitNewTask() {
      if (this.$refs.taskForm) {
        this.$refs.taskForm.validate(async (valid) => {
          if (valid) {
            try {
              const taskData = {
                ...this.newTask,
                uid: this.currentUserId
              };
              
              const response = await taskApi.createTask(taskData);
              if (response.data && response.data.code === 1) {
                ElMessage.success('发布任务成功');
                this.fetchTasks(); // 重新获取任务列表
                this.dialogVisible = false;
              } else {
                console.error('发布任务失败:', response.data.msg);
                ElMessage.error('发布任务失败: ' + (response.data.msg || '未知错误'));
              }
            } catch (error) {
              console.error('发布任务失败:', error);
              ElMessage.error('发布任务失败');
            }
          } else {
            return false;
          }
        });
      }    },

    // 删除行
    deleteRow(row) {
      // 弹出确认框
      ElMessageBox.confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'      }).then(async () => {
        try {
          const response = await api.delete(`/api/task/delete-tasks-by-tid/${row.tid}`);
          if (response.data && response.data.code === 1) {
            const index = this.taskData.findIndex(item => item.tid === row.tid);
            if (index !== -1) {
              this.taskData.splice(index, 1);
            }
            ElMessage.success('删除任务成功');
          } else {
            console.error('删除任务失败:', response.data.msg);
            ElMessage.error('删除任务失败: ' + (response.data.msg || '未知错误'));
          }
        } catch (error) {
          console.error('删除任务失败:', error);
          ElMessage.error('删除任务失败');
        }
      }).catch(() => {
        ElMessage.info('已取消删除');
      });
    },

    // 处理分页大小变化
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },

    // 处理当前页变化
    handleCurrentChange(page) {
      this.currentPage = page;
    },

    // 格式化时间戳
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    },

    // 根据标签获取对应的类型样式
    getTagType(tag) {
      // 为不同标签设置不同颜色
      const tagMap = {};
      this.tagOptions.forEach((item, index) => {
        const types = ['', 'success', 'warning', 'info', 'danger'];
        tagMap[item.value] = types[index % types.length];
      });
      return tagMap[tag] || '';
    },    // 获取状态对应的样式
    getStatusType(status) {
      const statusMap = {
        0: 'info',    // 待接取 - 蓝色
        1: 'warning', // 进行中 - 黄色
        2: 'danger',  // 终止 - 红色
        3: 'success'  // 已完成 - 绿色
      };
      return statusMap[status] || '';
    },

    // 获取状态对应的标签文本
    getStatusLabel(status) {
      const statusOption = this.statusOptions.find(option => option.value === status);
      return statusOption ? statusOption.label : '未知状态';
    },    // 获取标签列表
    async fetchTags() {
      try {
        const response = await taskApi.getTaskTags();
        if (response.data && response.data.code === 1) {
          this.tagOptions = response.data.data.map(tag => ({
            value: tag,
            label: tag
          }));
        } else {
          console.error('获取标签列表失败:', response.data.msg);
          // 使用默认标签
          this.setDefaultTags();
        }
      } catch (error) {
        console.error('获取标签列表失败:', error);
        // 使用默认标签
        this.setDefaultTags();
      }
    },

    // 设置默认标签
    setDefaultTags() {
      this.tagOptions = [
        { value: '校园跑腿', label: '校园跑腿' },
        { value: '学习辅导', label: '学习辅导' },
        { value: '设计服务', label: '设计服务' },
        { value: '生活服务', label: '生活服务' },
        { value: '文档处理', label: '文档处理' },
        { value: '活动帮助', label: '活动帮助' }
      ];
    }  },  async created() {
    console.log('UserTasks 组件 created 生命周期开始');
    
    // 初始化用户ID
    try {
      await this.getCurrentUserId();
      console.log('用户ID初始化成功:', this.currentUserId);
    } catch (error) {
      // 如果获取用户ID失败，设置一个默认值或者引导用户登录
      console.error('初始化用户ID失败', error);
    }
    
    console.log('开始获取标签');
    this.fetchTags();
    
    console.log('开始获取任务列表');
    this.fetchTasks();
  },
};
</script>

<style scoped>
.el-table {
  width: 100%;
}

.el-select {
  width: 120px;
  margin-right: 10px;
}

.el-button {
  height: 36px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>