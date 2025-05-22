<template>
  <div>
    <!-- 任务处理信息列表 -->
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

      <el-table-column label="状态" prop="status" width="120">
        <template #default="{ row }">
          <el-tag
            :type="getStatusType(row.status)"
            size="small"
          >
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="备注" prop="notes">
        <template #default="{ row }">
          <el-input
            v-if="row.isEditing"
            v-model="row.notes"
            type="textarea"
            size="small"
            placeholder="请输入备注"
            maxlength="100"
            show-word-limit
          ></el-input>
          <span v-else>{{ row.notes }}</span>
        </template>
      </el-table-column>

      <el-table-column label="处理时间" prop="time" width="180">
        <template #default="{ row }">
          <span>{{ formatTime(row.time) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button
            type="warning"
            size="small"
            @click="editRow(scope.row)"
            v-if="!scope.row.isEditing"
          >
            编辑
          </el-button>
          <el-button
            type="success"
            size="small"
            @click="saveRow(scope.row)"
            v-if="scope.row.isEditing"
          >
            保存
          </el-button>
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

    <!-- 添加任务处理记录对话框 -->
    <el-dialog title="接受新任务" v-model="dialogVisible" width="40%">
      <el-form :model="newTask" label-width="100px" :rules="rules" ref="taskForm">
        <el-form-item label="任务编号" prop="tid">
          <el-input v-model.number="newTask.tid" type="number" placeholder="请输入任务编号"></el-input>
        </el-form-item>
        <el-form-item label="任务名" prop="taskName">
          <el-input v-model="newTask.taskName" placeholder="请输入任务名"></el-input>
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
        <el-form-item label="备注" prop="notes">
          <el-input v-model="newTask.notes" type="textarea" :rows="4" placeholder="请输入备注" maxlength="100" show-word-limit></el-input>
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
import { ElMessage } from 'element-plus';

export default {
  name: "TaskProcessingManagement",
  data() {
    return {
      selectedStatus: "",
      taskData: [],
      isLoading: false,
      dialogVisible: false,
      currentUserId: 101, // 当前登录用户的ID，实际使用时从登录信息中获取
      newTask: {
        tid: '',
        taskName: '',
        uid: '', // 将自动设置为当前用户ID
        status: 0,
        notes: '',
        time: null
      },
      currentPage: 1,
      pageSize: 7,
      statusOptions: [
        { value: 0, label: '进行中' },
        { value: 1, label: '完成' },
        { value: 2, label: '失败' }
      ],
      rules: {
        tid: [
          { required: true, message: '请输入任务编号', trigger: 'blur' },
          { type: 'number', message: '任务编号必须为数字', trigger: 'blur' }
        ],
        taskName: [
          { required: true, message: '请输入任务名', trigger: 'blur' },
          { max: 50, message: '任务名不能超过50个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        notes: [
          { max: 100, message: '备注长度不能超过100个字符', trigger: 'blur' }
        ]
      }
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
  methods: {
    // 获取任务处理列表
    fetchTasks() {
      this.isLoading = true;
      // 这里替换为实际的API调用，传入当前用户ID
      // this.$axios.get(`/api/tasks/processing?uid=${this.currentUserId}`).then(response => {
      //   this.taskData = response.data.map(item => ({...item, isEditing: false}));
      //   this.isLoading = false;
      // }).catch(error => {
      //   console.error('获取任务处理列表失败:', error);
      //   this.isLoading = false;
      //   ElMessage.error('获取任务处理列表失败');
      // });

      // 模拟数据 - 只显示当前用户接受的任务
      setTimeout(() => {
        this.taskData = [
          { tid: 1001, taskName: '高数资料整理', uid: 101, status: 0, notes: '正在收集资料，预计明天完成', time: Date.now() - 86400000, isEditing: false },
          { tid: 1002, taskName: '英语讲义翻译', uid: 102, status: 1, notes: '已完成资料整理并提交', time: Date.now() - 172800000, isEditing: false },
          { tid: 1003, taskName: '失物招领', uid: 101, status: 2, notes: '无法完成任务，原因：资源不足', time: Date.now() - 259200000, isEditing: false },
          { tid: 1004, taskName: '二手书收集', uid: 104, status: 0, notes: '正在进行中，预计周五前完成', time: Date.now() - 345600000, isEditing: false },
          { tid: 1005, taskName: 'Python答疑', uid: 101, status: 1, notes: '任务已按要求完成', time: Date.now() - 432000000, isEditing: false }
        ];
        this.isLoading = false;
      }, 500);
    },

    // 编辑行
    editRow(row) {
      // 先关闭其他正在编辑的行
      this.taskData.forEach(item => {
        if (item.tid !== row.tid || item.uid !== row.uid) {
          item.isEditing = false;
        }
      });
      // 设置当前行为编辑状态
      row.isEditing = true;
    },

    // 保存行
    saveRow(row) {
      // 这里只允许编辑备注
      row.isEditing = false;
      ElMessage.success('更新任务处理成功');
    },

    // 删除行
    deleteRow(row) {
      // 弹出确认框
      this.$confirm('此操作将永久删除该任务处理记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟删除
        const index = this.taskData.findIndex(item => item.tid === row.tid && item.uid === row.uid);
        if (index !== -1) {
          this.taskData.splice(index, 1);
        }
        ElMessage.success('删除任务处理成功');
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

    // 获取状态标签
    getStatusLabel(status) {
      const statusObj = this.statusOptions.find(item => item.value === status);
      return statusObj ? statusObj.label : '未知状态';
    },

    // 根据状态获取对应的类型样式
    getStatusType(status) {
      const statusMap = {
        0: 'warning',  // 进行中
        1: 'success',  // 完成
        2: 'danger'    // 失败
      };
      return statusMap[status] || 'info';
    }
  },
  created() {
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