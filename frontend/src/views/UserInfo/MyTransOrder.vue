<template>
  <div class="my-orders-container">
    <!-- 页面标题和操作按钮 -->
    <div class="header-section">
      <h3>我的购买订单</h3>
      <div class="actions">
        <el-button @click="fetchOrders" :loading="isLoading" size="small" icon="Refresh">
          刷新
        </el-button>
        <el-select
          v-model="statusFilter"
          placeholder="筛选状态"
          clearable
          size="small"
          style="width: 120px; margin-left: 10px;"
        >
          <el-option label="进行中" :value="0"></el-option>
          <el-option label="已中止" :value="1"></el-option>
          <el-option label="售后中" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
        </el-select>
      </div>
    </div>

    <!-- 订单信息列表 -->
    <el-table 
      :data="paginatedOrderData" 
      style="width: 100%" 
      stripe 
      v-loading="isLoading"
      empty-text="暂无订单数据"
    >
      <el-table-column label="订单ID" prop="oid" width="100" align="center">
        <template #default="{ row }">
          <span>{{ row.oid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="商品ID" prop="gid" width="100" align="center">
        <template #default="{ row }">
          <span>{{ row.gid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="购买数量" prop="number" width="100" align="center">
        <template #default="{ row }">
          <span>{{ row.number }}</span>
        </template>
      </el-table-column>

      <el-table-column label="总金额" prop="sum" width="120" align="center">
        <template #default="{ row }">
          <span class="price">¥{{ (row.sum / 100).toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单时间" prop="time" width="180" align="center">
        <template #default="{ row }">
          <span>{{ formatTime(row.time) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单状态" prop="status" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="备注信息" prop="notes" min-width="150">
        <template #default="{ row }">
          <span>{{ row.notes || '无' }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredOrderData.length"
      />
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import goodApi from '@/api/goodApi';

export default {
  name: "MyTransOrder",
  data() {
    return {
      statusFilter: null,
      orderData: [],
      isLoading: false,
      currentPage: 1,
      pageSize: 10,
      currentUserId: null, // 当前登录用户ID
    };
  },
  computed: {
    filteredOrderData() {
      let result = this.orderData;

      // 按订单状态筛选
      if (this.statusFilter !== null && this.statusFilter !== "") {
        result = result.filter(item => item.status === this.statusFilter);
      }

      return result;
    },
    paginatedOrderData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredOrderData.slice(start, end);
    },
  },
  methods: {
    // 获取当前用户ID
    getCurrentUserId() {
      try {
        // 优先从 Vuex store 获取用户信息
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

        // 如果都没有，提示用户重新登录
        console.warn('无法获取用户ID，请重新登录');
        ElMessage.warning('请重新登录');
      } catch (error) {
        console.error('获取用户ID失败:', error);
        ElMessage.error('获取用户信息失败，请重新登录');
      }
    },

    // 获取用户购买订单列表
    async fetchOrders() {
      this.isLoading = true;
      try {
        const response = await goodApi.getUserOrders();
        
        if (response.data && response.data.code === 1) {
          // 处理返回的订单数据
          this.orderData = response.data.data.map(item => ({
            ...item,
            // 确保必要字段存在
            notes: item.notes || ''
          }));
          
          ElMessage.success(`成功获取 ${this.orderData.length} 条订单记录`);
        } else {
          console.error('获取订单列表失败:', response.data?.msg || '未知错误');
          ElMessage.error('获取订单列表失败: ' + (response.data?.msg || '未知错误'));
          this.orderData = [];
        }
      } catch (error) {
        console.error('获取订单列表失败:', error);
        ElMessage.error('获取订单列表失败，请检查网络连接');
        this.orderData = [];
      } finally {
        this.isLoading = false;
      }
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: '进行中',
        1: '已中止',
        2: '售后中',
        3: '已完成'
      };
      return statusMap[status] || '未知';
    },

    // 获取状态对应的Tag类型
    getStatusType(status) {
      const typeMap = {
        0: 'primary',   // 进行中 - 蓝色
        1: 'danger',    // 已中止 - 红色
        2: 'warning',   // 售后中 - 橙色
        3: 'success'    // 已完成 - 绿色
      };
      return typeMap[status] || 'info';
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
      if (!timestamp) return '未知时间';
      
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  },
  async created() {
    // 首先获取当前用户ID
    this.getCurrentUserId();
    
    // 获取订单列表
    await this.fetchOrders();
  },
};
</script>

<style scoped>
.my-orders-container {
  padding: 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e6e6e6;
}

.header-section h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.actions {
  display: flex;
  align-items: center;
}

.el-table {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.price {
  color: #e74c3c;
  font-weight: 600;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>