<template>
  <div>
    <!-- 筛选条件和增加按钮容器 -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <!-- 筛选条件 -->
      <div style="display: flex; gap: 10px; align-items: center;">
        <el-input
            v-model="uidFilter"
            placeholder="按购买人ID筛选"
            clearable
            size="small"
            style="width: 150px;"
            @clear="fetchOrders"
        ></el-input>
        <el-select
            v-model="statusFilter"
            placeholder="订单状态"
            clearable
            size="small"
            style="width: 150px;"
            @clear="fetchOrders"
        >
          <el-option label="进行中" :value="0"></el-option>
          <el-option label="已中止" :value="1"></el-option>
          <el-option label="售后中" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
        </el-select>
      </div>
      <!-- 增加按钮，使用 flex-end 来让按钮右对齐 -->
      <el-button type="primary" @click="showAddDialog" size="small" style="margin-left: auto;">新增订单</el-button>
    </div>

    <!-- 订单信息列表 -->
    <el-table :data="paginatedOrderData" style="width: 100%" stripe v-loading="isLoading">
      <el-table-column label="订单号" prop="oid" width="100">
        <template #default="{ row }">
          <span>{{ row.oid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="购买人ID" prop="uid" width="100">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model.number="row.uid"
              size="small"
              placeholder="请输入购买人ID"
          ></el-input>
          <span v-else>{{ row.uid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="商品ID" prop="gid" width="100">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model.number="row.gid"
              size="small"
              placeholder="请输入商品ID"
          ></el-input>
          <span v-else>{{ row.gid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单时间" prop="time" width="180">
        <template #default="{ row }">
          <span>{{ formatTime(row.time) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="总金额(元)" prop="sum" width="100">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model.number="row.sum"
              size="small"
              type="number"
              placeholder="总金额(分)"
          ></el-input>
          <span v-else>{{ (row.sum / 100).toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="购买数量" prop="number" width="100">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model.number="row.number"
              size="small"
              type="number"
              placeholder="购买数量"
          ></el-input>
          <span v-else>{{ row.number }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单状态" prop="status" width="100">
        <template #default="{ row }">
          <el-select
              v-if="row.isEditing"
              v-model="row.status"
              size="small"
              placeholder="选择状态"
          >
            <el-option :value="0" label="进行中"></el-option>
            <el-option :value="1" label="已中止"></el-option>
            <el-option :value="2" label="售后中"></el-option>
            <el-option :value="3" label="已完成"></el-option>
          </el-select>
          <el-tag v-else :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="订单备注" prop="notes">
        <template #default="{ row }">
          <el-input
              v-if="row.isEditing"
              v-model="row.notes"
              type="textarea"
              size="small"
              placeholder="请输入备注"
          ></el-input>
          <span v-else>{{ row.notes || '无' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="160" fixed="right">
        <template #default="scope">
          <!-- <el-button
              type="warning"
              size="small"
              @click="editRow(scope.row)"
              v-if="!scope.row.isEditing"
          >
            编辑
          </el-button> -->
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
          :total="filteredOrderData.length"
      >
      </el-pagination>
    </div>

    <!-- 添加订单对话框 -->
    <el-dialog title="添加新订单" v-model="dialogVisible" width="40%">
      <el-form :model="newOrder" label-width="100px" :rules="rules" ref="orderForm">
        <el-form-item label="购买人ID" prop="uid">
          <el-input v-model.number="newOrder.uid" type="number" placeholder="请输入购买人ID"></el-input>
        </el-form-item>
        <el-form-item label="商品ID" prop="gid">
          <el-input v-model.number="newOrder.gid" type="number" placeholder="请输入商品ID"></el-input>
        </el-form-item>
        <el-form-item label="总金额(元)" prop="sum">
          <el-input v-model="newOrder.sumDisplay" type="number" placeholder="请输入总金额(元)">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="购买数量" prop="number">
          <el-input v-model.number="newOrder.number" type="number" placeholder="请输入购买数量"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="newOrder.status" placeholder="请选择订单状态">
            <el-option :value="0" label="进行中"></el-option>
            <el-option :value="1" label="已中止"></el-option>
            <el-option :value="2" label="售后中"></el-option>
            <el-option :value="3" label="已完成"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单备注" prop="notes">
          <el-input v-model="newOrder.notes" type="textarea" :rows="4" placeholder="请输入订单备注（选填）"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitNewOrder">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { adminApi } from '@/api';
import { baseURL } from '@/api/index.js';

export default {
  name: "OrderManagement",
  data() {
    return {
      uidFilter: "",
      statusFilter: "",
      orderData: [],
      isLoading: false,
      dialogVisible: false,
      newOrder: {
        uid: '',
        gid: '',
        time: null,
        sumDisplay: '', // 用于显示元为单位的金额
        sum: 0,       // 存储分为单位的金额
        number: 1,
        status: 0,
        notes: ''
      },
      currentPage: 1,
      pageSize: 10,
      rules: {
        uid: [
          { required: true, message: '请输入购买人ID', trigger: 'blur' },
          { type: 'number', message: '购买人ID必须为数字', trigger: 'blur' }
        ],
        gid: [
          { required: true, message: '请输入商品ID', trigger: 'blur' },
          { type: 'number', message: '商品ID必须为数字', trigger: 'blur' }
        ],
        sumDisplay: [
          { required: true, message: '请输入总金额', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入购买数量', trigger: 'blur' },
          { type: 'number', message: '购买数量必须为数字', trigger: 'blur' },
          { min: 1, message: '购买数量必须大于0', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    filteredOrderData() {
      let result = this.orderData;

      // 按购买人ID筛选
      if (this.uidFilter) {
        result = result.filter(item => item.uid === parseInt(this.uidFilter));
      }

      // 按订单状态筛选
      if (this.statusFilter !== "" && this.statusFilter !== null) {
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
  watch: {
    'newOrder.sumDisplay': {
      handler(val) {
        // 将元转换为分
        if (val) {
          this.newOrder.sum = Math.round(parseFloat(val) * 100);
        } else {
          this.newOrder.sum = 0;
        }
      }
    }
  },
  methods: {    // 获取订单列表
    fetchOrders() {
      this.isLoading = true;
      // 使用adminApi获取所有订单
      adminApi.getAllOrders()
        .then(response => {
          console.log('获取订单数据成功:', response);
          if (response.data && response.data.code === 1) {
            // 处理成功的响应
            this.orderData = response.data.data.map(item => ({
              ...item, 
              isEditing: false,
              sumDisplay: (item.sum / 100).toFixed(2) // 将分转为元，并保留两位小数
            }));
          } else {
            // 处理错误响应
            console.error('获取订单数据失败:', response.data?.msg || '未知错误');
            ElMessage.error('获取订单列表失败: ' + (response.data?.msg || '未知错误'));
            
            this.orderData = [];
          }
        })
        .catch(error => {
          console.error('获取订单列表接口调用出错:', error);
          ElMessage.error('获取订单列表失败，请稍后重试');
          this.orderData = [];
        })
        .finally(() => {
          this.isLoading = false;
        });
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
        0: 'primary',   // 进行中
        1: 'danger',    // 已中止
        2: 'warning',   // 售后中
        3: 'success'    // 已完成
      };
      return typeMap[status] || 'info';
    },

    // 显示添加对话框
    showAddDialog() {
      this.dialogVisible = true;
      this.newOrder = {
        uid: '',
        gid: '',
        time: null,
        sumDisplay: '',
        sum: 0,
        number: 1,
        status: 0,
        notes: ''
      };
      // 如果有表单引用，重置验证
      if (this.$refs.orderForm) {
        this.$refs.orderForm.resetFields();
      }
    },    // 提交新订单
    submitNewOrder() {
      if (this.$refs.orderForm) {
        this.$refs.orderForm.validate(valid => {
          if (valid) {
            this.newOrder.time = Date.now();
            this.isLoading = true;
            
            // 准备要提交的数据
            const orderData = {
              uid: this.newOrder.uid,
              gid: this.newOrder.gid,
              sum: this.newOrder.sum,
              number: this.newOrder.number,
              status: this.newOrder.status,
              notes: this.newOrder.notes,
              time: this.newOrder.time
            };
            
            // 使用adminApi创建订单
            adminApi.createOrder(orderData)
              .then(response => {
                if (response.data && response.data.code === 1) {
                  ElMessage.success('添加订单成功');
                  this.fetchOrders(); // 重新获取订单列表
                  this.dialogVisible = false;
                } else {
                  ElMessage.error('添加订单失败: ' + (response.data?.msg || '未知错误'));
                }
              })
              .catch(error => {
                console.error('添加订单失败:', error);
                ElMessage.error('添加订单失败，请稍后重试');
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
      this.orderData.forEach(item => {
        if (item.oid !== row.oid) {
          item.isEditing = false;
        }
      });
      // 设置当前行为编辑状态
      row.isEditing = true;
    },    // 保存行
    saveRow(row) {
      this.isLoading = true;
      // 使用adminApi更新订单
      adminApi.updateOrder(row)
        .then(response => {
          if (response.data && response.data.code === 1) {
            row.isEditing = false;
            delete row._originalData; // 删除原始数据
            ElMessage.success('更新订单成功');
          } else {
            ElMessage.error('更新订单失败: ' + (response.data?.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('更新订单失败:', error);
          ElMessage.error('更新订单失败，请稍后重试');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },    // 删除行
    deleteRow(row) {
      // 弹出确认框
      ElMessageBox.confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true;
        // 使用adminApi删除订单
        adminApi.deleteOrder(row.oid)
          .then(response => {
            if (response.data && response.data.code === 1) {
              const index = this.orderData.findIndex(item => item.oid === row.oid);
              if (index !== -1) {
                this.orderData.splice(index, 1);
              }
              ElMessage.success('删除订单成功');
            } else {
              ElMessage.error('删除订单失败: ' + (response.data?.msg || '未知错误'));
            }
          })
          .catch(error => {
            console.error('删除订单失败:', error);
            ElMessage.error('删除订单失败，请稍后重试');
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
    this.fetchOrders();
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