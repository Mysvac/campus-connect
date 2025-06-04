<template>
  <div class="goods-manage-container">
    <!-- 过滤器区域 -->
    <div class="filter-container" style="margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 15px;">
        <span style="font-weight: bold;">筛选条件：</span>
        <el-select
            v-model="selectedTag"
            placeholder="选择标签"
            clearable
            style="width: 150px;"
        >
          <el-option
              v-for="tag in tagOptions"
              :key="tag.value"
              :label="tag.label"
              :value="tag.value">
          </el-option>
        </el-select>        <el-button type="primary" @click="refreshData" :loading="isLoading">
          刷新数据
        </el-button>
        <span class="goods-count">
          共 {{ filteredGoodsData.length }} 件商品
        </span>
      </div>
    </div>

    <!-- 商品信息列表 -->
    <div class="table-container">
      <el-table :data="paginatedGoodsData" style="width: 100%;" stripe v-loading="isLoading">
        <el-table-column label="商品ID" prop="gid" width="80">
          <template #default="{ row }">
            <span>{{ row.gid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布人" prop="uid" width="80">
          <template #default="{ row }">
            <span>{{ row.uid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格(分)" prop="price" width="90">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model.number="row.price" size="small" type="number" placeholder="价格"></el-input>
            <span v-else>{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名" prop="name" width="120">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.name" size="small" placeholder="商品名"></el-input>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" prop="image" width="100">
          <template #default="{ row }">
            <div>
              <el-upload
                v-if="row.isEditing"
                class="upload-demo"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :show-file-list="true"
                :on-success="(res, file) => handleImageSuccess(res, file, row)"
                :before-upload="beforeImageUpload"
                :file-list="row.image ? [{name: '图片', url: row.image}] : []"
                :auto-upload="true"
                :limit="1"
                :on-remove="() => { row.image = '' }"
              >
                <el-button size="small" type="primary">上传图片</el-button>
                <template #file="{ file }">
                  <img v-if="file.url" :src="file.url" alt="图片" style="width: 60px; height: 60px; object-fit: cover;" />
                </template>
              </el-upload>
              <div v-if="row.image && !row.isEditing" style="margin-top: 8px;">
                <img :src="row.image" alt="图片" style="width: 60px; height: 60px; object-fit: cover;" />
              </div>
              <span v-if="!row.image && !row.isEditing">无</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标签" prop="tag" width="100">
          <template #default="{ row }">
            <el-select v-if="row.isEditing" v-model="row.tag" size="small" placeholder="请选择标签">
              <el-option v-for="tag in tagOptions" :key="tag.value" :label="tag.label" :value="tag.value"></el-option>
            </el-select>
            <el-tag v-else :type="getTagType(row.tag)" size="small">{{ getTagLabel(row.tag) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="简介" prop="intro" min-width="150">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.intro" size="small" placeholder="简介"></el-input>
            <span v-else>{{ row.intro }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余量" prop="quantity" width="70">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model.number="row.quantity" size="small" type="number" placeholder="余量"></el-input>
            <span v-else>{{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售量" prop="sales" width="70">
          <template #default="{ row }">
            <span>{{ row.sales }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="time" width="120">
          <template #default="{ row }">
            <span>{{ formatTime(row.time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="warning" size="small" @click="editRow(scope.row)" v-if="!scope.row.isEditing">编辑</el-button>
            <el-button type="success" size="small" @click="saveRow(scope.row)" v-if="scope.row.isEditing">保存</el-button>
            <el-button type="danger" size="small" @click="deleteRow(scope.row)">删除</el-button>
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
          :total="filteredGoodsData.length"
      >
      </el-pagination>
    </div>

    <!-- 添加商品对话框 -->
    <el-dialog title="添加新商品" v-model="dialogVisible" width="40%">      <el-form :model="newGoods" label-width="100px" :rules="rules" ref="goodsForm">
        <el-form-item label="发布人ID" prop="uid">
          <el-input v-model.number="newGoods.uid" type="number" placeholder="当前用户ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="价格(分)" prop="price">
          <el-input v-model.number="newGoods.price" type="number" placeholder="请输入价格(分)"></el-input>
        </el-form-item>
        <el-form-item label="商品名" prop="name">
          <el-input v-model="newGoods.name" placeholder="请输入商品名"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="(res, file) => handleImageSuccess(res, file, newGoods)"
              :before-upload="beforeImageUpload"
          >
            <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
          <div v-if="newGoods.image" style="margin-top: 8px;">
            <img :src="newGoods.image" alt="图片" style="width: 60px; height: 60px; object-fit: cover;" />
            <el-button type="text" @click="newGoods.image = ''" style="margin-left: 5px;">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-select v-model="newGoods.tag" placeholder="请选择标签">
            <el-option v-for="tag in tagOptions" :key="tag.value" :label="tag.label" :value="tag.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input v-model="newGoods.intro" placeholder="请输入简介"></el-input>
        </el-form-item>
        <el-form-item label="余量" prop="quantity">
          <el-input v-model.number="newGoods.quantity" type="number" placeholder="请输入余量"></el-input>
        </el-form-item>
        <el-form-item label="销售量" prop="sales">
          <el-input v-model.number="newGoods.sales" type="number" placeholder="请输入销售量"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="timeDate">
          <el-date-picker
              v-model="newGoods.timeDate"
              type="datetime"
              placeholder="选择日期时间"
              format="YYYY-MM-DD HH:mm:ss"
              @change="updateNewGoodsTime"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitNewGoods">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import goodApi from '@/api/goodApi';

export default {
  name: "GoodsManage",
  data() {
    return {
      selectedTag: "",
      goodsData: [],
      isLoading: false,
      dialogVisible: false,
      newGoods: {
        uid: '',
        price: 0,
        name: '',
        image: '',
        tag: '',
        intro: '',
        quantity: 1,
        sales: 0,
        time: Date.now(),
        timeDate: new Date()
      },
      currentPage: 1,
      pageSize: 7,      tagOptions: [],
      currentUserId: null, // 当前登录用户ID，从登录状态获取
      // 上传相关配置
      uploadUrl: '/api/upload', // 替换为实际的上传API地址
      uploadHeaders: {
        // 根据需要添加请求头，如token
        // 'Authorization': 'Bearer ' + localStorage.getItem('token')
      },      rules: {
        uid: [
          { type: 'number', message: '发布人ID必须为数字', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { type: 'number', message: '价格必须为数字', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入商品名', trigger: 'blur' },
          { max: 32, message: '商品名长度不能超过32个字符', trigger: 'blur' }
        ],
        tag: [
          { required: true, message: '请选择标签', trigger: 'change' }
        ],
        intro: [
          { max: 100, message: '简介不能超过100个字符', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请输入余量', trigger: 'blur' },
          { type: 'number', message: '余量必须为数字', trigger: 'blur' }
        ],
        sales: [
          { type: 'number', message: '销售量必须为数字', trigger: 'blur' }
        ],
        timeDate: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
      }
    };
  },  computed: {
    filteredGoodsData() {
      // 数据已经是当前用户的商品，无需再次过滤用户ID
      let result = this.goodsData;
      if (this.selectedTag) {
        result = result.filter(item => item.tag === this.selectedTag);
      }
      return result;
    },
    paginatedGoodsData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredGoodsData.slice(start, end);
    },
  },  methods: {
    // 获取当前用户ID
    getCurrentUserId() {
      try {
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
        // 可以跳转到登录页面
        // this.$router.push('/login');
      } catch (error) {
        console.error('获取用户ID失败:', error);
        ElMessage.error('获取用户信息失败，请重新登录');
      }
    },

    // 获取商品列表 - 使用API获取当前用户的商品
    async fetchGoods() {
      if (!this.currentUserId) {
        console.warn('用户ID不存在，无法获取商品列表');
        return;
      }

      this.isLoading = true;
      try {
        // 使用API获取指定用户的商品
        const response = await goodApi.getUserProducts(this.currentUserId);
        if (response.data && response.data.code === 1) {
          this.goodsData = response.data.data.map(item => ({
            ...item,
            isEditing: false,
            timeDate: new Date(Number(item.time))
          }));
        } else {
          console.error('获取商品列表失败:', response.data?.msg);
          ElMessage.error('获取商品列表失败: ' + (response.data?.msg || '未知错误'));
          this.goodsData = [];
        }
      } catch (error) {
        console.error('获取商品列表失败:', error);
        ElMessage.error('获取商品列表失败');
        this.goodsData = [];
      } finally {        this.isLoading = false;
      }
    },

    // 刷新数据
    async refreshData() {
      await this.fetchGoods();
    },

    // 显示添加对话框
    showAddDialog() {
      this.dialogVisible = true;
      const now = new Date();
      this.newGoods = {
        uid: this.currentUserId || '', // 使用当前用户ID
        price: 0,
        name: '',
        image: '',
        tag: '',
        intro: '',
        quantity: 1,
        sales: 0,
        time: now.getTime(),
        timeDate: now
      };
      if (this.$refs.goodsForm) {
        this.$refs.goodsForm.resetFields();
      }
    },

    // 提交新商品
    async submitNewGoods() {
      if (this.$refs.goodsForm) {
        this.$refs.goodsForm.validate(async (valid) => {
          if (valid) {
            try {
              // 确保使用当前用户ID
              this.newGoods.uid = this.currentUserId;
              const response = await goodApi.createProduct(this.newGoods);
              
              if (response.data && response.data.code === 1) {
                ElMessage.success('添加商品成功');
                this.dialogVisible = false;
                // 重新获取商品列表
                await this.fetchGoods();
              } else {
                ElMessage.error('添加商品失败: ' + (response.data?.msg || '未知错误'));
              }
            } catch (error) {
              console.error('添加商品失败:', error);
              ElMessage.error('添加商品失败');
            }
          } else {
            return false;
          }
        });
      }
    },

    // 编辑行
    editRow(row) {
      this.goodsData.forEach(item => {
        if (item.gid !== row.gid) {
          item.isEditing = false;
        }
      });
      row.isEditing = true;
      // 确保时间字段正确初始化为Date对象
      row.timeDate = new Date(Number(row.time));
      // 保存原始数据，用于取消编辑时恢复
      row._originalData = JSON.parse(JSON.stringify(row));
    },    // 保存行
    async saveRow(row) {
      try {
        // 验证数据
        if (!row.name || !row.price) {
          ElMessage.error('商品名和价格不能为空');
          return;
        }

        // 更新时间
        if (row.timeDate) {
          row.time = row.timeDate.getTime();
        }

        // 调用更新商品接口
        const response = await goodApi.updateProduct({
          gid: row.gid,
          uid: row.uid,
          name: row.name,
          price: row.price,
          image: row.image,
          tag: row.tag,
          intro: row.intro,
          quantity: row.quantity,
          sales: row.sales,
          time: row.time
        });
        
        if (response.data && (response.data.code === 1 || response.data.success)) {
          ElMessage.success('更新商品成功');
          row.isEditing = false;
          delete row._originalData;
          // 重新获取数据以确保显示最新内容
          await this.fetchGoods();
        } else {
          ElMessage.error('更新商品失败: ' + (response.data?.msg || response.data?.message || '未知错误'));
        }
      } catch (error) {
        console.error('更新商品失败:', error);
        ElMessage.error('更新商品失败');
      }
    },

    // 删除行
    async deleteRow(row) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await goodApi.deleteProduct(row.gid);
          
          if (response.data && (response.data.code === 1 || response.data.success)) {
            ElMessage.success('删除商品成功');
            // 重新获取商品列表
            await this.fetchGoods();
          } else {
            ElMessage.error('删除商品失败: ' + (response.data?.msg || response.data?.message || '未知错误'));
          }
        } catch (error) {
          console.error('删除商品失败:', error);
          ElMessage.error('删除商品失败');
        }
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
      const date = new Date(Number(timestamp));
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    // 更新行时间
    updateRowTime(row) {
      if (row.timeDate) {
        row.time = row.timeDate.getTime();
      }
    },

    // 更新新商品时间
    updateNewGoodsTime() {
      if (this.newGoods.timeDate) {
        this.newGoods.time = this.newGoods.timeDate.getTime();
      }
    },

    // 根据标签获取对应的类型样式
    getTagType(tag) {
      const types = ['', 'success', 'warning', 'info', 'danger'];
      return types[tag % types.length] || '';
    },

    // 根据标签值获取标签名称
    getTagLabel(tagValue) {
      const tag = this.tagOptions.find(t => t.value === tagValue);
      return tag ? tag.label : `标签${tagValue}`;
    },    // 获取标签列表
    async fetchTags() {
      try {
        const response = await goodApi.getProductTags();
        if (response.data && response.data.code === 1) {
          this.tagOptions = response.data.data;
        } else {
          console.error('获取标签列表失败:', response.data?.msg);
          // 使用默认标签作为备选
          this.tagOptions = [
            {value: 1, label: '二手电子'},
            {value: 2, label: '教材书籍'},
            {value: 3, label: '生活用品'},
            {value: 4, label: '服装鞋帽'},
            {value: 5, label: '文具用品'},
            {value: 6, label: '代步工具'}
          ];
        }
      } catch (error) {
        console.error('获取标签列表失败:', error);
        // 使用默认标签作为备选
        this.tagOptions = [
          {value: 1, label: '二手电子'},
          {value: 2, label: '教材书籍'},
          {value: 3, label: '生活用品'},
          {value: 4, label: '服装鞋帽'},
          {value: 5, label: '文具用品'},
          {value: 6, label: '代步工具'}
        ];
      }
    },

    // 图片上传成功处理
    handleImageSuccess(response, file, target) {
      // 优先使用后端返回的图片URL
      if (response && response.url) {
        target.image = response.url;
      } else if (file && file.response && file.response.url) {
        target.image = file.response.url;
      } else if (file && file.url) {
        target.image = file.url;
      } else if (file && file.raw) {
        // 兼容本地预览
        const URL = window.URL || window.webkitURL;
        if (URL) {
          target.image = URL.createObjectURL(file.raw);
        }
      }
      this.$nextTick(() => {
        ElMessage.success('图片上传成功');
      });
    },

    // 图片上传前验证
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        ElMessage.error('上传图片只能是 JPG/PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        ElMessage.error('上传图片大小不能超过 2MB!');
        return false;
      }
      return isJPG && isLt2M;
    },  },
  async created() {
    // 首先获取当前用户ID
    this.getCurrentUserId();
    
    // 获取标签列表
    await this.fetchTags();
    
    // 如果有用户ID，则获取商品列表
    if (this.currentUserId) {
      this.fetchGoods();
    }
  },
};
</script>

<style scoped>
.goods-manage-container {
  padding: 20px;
}

.filter-container {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.goods-count {
  color: #666;
  font-size: 14px;
}

.el-table {
  width: 100% !important;
  table-layout: fixed;
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

.upload-demo {
  display: inline-block;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>