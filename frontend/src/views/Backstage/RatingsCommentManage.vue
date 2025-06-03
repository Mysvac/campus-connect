<template>
  <div>
    <!-- 筛选条件和增加按钮容器 -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <!-- 筛选条件 -->
      <div style="display: flex; gap: 10px; align-items: center;">
        <el-input
            v-model="sidFilter"
            placeholder="按评分编号筛选"
            clearable
            size="small"
            style="width: 150px;"
            @clear="fetchScoreComments"
        ></el-input>
      </div>
      <!-- 增加按钮，使用 flex-end 来让按钮右对齐 -->
      <el-button type="primary" @click="showAddDialog" size="small" style="margin-left: auto;">增加评分评论</el-button>
    </div>

    <!-- 评分评论信息列表 -->
    <el-table :data="paginatedScoreCommentData" style="width: 100%" stripe v-loading="isLoading">
      <el-table-column label="评分编号" prop="sid" width="100">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model.number="row.sid"
              size="small"
              placeholder="请输入评分编号"
          ></el-input>
          <span v-else>{{ row.sid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="发布人" prop="uid" width="100">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model.number="row.uid"
              size="small"
              placeholder="请输入用户ID"
          ></el-input>
          <span v-else>{{ row.uid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="分数" prop="score" width="100">
        <template #default="{ row }">
          <el-rate
              v-if="row.isEditing"
              v-model="row.score"
              :max="5"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          ></el-rate>
          <el-rate
              v-else
              v-model="row.score"
              disabled
              :max="5"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          ></el-rate>
        </template>
      </el-table-column>

      <el-table-column label="留言" prop="comment">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model="row.comment"
              type="textarea"
              size="small"
              placeholder="请输入留言"
          ></el-input>
          <span v-else>{{ row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column label="时间" prop="time" width="180">
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
          :total="filteredScoreCommentData.length"
      >
      </el-pagination>
    </div>

    <!-- 添加评分评论对话框 -->
    <el-dialog title="添加新评分评论" v-model="dialogVisible" width="40%">
      <el-form :model="newScoreComment" label-width="100px" :rules="rules" ref="scoreCommentForm">
        <el-form-item label="评分编号" prop="sid">
          <el-input v-model.number="newScoreComment.sid" type="number" placeholder="请输入评分编号"></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="uid">
          <el-input v-model.number="newScoreComment.uid" type="number" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-rate
              v-model="newScoreComment.score"
              :max="5"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          ></el-rate>
        </el-form-item>
        <el-form-item label="留言" prop="comment">
          <el-input v-model="newScoreComment.comment" type="textarea" :rows="4" placeholder="请输入留言内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitNewScoreComment">确定</el-button>
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
  name: "ScoreCommentManagement",
  data() {
    return {
      sidFilter: "",
      scoreCommentData: [],
      isLoading: false,
      dialogVisible: false,
      newScoreComment: {
        sid: '',
        uid: '',
        score: 3,
        comment: '',
        time: null
      },
      currentPage: 1,
      pageSize: 10,
      rules: {
        sid: [
          { required: true, message: '请输入评分编号', trigger: 'blur' },
          { type: 'number', message: '评分编号必须为数字', trigger: 'blur' }
        ],
        uid: [
          { required: true, message: '请输入发布人ID', trigger: 'blur' },
          { type: 'number', message: '发布人ID必须为数字', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请选择分数', trigger: 'change' },
          { type: 'number', min: 1, max: 5, message: '分数必须在1到5之间', trigger: 'change' }
        ],
        comment: [
          { required: true, message: '请输入留言内容', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    filteredScoreCommentData() {
      if (!this.sidFilter) {
        return this.scoreCommentData;
      }
      return this.scoreCommentData.filter(item => item.sid === parseInt(this.sidFilter));
    },
    paginatedScoreCommentData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredScoreCommentData.slice(start, end);
    },
  },
  methods: {    // 获取评分评论列表
    fetchScoreComments() {
      this.isLoading = true;
      
      // 使用adminApi获取所有评分评论
      let apiCall;
      
      if (this.sidFilter) {
        apiCall = adminApi.getRatingCommentsBySid(this.sidFilter);
      } else {
        apiCall = adminApi.getAllRatingComments();
      }
      
      apiCall
        .then(response => {
          console.log('获取评分评论数据成功:', response);
          if (response.data && response.data.code === 1) {
            // 处理成功的响应
            this.scoreCommentData = response.data.data.map(item => ({...item, isEditing: false}));
          } else {
            // 处理错误响应
            console.error('获取评分评论数据失败:', response.data?.msg || '未知错误');
            ElMessage.error('获取评分评论列表失败: ' + (response.data?.msg || '未知错误'));
            
            this.scoreCommentData = [];
          }
        })
        .catch(error => {
          console.error('获取评分评论列表接口调用出错:', error);
          ElMessage.error('获取评分评论列表失败，请稍后重试');
          this.scoreCommentData = [];
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    // 显示添加对话框
    showAddDialog() {
      this.dialogVisible = true;
      this.newScoreComment = {
        sid: '',
        uid: '',
        score: 3,
        comment: '',
        time: null
      };
      // 如果有表单引用，重置验证
      if (this.$refs.scoreCommentForm) {
        this.$refs.scoreCommentForm.resetFields();
      }
    },    // 提交新评分评论
    submitNewScoreComment() {
      if (this.$refs.scoreCommentForm) {
        this.$refs.scoreCommentForm.validate(valid => {
          if (valid) {
            this.newScoreComment.time = Date.now();
            this.isLoading = true;
            
            // 转换为API字段格式
            const apiData = {
              sid: this.newScoreComment.sid,
              uid: this.newScoreComment.uid,
              content: this.newScoreComment.comment,
              score: this.newScoreComment.score,
              time: this.newScoreComment.time
            };
            
            // 使用adminApi创建评分评论
            adminApi.createRatingComment(apiData)
              .then(response => {
                if (response.data && response.data.code === 1) {
                  ElMessage.success('添加评分评论成功');
                  this.fetchScoreComments(); // 重新获取评论列表
                  this.dialogVisible = false;
                } else {
                  ElMessage.error('添加评分评论失败: ' + (response.data?.msg || '未知错误'));
                }
              })
              .catch(error => {
                console.error('添加评分评论失败:', error);
                ElMessage.error('添加评分评论失败，请稍后重试');
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
      this.scoreCommentData.forEach(item => {
        if (item.sid !== row.sid || item.uid !== row.uid) {
          item.isEditing = false;
        }
      });
      // 设置当前行为编辑状态
      row.isEditing = true;
    },    // 保存行
    saveRow(row) {
      this.isLoading = true;
      
      // 转换为API字段格式
      const apiData = {
        cid: row.cid || 0, // 评论ID
        sid: row.sid,
        uid: row.uid,
        content: row.comment,
        score: row.score,
        time: row.time
      };
      
      // 使用adminApi更新评分评论
      adminApi.updateRatingComment(apiData)
        .then(response => {
          if (response.data && response.data.code === 1) {
            row.isEditing = false;
            delete row._originalData; // 删除原始数据
            ElMessage.success('更新评分评论成功');
          } else {
            ElMessage.error('更新评分评论失败: ' + (response.data?.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('更新评分评论失败:', error);
          ElMessage.error('更新评分评论失败，请稍后重试');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },    // 删除行
    deleteRow(row) {
      // 弹出确认框
      this.$confirm('此操作将永久删除该评分评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true;
        // 使用adminApi删除评分评论
        adminApi.deleteRatingComment(row.cid)
          .then(response => {
            if (response.data && response.data.code === 1) {
              const index = this.scoreCommentData.findIndex(item => item.cid === row.cid);
              if (index !== -1) {
                this.scoreCommentData.splice(index, 1);
              }
              ElMessage.success('删除评分评论成功');
            } else {
              ElMessage.error('删除评分评论失败: ' + (response.data?.msg || '未知错误'));
            }
          })
          .catch(error => {
            console.error('删除评分评论失败:', error);
            ElMessage.error('删除评分评论失败，请稍后重试');
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
    }
  },
  created() {
    this.fetchScoreComments();
  },
};
</script>

<style scoped>
.el-table {
  width: 100%;
}

.el-input {
  width: 100%;
}

.el-button {
  height: 36px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>