<template>
  <div class="ratings-manage-container">
    <!-- 我的评分留言列表 -->
    <div class="table-container">
      <el-table :data="paginatedRatingData" style="width: 100%;" stripe v-loading="isLoading">
        <el-table-column label="评分编号" prop="sid" width="100">
          <template #default="{ row }">
            <span>{{ row.sid }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="评分对象" prop="scoreGoal" width="120">
          <template #default="{ row }">
            <span>{{ row.scoreGoal || '-' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="评分标签" prop="scoreTag" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.scoreTag" :type="getTagType(row.scoreTag)" size="small">{{ row.scoreTag }}</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        
        <el-table-column label="我的评分" prop="score" width="80">
          <template #default="{ row }">
            <el-rate
              v-model="row.score"
              :max="5"
              show-score
              disabled
              score-template="{value}"
            ></el-rate>
          </template>
        </el-table-column>
        
        <el-table-column label="我的评论" prop="comment" min-width="200">
          <template #default="{ row }">
            <el-tooltip
              v-if="row.comment"
              :content="row.comment"
              placement="top"
              :hide-after="0"
              :enterable="false"
              :disabled="row.comment.length < 50"
            >
              <span>{{ row.comment.length > 50 ? row.comment.substring(0, 50) + '...' : row.comment }}</span>
            </el-tooltip>
            <span v-else class="text-muted">无评论</span>
          </template>
        </el-table-column>
        
        <el-table-column label="评论时间" prop="time" width="180">
          <template #default="{ row }">
            <span>{{ formatTime(row.time) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewScoreDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-container" style="margin-top: 20px; display: flex; justify-content: center;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="ratingData.length"
      >
      </el-pagination>
    </div>

    <!-- 评分详情对话框 -->
    <el-dialog title="评分详情" v-model="detailDialogVisible" width="50%">
      <div v-if="selectedScore">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="评分编号">{{ selectedScore.sid }}</el-descriptions-item>
          <el-descriptions-item label="评分对象">{{ selectedScore.scoreGoal || '-' }}</el-descriptions-item>
          <el-descriptions-item label="标签">
            <el-tag v-if="selectedScore.scoreTag" :type="getTagType(selectedScore.scoreTag)" size="small">
              {{ selectedScore.scoreTag }}
            </el-tag>
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="我的评分">
            <el-rate
              v-model="selectedScore.score"
              :max="5"
              show-score
              disabled
              score-template="{value} 分"
            ></el-rate>
          </el-descriptions-item>
          <el-descriptions-item label="评论时间" :span="2">{{ formatTime(selectedScore.time) }}</el-descriptions-item>
          <el-descriptions-item label="我的评论" :span="2">
            <div style="max-height: 200px; overflow-y: auto;">
              {{ selectedScore.comment || '无评论' }}
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
        <script>
import { ElMessage } from 'element-plus';
import api from '@/api';

export default {
  name: "MyRatingsComments",
  data() {
    return {
      ratingData: [],
      isLoading: false,
      detailDialogVisible: false,
      selectedScore: null,
      currentPage: 1,
      pageSize: 10,
      currentUserId: null, // 当前登录用户的ID，从登录信息中获取
    };
  },
  computed: {
    paginatedRatingData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.ratingData.slice(start, end);
    },
  },
  methods: {
    // 获取当前用户ID
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

    // 获取用户的评分留言列表
    async fetchRatingComments() {
      this.isLoading = true;
      
      // 如果没有用户ID，先获取当前用户信息
      if (!this.currentUserId) {
        try {
          await this.getCurrentUserId();
        } catch (error) {
          this.isLoading = false;
          return;
        }
      }

      try {
        console.log('[DEBUG] Fetching rating comments for user:', this.currentUserId);
        const response = await api.get(`/api/score/get-scores-comment-by-uid/${this.currentUserId}`);
        console.log('[DEBUG] Rating comments response:', response);
        
        if (response.data && response.data.code === 1) {
          const commentsData = response.data.data;
          console.log('[DEBUG] Got rating comments data:', commentsData);
          
          // 获取评论后，需要获取对应的评分信息来补充评分详情
          this.ratingData = await Promise.all(commentsData.map(async (item) => {
            try {
              const scoreResponse = await api.get(`/api/score/get-score-by-sid/${item.sid}`);
              let scoreGoal = '未知评分';
              let scoreTag = '';
              
              if (scoreResponse.data && scoreResponse.data.code === 1) {
                const scoreData = scoreResponse.data.data;
                scoreGoal = scoreData.goal;
                scoreTag = scoreData.tag;
              }
              
              return {
                ...item,
                scoreGoal: scoreGoal,
                scoreTag: scoreTag,
                time: item.time || Date.now()
              };
            } catch (error) {
              console.error(`获取评分${item.sid}详情失败:`, error);
              return {
                ...item,
                scoreGoal: '获取失败',
                scoreTag: '',
                time: item.time || Date.now()
              };
            }
          }));
          console.log('[DEBUG] Final rating comments data:', this.ratingData);
        } else {
          console.log('没有找到评分留言或获取失败:', response.data?.msg);
          this.ratingData = [];
        }
      } catch (error) {
        console.error('获取评分留言失败:', error);
        ElMessage.error('获取评分留言失败');
        this.ratingData = [];
      } finally {
        this.isLoading = false;
      }
    },

    // 查看评分详情
    viewScoreDetail(row) {
      this.selectedScore = row;
      this.detailDialogVisible = true;
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
      if (!timestamp) return '-';
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    },

    // 根据标签获取对应的类型样式
    getTagType(tag) {
      const tagMap = {
        '课程互助': 'success',
        '校园活动': 'warning',
        '失物招领': 'info',
        '二手交易': 'danger',
        '学习讨论': '',
        '校园问题': 'info'
      };
      return tagMap[tag] || '';
    }
  },
  async created() {
    // 初始化用户ID
    try {
      await this.getCurrentUserId();
    } catch (error) {
      console.error('初始化用户ID失败');
    }
    
    this.fetchRatingComments();
  },
};
</script>
      <style scoped>
.ratings-manage-container {
  padding: 20px;
}

.table-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-table {
  width: 100% !important;
  table-layout: fixed;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
}

.text-muted {
  color: #909399;
  font-style: italic;
}

.el-descriptions {
  margin-top: 20px;
}

.el-rate {
  line-height: 1;
}
</style>