<template>
  <div>
    <!-- 筛选条件和增加按钮容器 -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <!-- 筛选条件 -->
      <div style="display: flex; gap: 10px; align-items: center;">
        <el-select v-model="selectedStatus" placeholder="按状态筛选" clearable size="small">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value"></el-option>
        </el-select>
      </div>
      <!-- 增加按钮，使用 flex-end 来让按钮右对齐 -->
      <el-button type="primary" @click="showAddDialog" size="small" style="margin-left: auto;">分配新任务</el-button>
    </div>

    <!-- 任务处理信息列表 -->
    <el-table :data="paginatedTaskData" style="width: 100%" stripe v-loading="isLoading">
      <el-table-column label="任务编号" prop="tid" width="100">
        <template #default="{ row }">
          <span>{{ row.tid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="接受人" prop="uid" width="100">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model.number="row.uid"
              size="small"
              placeholder="请输入接受人ID"
          ></el-input>
          <span v-else>{{ row.uid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" prop="status" width="120">
        <template #default="{ row }">
          <el-select
              v-if="row.isEditing"
              v-model="row.status"
              size="small"
              placeholder="请选择状态"
          >
            <el-option
                v-for="status in statusOptions"
                :key="status.value"
                :label="status.label"
                :value="status.value">
            </el-option>
          </el-select>
          <el-tag
              v-else
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
    <el-dialog title="分配新任务" v-model="dialogVisible" width="40%">
      <el-form :model="newTask" label-width="100px" :rules="rules" ref="taskForm">
        <el-form-item label="任务编号" prop="tid">
          <el-input v-model.number="newTask.tid" type="number" placeholder="请输入任务编号"></el-input>
        </el-form-item>
        <el-form-item label="接受人" prop="uid">
          <el-input v-model.number="newTask.uid" type="number" placeholder="请输入接受人ID"></el-input>
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
import { adminApi } from '@/api';
import { baseURL } from '@/api/index.js';

export default {
  name: "TaskProcessingManagement",
  data() {
    return {
      selectedStatus: "",
      taskData: [],
      isLoading: false,
      dialogVisible: false,
      newTask: {
        tid: '',
        uid: '',
        status: 0,
        notes: '',
        time: null
      },
      currentPage: 1,
      pageSize: 7,      statusOptions: [
        { value: 0, label: '待同意' },
        { value: 1, label: '进行中' },
        { value: 2, label: '终止' },
        { value: 3, label: '完成' }
      ],
      rules: {
        tid: [
          { required: true, message: '请输入任务编号', trigger: 'blur' },
          { type: 'number', message: '任务编号必须为数字', trigger: 'blur' }
        ],
        uid: [
          { required: true, message: '请输入接受人ID', trigger: 'blur' },
          { type: 'number', message: '接受人ID必须为数字', trigger: 'blur' }
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
      if (this.selectedStatus === "") {
        return this.taskData;
      }
      return this.taskData.filter(item => item.status === this.selectedStatus);
    },
    paginatedTaskData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredTaskData.slice(start, end);
    },
  },
  methods: {    // 获取任务处理列表
    fetchTasks() {
      this.isLoading = true;
      // 使用adminApi获取所有任务状态
      adminApi.getAllTasksStatus()
        .then(response => {
          console.log('获取任务状态数据成功:', response);
          if (response.data && response.data.code === 1) {
            // 处理成功的响应
            this.taskData = response.data.data.map(item => ({...item, isEditing: false}));
          } else {
            // 处理错误响应
            console.error('获取任务状态数据失败:', response.data?.msg || '未知错误');
            ElMessage.error('获取任务状态列表失败: ' + (response.data?.msg || '未知错误'));
            
            this.taskData = [];
          }
        })
        .catch(error => {
          console.error('获取任务状态列表接口调用出错:', error);
          ElMessage.error('获取任务状态列表失败，请稍后重试');
          this.taskData = [];
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    // 显示添加对话框
    showAddDialog() {
      this.dialogVisible = true;
      this.newTask = {
        tid: '',
        uid: '',
        status: 0,
        notes: '',
        time: null
      };
      // 如果有表单引用，重置验证
      if (this.$refs.taskForm) {
        this.$refs.taskForm.resetFields();
      }
    },    // 提交新任务处理
    submitNewTask() {
      if (this.$refs.taskForm) {
        this.$refs.taskForm.validate(valid => {
          if (valid) {
            this.newTask.time = Date.now();
            this.isLoading = true;
            
            // 使用adminApi分配任务
            adminApi.assignTask(this.newTask)
              .then(response => {
                if (response.data && response.data.code === 1) {
                  ElMessage.success('分配任务成功');
                  this.fetchTasks(); // 重新获取任务列表
                  this.dialogVisible = false;
                } else {
                  ElMessage.error('分配任务失败: ' + (response.data?.msg || '未知错误'));
                }
              })
              .catch(error => {
                console.error('分配任务失败:', error);
                ElMessage.error('分配任务失败，请稍后重试');
              })
              .finally(() => {
                this.isLoading = false;
              });
          } else {
            return false;
          }
        });
      }
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
    },    // 保存行
    saveRow(row) {
      this.isLoading = true;
      // 使用adminApi更新任务状态
      adminApi.updateTaskStatus(row)
        .then(response => {
          if (response.data && response.data.code === 1) {
            row.isEditing = false;
            delete row._originalData; // 删除原始数据
            ElMessage.success('更新任务处理成功');
          } else {
            ElMessage.error('更新任务处理失败: ' + (response.data?.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('更新任务处理失败:', error);
          ElMessage.error('更新任务处理失败，请稍后重试');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },    // 删除行
    deleteRow(row) {
      // 弹出确认框
      this.$confirm('此操作将永久删除该任务处理记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true;
        // 使用adminApi删除任务状态记录
        adminApi.deleteTaskStatus(row.tid, row.uid)
          .then(response => {
            if (response.data && response.data.code === 1) {
              const index = this.taskData.findIndex(item => item.tid === row.tid && item.uid === row.uid);
              if (index !== -1) {
                this.taskData.splice(index, 1);
              }
              ElMessage.success('删除任务处理成功');
            } else {
              ElMessage.error('删除任务处理失败: ' + (response.data?.msg || '未知错误'));
            }
          })
          .catch(error => {
            console.error('删除任务处理失败:', error);
            ElMessage.error('删除任务处理失败，请稍后重试');
          })
          .finally(() => {
            this.isLoading = false;
          });
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
    },    // 根据状态获取对应的类型样式
    getStatusType(status) {
      const statusMap = {
        0: 'warning',  // 待同意 - 黄色
        1: 'info',     // 进行中 - 蓝色
        2: 'danger',   // 终止 - 红色
        3: 'success'   // 完成 - 绿色
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