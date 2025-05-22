<template>
  <div>

    <!-- 留言信息列表 -->
    <el-table :data="paginatedMessageData" style="width: 100%" stripe v-loading="isLoading">
      <el-table-column label="留言编号" prop="mid" width="100">
        <template #default="{ row }">
          <span>{{ row.mid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="发布人ID" prop="uid" width="100">
        <template #default="{ row }">
          <span>{{ row.uid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题" prop="title" width="150">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model="row.title"
              size="small"
              placeholder="请输入标题"
          ></el-input>
          <span v-else>{{ row.title }}</span>
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
          <span>{{ row.praise }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标签" prop="tag" width="100">
        <template #default="{ row }">
          <el-select
              v-if="row.isEditing"
              v-model="row.tag"
              size="small"
              placeholder="请选择标签"
          >
            <el-option
                v-for="tag in tagOptions"
                :key="tag.value"
                :label="tag.label"
                :value="tag.value">
            </el-option>
          </el-select>
          <el-tag
              v-else
              :type="getTagType(row.tag)"
              size="small"
          >
            {{ row.tag }}
          </el-tag>
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
          :total="filteredMessageData.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  name: "MessageManagement",
  data() {
    return {
      selectedTag: "",
      messageData: [],
      isLoading: false,
      currentUserId: 101, // 假设当前登录用户ID，实际应从登录状态获取
      currentPage: 1,
      pageSize: 7,
      tagOptions: []
    };
  },
  computed: {
    filteredMessageData() {
      // 只显示当前登录者id发的留言
      let result = this.messageData.filter(item => item.uid === this.currentUserId);
      if (this.selectedTag) {
        result = result.filter(item => item.tag === this.selectedTag);
      }
      return result;
    },
    paginatedMessageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredMessageData.slice(start, end);
    },
  },
  methods: {
    // 获取留言列表
    fetchMessages() {
      this.isLoading = true;
      // 这里替换为实际的API调用
      // this.$axios.get('/api/messages').then(response => {
      //   this.messageData = response.data.map(item => ({...item, isEditing: false}));
      //   this.isLoading = false;
      // }).catch(error => {
      //   console.error('获取留言列表失败:', error);
      //   this.isLoading = false;
      //   ElMessage.error('获取留言列表失败');
      // });

      // 模拟数据
      setTimeout(() => {
        this.messageData = [
          { mid: 1, uid: 101, title: '高数复习资料分享', content: '有人需要高数期末复习资料吗？我整理了一份详细的复习提纲。', praise: 15, tag: '课程互助', time: Date.now() - 86400000, isEditing: false },
          { mid: 2, uid: 102, title: '校园歌手大赛', content: '下周六将在大礼堂举办校园歌手大赛，欢迎大家前来观看和参与！', praise: 28, tag: '校园活动', time: Date.now() - 172800000, isEditing: false },
          { mid: 3, uid: 101, title: '丢失学生卡', content: '今天在图书馆丢失了学生卡，有人捡到请联系我，谢谢！', praise: 3, tag: '失物招领', time: Date.now() - 259200000, isEditing: false },
          { mid: 4, uid: 104, title: '出售二手自行车', content: '有一辆九成新的自行车出售，价格可议，有需要的同学请联系我。', praise: 8, tag: '二手交易', time: Date.now() - 345600000, isEditing: false },
          { mid: 5, uid: 101, title: 'Python学习小组', content: '想找一些同学一起学习Python，每周末在教学楼301教室集合。', praise: 12, tag: '学习讨论', time: Date.now() - 432000000, isEditing: false }
        ];
        this.isLoading = false;
      }, 500);
    },

    // 编辑行
    editRow(row) {
      this.messageData.forEach(item => {
        if (item.mid !== row.mid) {
          item.isEditing = false;
        }
      });
      row.isEditing = true;
    },

    // 保存行
    saveRow(row) {
      row.isEditing = false;
      ElMessage.success('更新留言成功');
    },

    // 删除行
    deleteRow(row) {
      this.$confirm('此操作将永久删除该留言, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.messageData.findIndex(item => item.mid === row.mid);
        if (index !== -1) {
          this.messageData.splice(index, 1);
        }
        ElMessage.success('删除留言成功');
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
      const tagMap = {};
      this.tagOptions.forEach((item, index) => {
        const types = ['', 'success', 'warning', 'info', 'danger'];
        tagMap[item.value] = types[index % types.length];
      });
      return tagMap[tag] || '';
    },

    // 获取标签列表
    fetchTags() {
      setTimeout(() => {
        this.tagOptions = [
          { value: '课程互助', label: '课程互助' },
          { value: '校园活动', label: '校园活动' },
          { value: '失物招领', label: '失物招领' },
          { value: '二手交易', label: '二手交易' },
          { value: '学习讨论', label: '学习讨论' },
          { value: '校园问题', label: '校园问题' }
        ];
      }, 300);
    }
  },
  created() {
    this.fetchTags();
    this.fetchMessages();
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

