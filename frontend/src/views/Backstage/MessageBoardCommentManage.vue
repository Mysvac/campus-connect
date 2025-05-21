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
  methods: {
    // 获取评论列表
    fetchComments() {
      this.isLoading = true;
      // 这里替换为实际的API调用
      // this.$axios.get('/api/comments').then(response => {
      //   this.commentData = response.data.map(item => ({...item, isEditing: false}));
      //   this.isLoading = false;
      // }).catch(error => {
      //   console.error('获取评论列表失败:', error);
      //   this.isLoading = false;
      //   ElMessage.error('获取评论列表失败');
      // });

      // 模拟数据
      setTimeout(() => {
        this.commentData = [
          { cid: 1, mid: 1, uid: 201, content: '这个资料太有用了，谢谢分享！', praise: 5, time: Date.now() - 36000000, isEditing: false },
          { cid: 2, mid: 1, uid: 202, content: '请问能发一份到我邮箱吗？', praise: 2, time: Date.now() - 46800000, isEditing: false },
          { cid: 3, mid: 2, uid: 203, content: '我很期待这次活动，一定会去的！', praise: 7, time: Date.now() - 57600000, isEditing: false },
          { cid: 4, mid: 2, uid: 204, content: '请问需要提前报名吗？', praise: 3, time: Date.now() - 68400000, isEditing: false },
          { cid: 5, mid: 3, uid: 205, content: '我好像在食堂看到了一张学生卡，等我确认一下是不是你的。', praise: 6, time: Date.now() - 79200000, isEditing: false },
          { cid: 6, mid: 4, uid: 206, content: '自行车还在吗？可以私聊一下价格吗？', praise: 1, time: Date.now() - 90000000, isEditing: false },
          { cid: 7, mid: 5, uid: 207, content: '我想加入学习小组，请问有具体的时间安排吗？', praise: 4, time: Date.now() - 100800000, isEditing: false },
          { cid: 8, mid: 5, uid: 208, content: '我是Python老手，可以来帮忙指导大家。', praise: 9, time: Date.now() - 111600000, isEditing: false }
        ];
        this.isLoading = false;
      }, 500);
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
    },

    // 提交新评论
    submitNewComment() {
      if (this.$refs.commentForm) {
        this.$refs.commentForm.validate(valid => {
          if (valid) {
            this.newComment.time = Date.now();

            // 这里替换为实际的API调用
            // this.$axios.post('/api/comments', this.newComment).then(response => {
            //   ElMessage.success('添加评论成功');
            //   this.fetchComments();
            //   this.dialogVisible = false;
            // }).catch(error => {
            //   console.error('添加评论失败:', error);
            //   ElMessage.error('添加评论失败');
            // });

            // 模拟添加
            const maxId = Math.max(...this.commentData.map(item => item.cid), 0);
            const newComment = {
              ...this.newComment,
              cid: maxId + 1,
              isEditing: false
            };
            this.commentData.unshift(newComment);
            ElMessage.success('添加评论成功');
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
      this.commentData.forEach(item => {
        if (item.cid !== row.cid) {
          item.isEditing = false;
        }
      });
      // 设置当前行为编辑状态
      row.isEditing = true;
    },

    // 保存行
    saveRow(row) {
      // 这里替换为实际的API调用
      // this.$axios.put(`/api/comments/${row.cid}`, row).then(response => {
      //   row.isEditing = false;
      //   ElMessage.success('更新评论成功');
      // }).catch(error => {
      //   console.error('更新评论失败:', error);
      //   ElMessage.error('更新评论失败');
      // });

      // 模拟保存
      row.isEditing = false;
      ElMessage.success('更新评论成功');
    },

    // 删除行
    deleteRow(row) {
      // 弹出确认框
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里替换为实际的API调用
        // this.$axios.delete(`/api/comments/${row.cid}`).then(response => {
        //   const index = this.commentData.findIndex(item => item.cid === row.cid);
        //   if (index !== -1) {
        //     this.commentData.splice(index, 1);
        //   }
        //   ElMessage.success('删除评论成功');
        // }).catch(error => {
        //   console.error('删除评论失败:', error);
        //   ElMessage.error('删除评论失败');
        // });

        // 模拟删除
        const index = this.commentData.findIndex(item => item.cid === row.cid);
        if (index !== -1) {
          this.commentData.splice(index, 1);
        }
        ElMessage.success('删除评论成功');
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