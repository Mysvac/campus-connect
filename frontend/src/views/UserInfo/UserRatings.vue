<template>
  <div class="ratings-manage-container">

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
            <span>{{ row.num }}</span>
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

export default {
  name: "RatingsManage",
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
      pageSize: 7,
      tagOptions: [],
      // 上传相关配置
      uploadUrl: '/api/upload', // 替换为实际的上传API地址
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
      },
      currentUserId: 101, // 假设当前登录用户ID，实际应从登录状态获取
    };
  },
  computed: {
    filteredRatingData() {
      // 只显示当前登录人id发布的评分
      let result = this.ratingData.filter(item => item.uid === this.currentUserId);
      if (!this.selectedTag) {
        return result;
      }
      return result.filter(item => item.tag === this.selectedTag);
    },
    paginatedRatingData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredRatingData.slice(start, end);
    },
  },
  methods: {
    // 获取评分列表
    fetchRatings() {
      this.isLoading = true;
      // 这里替换为实际的API调用
      // this.$axios.get('/api/ratings').then(response => {
      //   this.ratingData = response.data.map(item => ({...item, isEditing: false}));
      //   this.isLoading = false;
      // }).catch(error => {
      //   console.error('获取评分列表失败:', error);
      //   this.isLoading = false;
      //   ElMessage.error('获取评分列表失败');
      // });

      // 模拟数据
      setTimeout(() => {
        this.ratingData = [
          { sid: 1, tag: '课程互助', num: 25, goal: '高数', intro: '高数互助评分', image: 'https://example.com/img1.jpg', score: 4.5, isEditing: false },
          { sid: 2, tag: '校园活动', num: 100, goal: '歌手大赛', intro: '歌手大赛评分', image: 'https://example.com/img2.jpg', score: 4.8, isEditing: false },
          { sid: 3, tag: '失物招领', num: 10, goal: '学生卡', intro: '失物招领评分', image: 'https://example.com/img3.jpg', score: 4.2, isEditing: false }
        ];
        this.isLoading = false;
      }, 500);
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
    },

    // 提交新评分
    submitNewRating() {
      if (this.$refs.ratingForm) {
        this.$refs.ratingForm.validate(valid => {
          if (valid) {
            // 这里替换为实际的API调用
            // this.$axios.post('/api/ratings', this.newRating).then(response => {
            //   ElMessage.success('添加评分成功');
            //   this.fetchRatings();
            //   this.dialogVisible = false;
            // }).catch(error => {
            //   console.error('添加评分失败:', error);
            //   ElMessage.error('添加评分失败');
            // });

            // 模拟添加
            const maxId = Math.max(...this.ratingData.map(item => item.sid), 0);
            const newRating = {
              ...this.newRating,
              sid: maxId + 1,
              isEditing: false
            };
            this.ratingData.unshift(newRating);
            ElMessage.success('添加评分成功');
            this.dialogVisible = false;
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
    },

    // 保存行
    saveRow(row) {
      // 这里替换为实际的API调用
      // this.$axios.put(`/api/ratings/${row.sid}`, row).then(response => {
      //   row.isEditing = false;
      //   ElMessage.success('更新评分成功');
      // }).catch(error => {
      //   console.error('更新评分失败:', error);
      //   ElMessage.error('更新评分失败');
      // });

      // 模拟保存
      row.isEditing = false;
      delete row._originalData; // 删除原始数据
      ElMessage.success('更新评分成功');
    },

    // 删除行
    deleteRow(row) {
      this.$confirm('此操作将永久删除该评分, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里替换为实际的API调用
        // this.$axios.delete(`/api/ratings/${row.sid}`).then(response => {
        //   const index = this.ratingData.findIndex(item => item.sid === row.sid);
        //   if (index !== -1) {
        //     this.ratingData.splice(index, 1);
        //   }
        //   ElMessage.success('删除评分成功');
        // }).catch(error => {
        //   console.error('删除评分失败:', error);
        //   ElMessage.error('删除评分失败');
        // });

        // 模拟删除
        const index = this.ratingData.findIndex(item => item.sid === row.sid);
        if (index !== -1) {
          this.ratingData.splice(index, 1);
        }
        ElMessage.success('删除评分成功');
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
          { value: '课程互助', label: '课程互助' },
          { value: '校园活动', label: '校园活动' },
          { value: '失物招领', label: '失物招领' },
          { value: '二手交易', label: '二手交易' },
          { value: '学习讨论', label: '学习讨论' },
          { value: '校园问题', label: '校园问题' }
        ];
      }, 300);
    },

    // 图片上传成功处理
    handleImageSuccess(response, file, target) {
      if (response && response.url) {
        target.image = response.url;
      } else if (file && file.response && file.response.url) {
        target.image = file.response.url;
      } else if (file && file.url) {
        target.image = file.url;
      } else if (file && file.raw) {
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