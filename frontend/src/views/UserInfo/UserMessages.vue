<template>
  <div>
    <!-- 过滤器区域 -->
    <div class="filter-container" style="margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 15px;">
        <span style="font-weight: bold;">筛选条件：</span>
        <el-select
            v-model="selectedTag"
            placeholder="选择标签"
            clearable
            style="width: 150px;"
            @change="handleTagChange"
        >
          <el-option
              v-for="tag in tagOptions"
              :key="tag.value"
              :label="tag.label"
              :value="tag.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="refreshData" :loading="isLoading">
          刷新数据
        </el-button>
        <span class="message-count">
          共 {{ filteredMessageData.length }} 条留言
        </span>
      </div>
    </div>

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
      </el-table-column>      <el-table-column label="操作" width="200">
        <template #default="scope">
          <div v-if="!scope.row.isEditing" style="display: flex; gap: 5px;">
            <el-button
                type="warning"
                size="small"
                @click="editRow(scope.row)"
            >
              编辑
            </el-button>
            <el-button
                type="danger"
                size="small"
                @click="deleteRow(scope.row)"
            >
              删除
            </el-button>
          </div>
          <div v-else style="display: flex; gap: 5px; flex-wrap: wrap;">
            <el-button
                type="success"
                size="small"
                @click="saveRow(scope.row)"
            >
              保存
            </el-button>
            <el-button
                type="info"
                size="small"
                @click="cancelEdit(scope.row)"
            >
              取消
            </el-button>
          </div>
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
import messageApi from '@/api/messageApi';

export default {
  name: "MessageManagement",
  data() {
    return {
      selectedTag: "",
      messageData: [],
      isLoading: false,
      currentUserId: null, // 当前登录用户ID，从登录状态获取
      currentPage: 1,
      pageSize: 7,
      tagOptions: []
    };
  },  computed: {
    filteredMessageData() {
      // 由于我们已经从API获取的是当前用户的留言，所以不需要再按用户ID过滤
      // 只需要按标签过滤即可
      let result = this.messageData;
      if (this.selectedTag) {
        result = result.filter(item => item.tag === this.selectedTag);
      }
      return result;
    },
    paginatedMessageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredMessageData.slice(start, end);
    },  },
  methods: {    // 获取当前用户ID
    async getCurrentUserId() {
      try {
        // 优先从 store 获取用户信息（如果有 Vuex）
        if (this.$store && this.$store.getters && this.$store.getters.currentUser) {
          const user = this.$store.getters.currentUser;
          this.currentUserId = user.uid;
          return;
        }

        // 从 localStorage 获取用户信息
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const user = JSON.parse(currentUser);
          this.currentUserId = user.uid;
          return;
        }

        // 从 sessionStorage 获取用户信息
        const userInfo = sessionStorage.getItem('userInfo');
        if (userInfo) {
          const user = JSON.parse(userInfo);
          this.currentUserId = user.uid;
          return;
        }

        // 如果都没有，可以调用用户信息API获取
        console.warn('无法获取用户ID，请重新登录');
        ElMessage.warning('请重新登录');
        // 可以跳转到登录页面
        // this.$router.push('/login');
      } catch (error) {
        console.error('获取用户ID失败:', error);
        ElMessage.error('获取用户信息失败，请重新登录');
      }
    },// 获取留言列表 - 使用新的API获取当前用户的留言
    async fetchMessages() {
      if (!this.currentUserId) {
        console.warn('用户ID不存在，无法获取留言列表');
        return;
      }

      this.isLoading = true;
      try {
        // 使用新的API获取指定用户的留言
        const response = await messageApi.getMessagesByUid(this.currentUserId);
        if (response.data && response.data.code === 1) {
          this.messageData = response.data.data.map(item => ({
            ...item,
            isEditing: false
          }));
        } else {
          console.error('获取留言列表失败:', response.data.msg);
          ElMessage.error('获取留言列表失败: ' + (response.data.msg || '未知错误'));
          this.messageData = [];
        }
      } catch (error) {
        console.error('获取留言列表失败:', error);
        ElMessage.error('获取留言列表失败');
        this.messageData = [];
      } finally {
        this.isLoading = false;
      }
    },

    // 编辑行
    editRow(row) {
      this.messageData.forEach(item => {
        if (item.mid !== row.mid) {
          item.isEditing = false;
        }
      });
      row.isEditing = true;    },    // 保存行
    async saveRow(row) {
      try {
        // 验证数据
        if (!row.title || !row.content) {
          ElMessage.error('标题和内容不能为空');
          return;
        }

        // 调用新的update-message接口，传递所有数据实现更新
        const response = await messageApi.updateMessage({
          mid: row.mid,        // 传递留言ID
          title: row.title,    // 新标题
          content: row.content, // 新内容
          tag: row.tag         // 新标签
        });
        
        if (response.data && response.data.code === 1) {
          ElMessage.success('留言更新成功');
          row.isEditing = false;
          // 重新获取数据以确保显示最新内容
          await this.fetchMessages();
        } else {
          ElMessage.error('更新留言失败: ' + (response.data?.msg || '未知错误'));
        }
      } catch (error) {
        console.error('更新留言失败:', error);
        ElMessage.error('更新留言失败');
      }
    },

    // 取消编辑
    cancelEdit(row) {
      row.isEditing = false;
      // 重新获取数据以恢复原始内容
      this.fetchMessages();
    },

    // 删除行
    async deleteRow(row) {
      this.$confirm('此操作将永久删除该留言, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await messageApi.deleteMessage(row.mid);
          if (response.data && response.data.code === 1) {
            const index = this.messageData.findIndex(item => item.mid === row.mid);
            if (index !== -1) {
              this.messageData.splice(index, 1);
            }
            ElMessage.success('删除留言成功');
          } else {
            ElMessage.error('删除留言失败: ' + (response.data.msg || '未知错误'));
          }
        } catch (error) {
          console.error('删除留言失败:', error);
          ElMessage.error('删除留言失败');
        }
      }).catch(() => {
        ElMessage.info('已取消删除');
      });
    },

    // 处理标签变化
    handleTagChange() {
      // 重置到第一页
      this.currentPage = 1;
    },

    // 刷新数据
    async refreshData() {
      await this.fetchMessages();
      this.currentPage = 1;
      ElMessage.success('数据刷新成功');
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
    },    // 获取标签列表
    setDefaultTags() {
      // 设置标准留言标签，与mockData中的实际标签保持一致
      this.tagOptions = [
        { value: '活动', label: '校园活动' },
        { value: '生活', label: '校园生活' },
        { value: '学习', label: '学习交流' },
        { value: '失物', label: '失物信息' },
        { value: '吐槽', label: '意见反馈' },
        { value: '课程互助', label: '课程互助' },
        { value: '失物招领', label: '失物招领' },
        { value: '二手交易', label: '二手交易' },
        { value: '学习讨论', label: '学习讨论' },
        { value: '校园问题', label: '校园问题' }
      ];
    },

    // 获取标签列表
    async fetchTags() {
      try {
        // 如果后端有标签API，可以在这里调用
        // const response = await messageApi.getMessageTags();
        // if (response.data && response.data.code === 1) {
        //   this.tagOptions = response.data.data.map(tag => ({
        //     value: tag.name,
        //     label: tag.name
        //   }));
        // } else {
        //   this.setDefaultTags();
        // }
        
        // 目前使用默认标签
        this.setDefaultTags();
      } catch (error) {
        console.error('获取标签列表失败:', error);
        this.setDefaultTags();
      }
    }
  },  async created() {
    await this.getCurrentUserId();
    await this.fetchTags();
    await this.fetchMessages();
  },
};
</script>



<style scoped>
.filter-container {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.message-count {
  color: #606266;
  font-size: 14px;
}

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

/* 表格行悬停效果优化 */
:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 编辑状态下的输入框样式 */
:deep(.el-table .el-input) {
  --el-input-border-radius: 4px;
}

:deep(.el-table .el-textarea) {
  --el-input-border-radius: 4px;
}
</style>

