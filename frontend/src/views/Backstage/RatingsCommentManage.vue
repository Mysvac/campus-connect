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
  methods: {
    // 获取评分评论列表
    fetchScoreComments() {
      this.isLoading = true;
      // 这里替换为实际的API调用
      // this.$axios.get('/api/score-comments').then(response => {
      //   this.scoreCommentData = response.data.map(item => ({...item, isEditing: false}));
      //   this.isLoading = false;
      // }).catch(error => {
      //   console.error('获取评分评论列表失败:', error);
      //   this.isLoading = false;
      //   ElMessage.error('获取评分评论列表失败');
      // });

      // 模拟数据
      setTimeout(() => {
        this.scoreCommentData = [
          { sid: 101, uid: 201, score: 5, comment: '服务非常好，很满意这次帮助', time: Date.now() - 36000000, isEditing: false },
          { sid: 101, uid: 202, score: 4, comment: '整体满意，但时间有点长', time: Date.now() - 46800000, isEditing: false },
          { sid: 102, uid: 203, score: 5, comment: '解答非常及时，问题解决得很好', time: Date.now() - 57600000, isEditing: false },
          { sid: 102, uid: 204, score: 3, comment: '基本满足需求，但解释不够详细', time: Date.now() - 68400000, isEditing: false },
          { sid: 103, uid: 205, score: 4, comment: '态度非常好，知识点掌握得不错', time: Date.now() - 79200000, isEditing: false },
          { sid: 104, uid: 206, score: 5, comment: '材料清晰实用，非常感谢分享', time: Date.now() - 90000000, isEditing: false },
          { sid: 105, uid: 207, score: 2, comment: '回应时间太长，且说明不够清楚', time: Date.now() - 100800000, isEditing: false },
          { sid: 105, uid: 208, score: 5, comment: '很专业，解决了我的所有问题', time: Date.now() - 111600000, isEditing: false }
        ];
        this.isLoading = false;
      }, 500);
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
    },

    // 提交新评分评论
    submitNewScoreComment() {
      if (this.$refs.scoreCommentForm) {
        this.$refs.scoreCommentForm.validate(valid => {
          if (valid) {
            this.newScoreComment.time = Date.now();

            // 这里替换为实际的API调用
            // this.$axios.post('/api/score-comments', this.newScoreComment).then(response => {
            //   ElMessage.success('添加评分评论成功');
            //   this.fetchScoreComments();
            //   this.dialogVisible = false;
            // }).catch(error => {
            //   console.error('添加评分评论失败:', error);
            //   ElMessage.error('添加评分评论失败');
            // });

            // 模拟添加
            const newScoreComment = {
              ...this.newScoreComment,
              isEditing: false
            };
            this.scoreCommentData.unshift(newScoreComment);
            ElMessage.success('添加评分评论成功');
            this.dialogVisible = false;
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
    },

    // 保存行
    saveRow(row) {
      // 这里替换为实际的API调用
      // this.$axios.put(`/api/score-comments/${row.sid}/${row.uid}`, row).then(response => {
      //   row.isEditing = false;
      //   ElMessage.success('更新评分评论成功');
      // }).catch(error => {
      //   console.error('更新评分评论失败:', error);
      //   ElMessage.error('更新评分评论失败');
      // });

      // 模拟保存
      row.isEditing = false;
      ElMessage.success('更新评分评论成功');
    },

    // 删除行
    deleteRow(row) {
      // 弹出确认框
      this.$confirm('此操作将永久删除该评分评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里替换为实际的API调用
        // this.$axios.delete(`/api/score-comments/${row.sid}/${row.uid}`).then(response => {
        //   const index = this.scoreCommentData.findIndex(item => item.sid === row.sid && item.uid === row.uid);
        //   if (index !== -1) {
        //     this.scoreCommentData.splice(index, 1);
        //   }
        //   ElMessage.success('删除评分评论成功');
        // }).catch(error => {
        //   console.error('删除评分评论失败:', error);
        //   ElMessage.error('删除评分评论失败');
        // });

        // 模拟删除
        const index = this.scoreCommentData.findIndex(item => item.sid === row.sid && item.uid === row.uid);
        if (index !== -1) {
          this.scoreCommentData.splice(index, 1);
        }
        ElMessage.success('删除评分评论成功');
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