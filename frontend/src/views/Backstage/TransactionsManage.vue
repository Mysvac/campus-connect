<template>
  <div class="goods-manage-container">
    <!-- 筛选条件和增加按钮容器 -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <!-- 筛选条件 -->
      <div style="display: flex; gap: 10px; align-items: center;">        <el-select v-model="selectedTag" placeholder="按标签筛选" clearable size="small">
          <el-option label="全部" value=""></el-option>
          <el-option 
            v-for="tag in tagOptions" 
            :key="tag.value" 
            :label="tag.label" 
            :value="tag.value"
            v-if="tag && tag.value !== undefined && tag.label !== undefined"
          ></el-option>
        </el-select>
      </div>
      <!-- 增加按钮 -->
      <el-button type="primary" @click="showAddDialog" size="small" style="margin-left: auto;">增加商品</el-button>
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
            <el-input v-if="row.isEditing" v-model.number="row.uid" size="small" type="number" placeholder="发布人ID"></el-input>
            <span v-else>{{ row.uid }}</span>
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
        <el-table-column label="图片" prop="image" width="100">          <template #default="{ row }">
            <div v-if="row.isEditing">
              <el-upload
                  class="upload-demo"
                  :action="uploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="(res, file) => handleImageSuccess(res, file, row)"
                  :before-upload="beforeImageUpload"
              >
                <el-button size="small" type="primary">上传图片</el-button>
              </el-upload>
              <div v-if="row.image" style="margin-top: 8px;">
                <img :src="getImageUrl(row.image)" alt="图片" style="width: 60px; height: 60px; object-fit: cover;" />
                <el-button type="text" @click="row.image = ''" style="margin-left: 5px;">删除</el-button>
              </div>
            </div>
            <div v-else>
              <img v-if="row.image" :src="getImageUrl(row.image)" alt="图片" style="width: 60px; height: 60px; object-fit: cover;" />
              <span v-else>无</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标签" prop="tag" width="100">
          <template #default="{ row }">            <el-select v-if="row.isEditing" v-model="row.tag" size="small" placeholder="请选择标签">
              <el-option 
                v-for="tag in tagOptions" 
                :key="tag.value" 
                :label="tag.label" 
                :value="tag.value"
                v-if="tag && tag.value !== undefined && tag.label !== undefined"
              ></el-option>
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
            <el-input v-if="row.isEditing" v-model.number="row.sales" size="small" type="number" placeholder="销售量"></el-input>
            <span v-else>{{ row.sales }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="time" width="120">
          <template #default="{ row }">
            <el-date-picker
                v-if="row.isEditing"
                v-model="row.timeDate"
                type="datetime"
                size="small"
                placeholder="选择日期时间"
                format="YYYY-MM-DD HH:mm:ss"
                @change="updateRowTime(row)"
            ></el-date-picker>
            <span v-else>{{ formatTime(row.time) }}</span>
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
    <el-dialog title="添加新商品" v-model="dialogVisible" width="40%">
      <el-form :model="newGoods" label-width="100px" :rules="rules" ref="goodsForm">
        <el-form-item label="发布人ID" prop="uid">
          <el-input v-model.number="newGoods.uid" type="number" placeholder="请输入发布人ID"></el-input>
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
          </el-upload>          <div v-if="newGoods.image" style="margin-top: 8px;">
            <img :src="getImageUrl(newGoods.image)" alt="图片" style="width: 60px; height: 60px; object-fit: cover;" />
            <el-button type="text" @click="newGoods.image = ''" style="margin-left: 5px;">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="标签" prop="tag">          <el-select v-model="newGoods.tag" placeholder="请选择标签">
            <el-option 
              v-for="tag in tagOptions" 
              :key="tag.value" 
              :label="tag.label" 
              :value="tag.value"
              v-if="tag && tag.value !== undefined && tag.label !== undefined"
            ></el-option>
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
import { adminApi } from '@/api';
import { baseURL } from '@/api/index.js';
import { backendTags, getTagLabel } from '@/utils/tagsConfig.js';

export default {
  name: "GoodsManagement",
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
      currentPage: 1,      pageSize: 7,
      tagOptions: [...backendTags], // 使用 tagsConfig.js 中的标签配置// 上传相关配置
      uploadUrl: `${baseURL}/api/upload`, // 使用baseURL确保路径正确
      uploadHeaders: {
        // 根据需要添加请求头，如token
        // 'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      rules: {
        uid: [
          { required: true, message: '请输入发布人ID', trigger: 'blur' },
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
      if (!this.selectedTag) {
        return this.goodsData;
      }
      // 确保使用数字进行比较，解决标签筛选问题
      const selectedTagNum = Number(this.selectedTag);
      return this.goodsData.filter(item => Number(item.tag) === selectedTagNum);
    },
    paginatedGoodsData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredGoodsData.slice(start, end);
    },
  },
  methods: {    // 获取商品列表
    fetchGoods() {
      this.isLoading = true;
      // 使用adminApi获取所有商品
      adminApi.getAllProducts()
        .then(response => {
          console.log('获取商品数据成功:', response);
          if (response.data && response.data.code === 1) {            // 处理成功的响应
            this.goodsData = response.data.data.map(item => {
              return {
                ...item,
                isEditing: false,
                timeDate: new Date(Number(item.time)),
                // 确保tag是数值类型，与tagsConfig.js中的value一致
                tag: Number(item.tag) || item.tag
              };
            });
          } else {
            // 处理错误响应
            console.error('获取商品数据失败:', response.data?.msg || '未知错误');
            ElMessage.error('获取商品列表失败: ' + (response.data?.msg || '未知错误'));
            
            this.goodsData = [];
          }
        })
        .catch(error => {
          console.error('获取商品列表接口调用出错:', error);
          ElMessage.error('获取商品列表失败，请稍后重试');
          this.goodsData = [];
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    

    // 显示添加对话框
    showAddDialog() {
      this.dialogVisible = true;
      const now = new Date();      this.newGoods = {
        uid: '',
        price: 0,
        name: '',
        image: '',
        tag: 1, // 默认设置为第一个标签
        intro: '',
        quantity: 1,
        sales: 0,
        time: now.getTime(),
        timeDate: now
      };
      if (this.$refs.goodsForm) {
        this.$refs.goodsForm.resetFields();
      }
    },    // 提交新商品
    submitNewGoods() {
      if (this.$refs.goodsForm) {
        this.$refs.goodsForm.validate(valid => {
          if (valid) {
            this.isLoading = true;

            // 确保图片URL格式正确
            let imageUrl = this.newGoods.image;
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:') && !imageUrl.startsWith('/')) {
              imageUrl = '/' + imageUrl;
            }

            // 准备要提交的数据
            const productData = {
              uid: this.newGoods.uid,
              price: this.newGoods.price,
              name: this.newGoods.name,
              image: imageUrl,
              tag: this.newGoods.tag,
              intro: this.newGoods.intro,
              quantity: this.newGoods.quantity,
              sales: this.newGoods.sales,
              time: this.newGoods.time
            };

            // 使用adminApi创建商品
            adminApi.createProduct(productData)
              .then(response => {
                if (response.data && response.data.code === 1) {
                  // 处理成功的响应
                  ElMessage.success('添加商品成功');
                  this.fetchGoods(); // 重新加载商品列表
                  this.dialogVisible = false;
                } else {
                  // 处理错误响应
                  console.error('添加商品失败:', response.data?.msg || '未知错误');
                  ElMessage.error('添加商品失败: ' + (response.data?.msg || '未知错误'));
                }
              })
              .catch(error => {
                console.error('添加商品接口调用出错:', error);
                ElMessage.error('添加商品失败，请稍后重试');
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
    saveRow(row) {
      this.isLoading = true;

      // 确保图片URL格式正确
      let imageUrl = row.image;
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:') && !imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl;
      }

      // 准备要提交的数据
      const productData = {
        gid: row.gid,
        uid: row.uid,
        price: row.price,
        name: row.name,
        image: imageUrl,
        tag: row.tag,
        intro: row.intro,
        quantity: row.quantity,
        sales: row.sales,
        time: row.time
      };

      // 使用adminApi更新商品
      adminApi.updateProduct(productData)
        .then(response => {
          if (response.data && response.data.code === 1) {
            // 处理成功的响应
            row.isEditing = false;
            delete row._originalData; // 删除原始数据
            ElMessage.success('更新商品成功');
          } else {
            // 处理错误响应
            console.error('更新商品失败:', response.data?.msg || '未知错误');
            ElMessage.error('更新商品失败: ' + (response.data?.msg || '未知错误'));
            
            // 如果有原始数据，则还原
            if (row._originalData) {
              Object.assign(row, row._originalData);
            }
          }
        })
        .catch(error => {
          console.error('更新商品接口调用出错:', error);
          ElMessage.error('更新商品失败，请稍后重试');
          
          // 如果有原始数据，则还原
          if (row._originalData) {
            Object.assign(row, row._originalData);
          }
        })
        .finally(() => {
          this.isLoading = false;
          row.isEditing = false;
        });
    },    // 删除行
    deleteRow(row) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true;
        
        // 使用adminApi删除商品
        adminApi.deleteProduct(row.gid)
          .then(response => {
            if (response.data && response.data.code === 1) {
              // 处理成功的响应
              const index = this.goodsData.findIndex(item => item.gid === row.gid);
              if (index !== -1) {
                this.goodsData.splice(index, 1);
              }
              ElMessage.success('删除商品成功');
            } else {
              // 处理错误响应
              console.error('删除商品失败:', response.data?.msg || '未知错误');
              ElMessage.error('删除商品失败: ' + (response.data?.msg || '未知错误'));
            }
          })
          .catch(error => {
            console.error('删除商品接口调用出错:', error);
            ElMessage.error('删除商品失败，请稍后重试');
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
    },    // 根据标签获取对应的类型样式
    getTagType(tag) {
      // 确保tag是数字
      const tagNum = Number(tag) || 1;
      const types = ['success', 'warning', 'info', 'danger', 'primary'];
      return types[(tagNum - 1) % types.length] || 'success';
    },// 根据标签值获取标签名称
    getTagLabel(tagValue) {
      return getTagLabel(tagValue);
    },

    // 删除获取标签的方法，改为直接使用配置文件// 图片上传成功处理
    handleImageSuccess(response, file, target) {
      // 正常情况下，后端会返回图片URL
      if (response && response.data && response.data.code === 1) {
        const imageUrl = response.data.data;
        target.image = this.getImageUrl(imageUrl);
        ElMessage.success('图片上传成功');
      } else if (response && response.url) {
        // 直接返回URL的情况
        target.image = this.getImageUrl(response.url);
        ElMessage.success('图片上传成功');
      } else {
        // 创建一个本地URL用于预览（临时显示）
        const URL = window.URL || window.webkitURL;
        if (URL && file) {
          target.image = URL.createObjectURL(file.raw);
          ElMessage.warning('图片已临时预览，但上传可能未成功');
        } else {
          ElMessage.error('图片上传失败');
        }
      }
    },
    
    // 获取正确的图片URL
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
        return imagePath;
      }
      return baseURL + imagePath;
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
  created() {
    // 不再需要获取标签，直接从配置文件导入
    this.fetchGoods();
  },
};
</script>

<style scoped>

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

</style>