<template>
  <div class="ratings-manage-container">
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
      <el-button type="primary" @click="showAddDialog" size="small" style="margin-left: auto;">增加评分</el-button>
    </div>

    <!-- 评分信息列表 -->
    <div class="table-container">
      <el-table :data="paginatedRatingData" style="width: 100%;" stripe v-loading="isLoading">
        <el-table-column label="评分编号" prop="sid" width="80">
          <template #default="{ row }">
            <span>{{ row.sid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签板块" prop="tag" width="100">
          <template #default="{ row }">
            <el-select v-if="row.isEditing" v-model="row.tag" size="small" placeholder="请选择标签">
              <el-option v-for="tag in tagOptions" :key="tag.value" :label="tag.label" :value="tag.value"></el-option>
            </el-select>
            <el-tag v-else :type="getTagType(row.tag)" size="small">{{ row.tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="参与人数" prop="num" width="90">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model.number="row.num" size="small" type="number" placeholder="参与人数"></el-input>
            <span v-else>{{ row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="对象" prop="goal" width="100">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.goal" size="small" placeholder="对象"></el-input>
            <span v-else>{{ row.goal }}</span>
          </template>
        </el-table-column>
        <el-table-column label="介绍" prop="intro" min-width="180">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.intro" size="small" placeholder="介绍"></el-input>
            <span v-else>{{ row.intro }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" prop="image" width="150">
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
        <el-table-column label="分数" prop="score" width="80">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model.number="row.score" size="small" type="number" placeholder="分数"></el-input>
            <span v-else>{{ row.score }}</span>
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
          :total="filteredRatingData.length"
      >
      </el-pagination>
    </div>

    <!-- 添加评分对话框 -->
    <el-dialog title="添加新评分" v-model="dialogVisible" width="40%">
      <el-form :model="newRating" label-width="100px" :rules="rules" ref="ratingForm">
        <el-form-item label="标签板块" prop="tag">
          <el-select v-model="newRating.tag" placeholder="请选择标签">
            <el-option v-for="tag in tagOptions" :key="tag.value" :label="tag.label" :value="tag.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参与人数" prop="num">
          <el-input v-model.number="newRating.num" type="number" placeholder="请输入参与人数"></el-input>
        </el-form-item>
        <el-form-item label="对象" prop="goal">
          <el-input v-model="newRating.goal" placeholder="请输入对象"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="intro">
          <el-input v-model="newRating.intro" placeholder="请输入介绍"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="(res, file) => handleImageSuccess(res, file, newRating)"
              :before-upload="beforeImageUpload"
          >
            <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
          <div v-if="newRating.image" style="margin-top: 8px;">
            <img :src="newRating.image" alt="图片" style="width: 60px; height: 60px; object-fit: cover;" />
            <el-button type="text" @click="newRating.image = ''" style="margin-left: 5px;">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-input v-model.number="newRating.score" type="number" placeholder="请输入分数"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitNewRating">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { adminApi } from '@/api';
import { baseURL } from '@/api/index.js';

export default {
  name: "RatingsManagement",
  data() {
    return {
      selectedTag: "",
      ratingData: [],
      isLoading: false,
      dialogVisible: false,
      newRating: {
        tag: '',
        num: 0,
        goal: '',
        intro: '',
        image: '',
        score: 0
      },
      currentPage: 1,
      pageSize: 7,      tagOptions: [],
      // 上传相关配置
      uploadUrl: baseURL + 'api/upload', // 使用正确的baseURL
      uploadHeaders: {
        // 根据需要添加请求头，如token
        // 'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      rules: {
        tag: [
          { required: true, message: '请选择标签', trigger: 'change' },
          { max: 30, message: '标签长度不能超过30个字符', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入参与人数', trigger: 'blur' },
          { type: 'number', message: '参与人数必须为数字', trigger: 'blur' }
        ],
        goal: [
          { required: true, message: '请输入对象', trigger: 'blur' },
          { max: 30, message: '对象长度不能超过30个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入介绍', trigger: 'blur' },
          { max: 100, message: '介绍不能超过100个字符', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请输入分数', trigger: 'blur' },
          { type: 'number', message: '分数必须为数字', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    filteredRatingData() {
      if (!this.selectedTag) {
        return this.ratingData;
      }
      return this.ratingData.filter(item => item.tag === this.selectedTag);
    },
    paginatedRatingData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredRatingData.slice(start, end);
    },
  },
  methods: {    // 获取评分列表
    fetchRatings() {
      this.isLoading = true;
      // 使用adminApi获取所有评分
      adminApi.getAllRatings()
        .then(response => {
          console.log('获取评分数据成功:', response);
          if (response.data && response.data.code === 1) {
            // 处理成功的响应
            this.ratingData = response.data.data.map(item => ({...item, isEditing: false}));
            
            // 构建标签选项
            this.buildTagOptions();
          } else {
            // 处理错误响应
            console.error('获取评分数据失败:', response.data?.msg || '未知错误');
            ElMessage.error('获取评分列表失败: ' + (response.data?.msg || '未知错误'));
            
            this.ratingData = [];
          }
        })
        .catch(error => {
          console.error('获取评分列表接口调用出错:', error);
          ElMessage.error('获取评分列表失败，请稍后重试');
          this.ratingData = [];
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    // 显示添加对话框
    showAddDialog() {
      this.dialogVisible = true;
      this.newRating = {
        tag: '',
        num: 0,
        goal: '',
        intro: '',
        image: '',
        score: 0
      };
      if (this.$refs.ratingForm) {
        this.$refs.ratingForm.resetFields();
      }
    },    // 提交新评分
    submitNewRating() {
      if (this.$refs.ratingForm) {
        this.$refs.ratingForm.validate(valid => {
          if (valid) {
            this.isLoading = true;
            // 使用adminApi创建评分
            adminApi.createRating(this.newRating)
              .then(response => {
                if (response.data && response.data.code === 1) {
                  ElMessage.success('添加评分成功');
                  this.fetchRatings(); // 重新获取评分列表
                  this.dialogVisible = false;
                } else {
                  ElMessage.error('添加评分失败: ' + (response.data?.msg || '未知错误'));
                }
              })
              .catch(error => {
                console.error('添加评分失败:', error);
                ElMessage.error('添加评分失败，请稍后重试');
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
      this.ratingData.forEach(item => {
        if (item.sid !== row.sid) {
          item.isEditing = false;
        }
      });
      row.isEditing = true;
      // 保存原始数据，用于取消编辑时恢复
      row._originalData = JSON.parse(JSON.stringify(row));
    },    // 保存行
    saveRow(row) {
      this.isLoading = true;
      // 使用adminApi更新评分
      adminApi.updateRating(row)
        .then(response => {
          if (response.data && response.data.code === 1) {
            row.isEditing = false;
            delete row._originalData; // 删除原始数据
            ElMessage.success('更新评分成功');
          } else {
            ElMessage.error('更新评分失败: ' + (response.data?.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('更新评分失败:', error);
          ElMessage.error('更新评分失败，请稍后重试');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },    // 删除行
    deleteRow(row) {
      this.$confirm('此操作将永久删除该评分, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true;
        // 使用adminApi删除评分
        adminApi.deleteRating(row.sid)
          .then(response => {
            if (response.data && response.data.code === 1) {
              const index = this.ratingData.findIndex(item => item.sid === row.sid);
              if (index !== -1) {
                this.ratingData.splice(index, 1);
              }
              ElMessage.success('删除评分成功');
            } else {
              ElMessage.error('删除评分失败: ' + (response.data?.msg || '未知错误'));
            }
          })
          .catch(error => {
            console.error('删除评分失败:', error);
            ElMessage.error('删除评分失败，请稍后重试');
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
    },    // 根据标签获取对应的类型样式
    getTagType(tag) {
      const tagMap = {};
      this.tagOptions.forEach((item, index) => {
        const types = ['', 'success', 'warning', 'info', 'danger'];
        tagMap[item.value] = types[index % types.length];
      });
      return tagMap[tag] || '';
    },
    
    // 获取图片完整URL
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
        return imagePath;
      }
      return baseURL + imagePath;
    },    // 获取标签列表
    fetchTags() {
      // 从scoreApi获取评分标签
      adminApi.getRatingTags()
        .then(response => {
          if (response.data && response.data.code === 1) {
            const tagsData = response.data.data;
            this.tagOptions = tagsData.map(tag => ({ value: tag, label: tag }));
          } else {
            console.error('获取标签列表失败:', response.data?.msg);
            // 设置默认标签
            this.setDefaultTags();
          }
        })
        .catch(error => {
          console.error('获取标签列表失败:', error);
          // 使用默认标签
          this.setDefaultTags();
        });
    },
    
    // 设置默认标签
    setDefaultTags() {
      this.tagOptions = [
        { value: '课程互助', label: '课程互助' },
        { value: '校园活动', label: '校园活动' },
        { value: '失物招领', label: '失物招领' },
        { value: '二手交易', label: '二手交易' },
        { value: '学习讨论', label: '学习讨论' },
        { value: '校园问题', label: '校园问题' }
      ];
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
    },    // 图片上传前验证
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
    
    // 构建标签选项
    buildTagOptions() {
      const uniqueTags = [...new Set(this.ratingData.map(item => item.tag))];
      this.tagOptions = uniqueTags
        .filter(tag => tag) // 过滤掉空标签
        .map(tag => ({ value: tag, label: tag }));
    },
  },
  created() {
    this.fetchTags();
    this.fetchRatings();
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