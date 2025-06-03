<template>
  <div>
    <!-- 筛选条件和增加按钮容器 -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <!-- 筛选条件 -->
      <div style="display: flex; gap: 10px; align-items: center;">
        <el-input
            v-model="midFilter"
            placeholder="按留言编号筛选"
            clearable
            size="small"
            style="width: 150px;"
            @clear="fetchComments"
        ></el-input>
      </div>
      <!-- 增加按钮，使用 flex-end 来让按钮右对齐 -->
      <el-button type="primary" @click="showAddDialog" size="small" style="margin-left: auto;">增加评论</el-button>
    </div>

    <!-- 评论信息列表 -->
    <el-table :data="paginatedCommentData" style="width: 100%" stripe v-loading="isLoading">
      <el-table-column label="评论编号" prop="cid" width="100">
        <template #default="{ row }">
          <span>{{ row.cid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="留言编号" prop="mid" width="100">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model.number="row.mid"
              size="small"
              placeholder="请输入留言编号"
          ></el-input>
          <span v-else>{{ row.mid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="评论人ID" prop="uid" width="100">
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

      <el-table-column label="内容" prop="content">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model="row.content"
              type="textarea"
              size="small"
              placeholder="请输入内容"
          ></el-input>
          <span v-else>{{ row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column label="点赞数" prop="praise" width="100">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model.number="row.praise"
              size="small"
              type="number"
              placeholder="点赞数"
          ></el-input>
          <span v-else>{{ row.praise }}</span>
        </template>
      </el-table-column>

      <el-table-column label="发布时间" prop="time" width="180">
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
          :total="filteredCommentData.length"
      >
      </el-pagination>
    </div>

    <!-- 添加评论对话框 -->
    <el-dialog title="添加新评论" v-model="dialogVisible" width="40%">
      <el-form :model="newComment" label-width="100px" :rules="rules" ref="commentForm">
        <el-form-item label="留言编号" prop="mid">
          <el-input v-model.number="newComment.mid" type="number" placeholder="请输入留言编号"></el-input>
        </el-form-item>
        <el-form-item label="评论人ID" prop="uid">
          <el-input v-model.number="newComment.uid" type="number" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="newComment.content" type="textarea" :rows="4" placeholder="请输入评论内容"></el-input>
        </el-form-item>
        <el-form-item label="点赞数" prop="praise">
          <el-input v-model.number="newComment.praise" type="number" placeholder="请输入点赞数"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitNewComment">确定</el-button>
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
  name: "CommentManagement",
  data() {
    return {
      midFilter: "",
      commentData: [],
      isLoading: false,
      dialogVisible: false,
      newComment: {
        mid: '',
        uid: '',
        content: '',
        praise: 0,
        time: null
      },
      currentPage: 1,
      pageSize: 10,
      rules: {
        mid: [
          { required: true, message: '请输入留言编号', trigger: 'blur' },
          { type: 'number', message: '留言编号必须为数字', trigger: 'blur' }
        ],
        uid: [
          { required: true, message: '请输入评论人ID', trigger: 'blur' },
          { type: 'number', message: '评论人ID必须为数字', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' }
        ],
        praise: [
          { required: true, message: '请输入点赞数', trigger: 'blur' },
          { type: 'number', message: '点赞数必须为数字', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    filteredCommentData() {
      if (!this.midFilter) {
        return this.commentData;
      }
      return this.commentData.filter(item => item.mid === parseInt(this.midFilter));
    },
    paginatedCommentData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredCommentData.slice(start, end);
    },
  },
  methods: {    // 获取评论列表
    fetchComments() {
      this.isLoading = true;
        // 使用adminApi获取所有留言评论
      let apiCall;
      
      if (this.midFilter) {
        apiCall = adminApi.getMessageCommentsByMid(this.midFilter);
      } else {
        apiCall = adminApi.getAllMessageComments();
      }
      
      apiCall
        .then(response => {
          console.log('获取留言评论数据成功:', response);
          if (response.data && response.data.code === 1) {
            // 处理成功的响应
            this.commentData = response.data.data.map(item => ({...item, isEditing: false}));
          } else {
            // 处理错误响应
            console.error('获取留言评论数据失败:', response.data?.msg || '未知错误');
            ElMessage.error('获取留言评论列表失败: ' + (response.data?.msg || '未知错误'));
            
            this.commentData = [];
          }
        })
        .catch(error => {
          console.error('获取留言评论列表接口调用出错:', error);
          ElMessage.error('获取留言评论列表失败，请稍后重试');
          this.commentData = [];
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    // 显示添加对话框
    showAddDialog() {
      this.dialogVisible = true;
      this.newComment = {
        mid: '',
        uid: '',
        content: '',
        praise: 0,
        time: null
      };
      // 如果有表单引用，重置验证
      if (this.$refs.commentForm) {
        this.$refs.commentForm.resetFields();
      }
    },    // 提交新评论
    submitNewComment() {
      if (this.$refs.commentForm) {
        this.$refs.commentForm.validate(valid => {
          if (valid) {
            this.newComment.time = Date.now();
            this.isLoading = true;
            
            // 使用adminApi创建留言评论
            adminApi.createMessageComment(this.newComment)
              .then(response => {
                if (response.data && response.data.code === 1) {
                  ElMessage.success('添加评论成功');
                  this.fetchComments(); // 重新获取评论列表
                  this.dialogVisible = false;
                } else {
                  ElMessage.error('添加评论失败: ' + (response.data?.msg || '未知错误'));
                }
              })
              .catch(error => {
                console.error('添加评论失败:', error);
                ElMessage.error('添加评论失败，请稍后重试');
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
      this.commentData.forEach(item => {
        if (item.cid !== row.cid) {
          item.isEditing = false;
        }
      });
      // 设置当前行为编辑状态
      row.isEditing = true;
    },    // 保存行
    saveRow(row) {
      this.isLoading = true;
      // 使用adminApi更新留言评论
      adminApi.updateMessageComment(row)
        .then(response => {
          if (response.data && response.data.code === 1) {
            row.isEditing = false;
            delete row._originalData; // 删除原始数据
            ElMessage.success('更新评论成功');
          } else {
            ElMessage.error('更新评论失败: ' + (response.data?.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('更新评论失败:', error);
          ElMessage.error('更新评论失败，请稍后重试');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },    // 删除行
    deleteRow(row) {
      // 弹出确认框
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true;
        // 使用adminApi删除留言评论
        adminApi.deleteMessageComment(row.cid)
          .then(response => {
            if (response.data && response.data.code === 1) {
              const index = this.commentData.findIndex(item => item.cid === row.cid);
              if (index !== -1) {
                this.commentData.splice(index, 1);
              }
              ElMessage.success('删除评论成功');
            } else {
              ElMessage.error('删除评论失败: ' + (response.data?.msg || '未知错误'));
            }
          })
          .catch(error => {
            console.error('删除评论失败:', error);
            ElMessage.error('删除评论失败，请稍后重试');
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
    this.fetchComments();
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