<template>
  <div class="goods-manage-container">
    <!-- 筛选条件和增加按钮容器 -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <!-- 筛选条件 -->
      <div style="display: flex; gap: 10px; align-items: center;">
        <el-select v-model="selectedTag" placeholder="按标签筛选" clearable size="small">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="tag in tagOptions" :key="tag.value" :label="tag.label" :value="tag.value"></el-option>
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
        <el-table-column label="图片" prop="image" width="100">
          <template #default="{ row }">
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
                <img :src="row.image" alt="图片" style="width: 60px; height: 60px; object-fit: cover;" />
                <el-button type="text" @click="row.image = ''" style="margin-left: 5px;">删除</el-button>
              </div>
            </div>
            <div v-else>
              <img v-if="row.image" :src="row.image" alt="图片" style="width: 60px; height: 60px; object-fit: cover;" />
              <span v-else>无</span>
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
      pageSize: 7,
      tagOptions: [],
      // 上传相关配置
      uploadUrl: '/api/upload', // 替换为实际的上传API地址
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
  },
  computed: {
    filteredGoodsData() {
      if (!this.selectedTag) {
        return this.goodsData;
      }
      return this.goodsData.filter(item => item.tag === this.selectedTag);
    },
    paginatedGoodsData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredGoodsData.slice(start, end);
    },
  },
  methods: {
    // 获取商品列表
    fetchGoods() {
      this.isLoading = true;
      // 这里替换为实际的API调用
      // this.$axios.get('/api/goods').then(response => {
      //   this.goodsData = response.data.map(item => {
      //     return {
      //       ...item,
      //       isEditing: false,
      //       timeDate: new Date(Number(item.time))
      //     };
      //   });
      //   this.isLoading = false;
      // }).catch(error => {
      //   console.error('获取商品列表失败:', error);
      //   this.isLoading = false;
      //   ElMessage.error('获取商品列表失败');
      // });

      // 模拟数据
      setTimeout(() => {
        this.goodsData = [
          {
            gid: 1,
            uid: 1001,
            price: 5000,
            name: '二手笔记本电脑',
            image: 'https://example.com/img1.jpg',
            tag: 1,
            intro: '八成新笔记本电脑，性能良好',
            quantity: 1,
            sales: 0,
            time: 1715006400000, // 2024-05-07 00:00:00
            isEditing: false,
            timeDate: new Date(1715006400000)
          },
          {
            gid: 2,
            uid: 1002,
            price: 2000,
            name: '计算机网络教材',
            image: 'https://example.com/img2.jpg',
            tag: 2,
            intro: '全新计算机网络教材，有笔记',
            quantity: 5,
            sales: 2,
            time: 1714920000000, // 2024-05-06 00:00:00
            isEditing: false,
            timeDate: new Date(1714920000000)
          },
          {
            gid: 3,
            uid: 1003,
            price: 3500,
            name: '自行车',
            image: 'https://example.com/img3.jpg',
            tag: 3,
            intro: '九成新自行车，适合校园代步',
            quantity: 1,
            sales: 0,
            time: 1714833600000, // 2024-05-05 00:00:00
            isEditing: false,
            timeDate: new Date(1714833600000)
          }
        ];
        this.isLoading = false;
      }, 500);
    },

    // 显示添加对话框
    showAddDialog() {
      this.dialogVisible = true;
      const now = new Date();
      this.newGoods = {
        uid: '',
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
    submitNewGoods() {
      if (this.$refs.goodsForm) {
        this.$refs.goodsForm.validate(valid => {
          if (valid) {
            // 这里替换为实际的API调用
            // this.$axios.post('/api/goods', this.newGoods).then(response => {
            //   ElMessage.success('添加商品成功');
            //   this.fetchGoods();
            //   this.dialogVisible = false;
            // }).catch(error => {
            //   console.error('添加商品失败:', error);
            //   ElMessage.error('添加商品失败');
            // });

            // 模拟添加
            const maxId = Math.max(...this.goodsData.map(item => item.gid), 0);
            const newGoods = {
              ...this.newGoods,
              gid: maxId + 1,
              isEditing: false
            };
            this.goodsData.unshift(newGoods);
            ElMessage.success('添加商品成功');
            this.dialogVisible = false;
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
    },

    // 保存行
    saveRow(row) {
      // 这里替换为实际的API调用
      // this.$axios.put(`/api/goods/${row.gid}`, row).then(response => {
      //   row.isEditing = false;
      //   ElMessage.success('更新商品成功');
      // }).catch(error => {
      //   console.error('更新商品失败:', error);
      //   ElMessage.error('更新商品失败');
      // });

      // 模拟保存
      row.isEditing = false;
      delete row._originalData; // 删除原始数据
      ElMessage.success('更新商品成功');
    },

    // 删除行
    deleteRow(row) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里替换为实际的API调用
        // this.$axios.delete(`/api/goods/${row.gid}`).then(response => {
        //   const index = this.goodsData.findIndex(item => item.gid === row.gid);
        //   if (index !== -1) {
        //     this.goodsData.splice(index, 1);
        //   }
        //   ElMessage.success('删除商品成功');
        // }).catch(error => {
        //   console.error('删除商品失败:', error);
        //   ElMessage.error('删除商品失败');
        // });

        // 模拟删除
        const index = this.goodsData.findIndex(item => item.gid === row.gid);
        if (index !== -1) {
          this.goodsData.splice(index, 1);
        }
        ElMessage.success('删除商品成功');
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
    },

    // 获取标签列表
    fetchTags() {
      // 这里替换为实际的API调用
      // this.$axios.get('/api/tags').then(response => {
      //   this.tagOptions = response.data;
      // }).catch(error => {
      //   console.error('获取标签列表失败:', error);
      //   ElMessage.error('获取标签列表失败');
      // });

      // 模拟数据
      setTimeout(() => {
        this.tagOptions = [
          {value: 1, label: '二手电子'},
          {value: 2, label: '教材书籍'},
          {value: 3, label: '生活用品'},
          {value: 4, label: '服装鞋帽'},
          {value: 5, label: '文具用品'},
          {value: 6, label: '代步工具'}
        ];
      }, 300);
    },

    // 图片上传成功处理
    handleImageSuccess(response, file, target) {
      // 正常情况下，后端会返回图片URL
      if (response && response.url) {
        target.image = response.url;
      } else {
        // 模拟情况：创建一个本地URL用于预览
        // 注意：在实际生产环境中，这应该由服务器返回真实URL
        const URL = window.URL || window.webkitURL;
        if (URL && file) {
          target.image = URL.createObjectURL(file.raw);

          // 在实际应用中应该移除此模拟代码，使用服务器返回的URL
          // 以下仅为演示
          setTimeout(() => {
            // 模拟服务器处理完毕
            target.image = `https://example.com/uploads/${file.name}`;
          }, 1000);
        }
      }
      ElMessage.success('图片上传成功');
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
    },
  },
  created() {
    this.fetchTags();
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