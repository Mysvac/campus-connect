<template>
  <div>    <!-- 任务处理信息列表 -->
    <el-table :data="paginatedTaskData" style="width: 100%" stripe v-loading="isLoading">
      <el-table-column label="任务编号" prop="tid" width="100">
        <template #default="{ row }">
          <span>{{ row.tid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="任务名" prop="taskName" width="160">
        <template #default="{ row }">
          <span>{{ row.taskName || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="金额" prop="taskMoney" width="80">
        <template #default="{ row }">
          <span>{{ row.taskMoney ? row.taskMoney + ' 元' : '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标签" prop="taskTag" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.taskTag" size="small" type="info">{{ row.taskTag }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="任务详情" prop="taskDetails" min-width="200">
        <template #default="{ row }">
          <el-tooltip
              v-if="row.taskDetails"
              :content="row.taskDetails"
              placement="top"
              :hide-after="0"
              :enterable="false"
              :disabled="row.taskDetails.length < 30"
          >
            <span>{{ row.taskDetails.length > 30 ? row.taskDetails.substring(0, 30) + '...' : row.taskDetails }}</span>
          </el-tooltip>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="申请状态" prop="status" width="120">
        <template #default="{ row }">
          <el-tag
            :type="getStatusType(row.status)"
            size="small"
          >
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="申请时间" prop="time" width="180">
        <template #default="{ row }">
          <span>{{ formatTime(row.time) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button
              type="danger"
              size="small"
              @click="cancelApplication(scope.row)"
              v-if="scope.row.status === 0"
          >
            取消申请
          </el-button>
          <span v-else>-</span>
        </template>      </el-table-column>
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
      </el-pagination>    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import api from '@/api';

export default {
  name: "TaskProcessingManagement",  data() {
    return {
      selectedStatus: "",
      taskData: [],
      isLoading: false,
      currentUserId: null, // 当前登录用户的ID，从登录信息中获取
      currentPage: 1,
      pageSize: 7,
      statusOptions: [
        { value: 0, label: '待同意' },
        { value: 1, label: '进行中' },
        { value: 2, label: '终止' },
        { value: 3, label: '完成' }
      ]
    };
  },
  computed: {
    filteredTaskData() {
      let result = this.taskData.filter(item => item.uid === this.currentUserId);

      if (this.selectedStatus !== "") {
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
  methods: {    // 获取任务处理列表
    async fetchTasks() {
      this.isLoading = true;
      
      // 如果没有用户ID，先获取当前用户信息
      if (!this.currentUserId) {
        try {
          await this.getCurrentUserId();
        } catch (error) {
          this.isLoading = false;
          return;
        }
      }      try {
        console.log('[DEBUG] Fetching tasks handle for user:', this.currentUserId);
        const response = await api.get(`/api/task/get-taskshandle-by-uid/${this.currentUserId}`);
        console.log('[DEBUG] Tasks handle response:', response);
        
        if (response.data && response.data.code === 1) {
          // 获取任务处理记录后，需要获取对应的任务信息来补充任务名
          const tasksHandleData = response.data.data;
          console.log('[DEBUG] Got tasks handle data:', tasksHandleData);
          
          this.taskData = await Promise.all(tasksHandleData.map(async (item) => {
            try {
              const taskResponse = await api.get(`/api/task/get-tasks-by-tid/${item.tid}`);
              let taskName = '未知任务';
              let taskDetails = '';
              let taskMoney = 0;
              let taskTag = '';
              
              if (taskResponse.data && taskResponse.data.code === 1) {
                const taskData = taskResponse.data.data;
                taskName = taskData.name;
                taskDetails = taskData.details;
                taskMoney = taskData.money;
                taskTag = taskData.tag;
              }
              return {
                ...item,
                taskName: taskName,
                taskDetails: taskDetails,
                taskMoney: taskMoney,                taskTag: taskTag
              };
            } catch (error) {
              console.error(`获取任务${item.tid}详情失败:`, error);
              return {
                ...item,
                taskName: '获取失败',
                taskDetails: '',
                taskMoney: 0,
                taskTag: ''
              };
            }
          }));
          console.log('[DEBUG] Final task data:', this.taskData);
        } else {
          console.log('没有找到任务处理记录或获取失败:', response.data?.msg);
          this.taskData = [];
        }
      } catch (error) {
        console.error('获取任务处理列表失败:', error);
        ElMessage.error('获取任务处理列表失败');
        this.taskData = [];
      } finally {
        this.isLoading = false;
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
    },

    // 取消申请
    async cancelApplication(row) {
      try {
        // 弹出确认框
        await this.$confirm('确定要取消这个任务申请吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        // 这里应该调用后端API来取消申请
        // 由于要求不修改后端，暂时只做前端模拟
        const index = this.taskData.findIndex(item => 
          item.tid === row.tid && item.uid === row.uid
        );
        
        if (index !== -1) {
          this.taskData.splice(index, 1);
          ElMessage.success('已取消申请');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消申请失败:', error);
          ElMessage.error('取消申请失败');
        }
      }
    },    // 处理分页大小变化
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

    // 获取状态标签
    getStatusLabel(status) {
      const statusObj = this.statusOptions.find(item => item.value === status);
      return statusObj ? statusObj.label : '未知状态';
    },    // 根据状态获取对应的类型样式
    getStatusType(status) {
      const statusMap = {
        0: 'warning',  // 待同意 - 黄色
        1: 'info',     // 进行中 - 蓝色
        2: 'danger',   // 终止 - 红色
        3: 'success'   // 完成 - 绿色
      };
      return statusMap[status] || 'info';
    }},
  async created() {
    // 初始化用户ID
    try {
      await this.getCurrentUserId();
    } catch (error) {
      console.error('初始化用户ID失败');
    }
    
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