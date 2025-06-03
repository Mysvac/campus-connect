<template>
  <div class="user-manage-container">
    <!-- 筛选条件和增加按钮容器 -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <!-- 筛选条件 -->
      <div style="display: flex; gap: 10px; align-items: center;">
        <el-select v-model="selectedPermission" placeholder="按权限筛选" clearable size="small">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="perm in permissionOptions" :key="perm.value" :label="perm.label" :value="perm.value"></el-option>
        </el-select>
      </div>
      <!-- 增加按钮 -->
      <el-button type="primary" @click="showAddDialog" size="small" style="margin-left: auto;">增加用户</el-button>
    </div>

    <!-- 用户信息列表 -->
    <div class="table-container">
      <el-table :data="paginatedUsersData" style="width: 100%;" stripe v-loading="isLoading">
        <el-table-column label="用户ID" prop="uid" width="70">
          <template #default="{ row }">
            <span>{{ row.uid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限组" prop="permission" width="80">
          <template #default="{ row }">
            <el-select v-if="row.isEditing" v-model="row.permission" size="small" placeholder="请选择权限">
              <el-option v-for="perm in permissionOptions" :key="perm.value" :label="perm.label" :value="perm.value"></el-option>
            </el-select>
            <el-tag v-else :type="getPermissionType(row.permission)">{{ getPermissionLabel(row.permission) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" width="110">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.phone" size="small" placeholder="手机号" maxlength="11"></el-input>
            <span v-else>{{ row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="密码" prop="password" width="90">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.password" size="small" placeholder="密码" show-password></el-input>
            <span v-else>••••••••</span>
          </template>
        </el-table-column>
        <el-table-column label="余额(分)" prop="wallet" width="80">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model.number="row.wallet" size="small" type="number" placeholder="余额"></el-input>
            <span v-else>{{ row.wallet }}</span>
          </template>
        </el-table-column>
        <el-table-column label="昵称" prop="nickname" width="90">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.nickname" size="small" placeholder="昵称" maxlength="20"></el-input>
            <span v-else>{{ row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" width="70">
          <template #default="{ row }">
            <el-select v-if="row.isEditing" v-model="row.gender" size="small" placeholder="性别">
              <el-option v-for="g in genderOptions" :key="g.value" :label="g.label" :value="g.value"></el-option>
            </el-select>
            <span v-else>{{ getGenderLabel(row.gender) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" width="130">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.email" size="small" placeholder="邮箱" maxlength="32"></el-input>
            <span v-else>{{ row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="简介" prop="profile" min-width="180">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.profile" size="small" placeholder="简介" maxlength="50"></el-input>
            <span v-else>{{ row.profile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="头像" prop="image" width="80">
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
                <el-button size="small" type="primary">上传头像</el-button>
              </el-upload>
              <div v-if="row.image" style="margin-top: 8px;">
                <img :src="row.image" alt="头像" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;" />
                <el-button type="text" @click="row.image = ''" style="margin-left: 5px;">删除</el-button>
              </div>
            </div>
            <div v-else>
              <img v-if="row.image" :src="row.image" alt="头像" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;" />
              <span v-else>无</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
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
          :total="filteredUsersData.length"
      >
      </el-pagination>
    </div>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加新用户" v-model="dialogVisible" width="40%">
      <el-form :model="newUser" label-width="100px" :rules="rules" ref="userForm">
        <el-form-item label="权限组" prop="permission">
          <el-select v-model="newUser.permission" placeholder="请选择权限">
            <el-option v-for="perm in permissionOptions" :key="perm.value" :label="perm.label" :value="perm.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="newUser.phone" placeholder="请输入手机号" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="newUser.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="余额(分)" prop="wallet">
          <el-input v-model.number="newUser.wallet" type="number" placeholder="请输入余额"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="newUser.nickname" placeholder="请输入昵称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="newUser.gender" placeholder="请选择性别">
            <el-option v-for="g in genderOptions" :key="g.value" :label="g.label" :value="g.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="newUser.email" placeholder="请输入邮箱" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="profile">
          <el-input v-model="newUser.profile" placeholder="请输入简介" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="image">
          <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="(res, file) => handleImageSuccess(res, file, newUser)"
              :before-upload="beforeImageUpload"
          >
            <el-button size="small" type="primary">上传头像</el-button>
          </el-upload>
          <div v-if="newUser.image" style="margin-top: 8px;">
            <img :src="newUser.image" alt="头像" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;" />
            <el-button type="text" @click="newUser.image = ''" style="margin-left: 5px;">删除</el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitNewUser">确定</el-button>
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
  name: "UserManage",
  data() {
    return {
      selectedPermission: "",
      usersData: [],
      isLoading: false,
      dialogVisible: false,
      newUser: {
        permission: 1, // 默认为普通用户
        phone: '',
        password: '',
        wallet: 0,
        nickname: '',
        gender: 0, // 默认保密
        email: '',
        profile: '',
        image: ''
      },
      currentPage: 1,
      pageSize: 7,
      permissionOptions: [
        { value: 0, label: '封禁' },
        { value: 1, label: '普通' },
        { value: 2, label: '商家' },
        { value: 3, label: '管理' }
      ],
      genderOptions: [
        { value: 0, label: '保密' },
        { value: 1, label: '男' },
        { value: 2, label: '女' }
      ],
      // 上传相关配置
      uploadUrl: baseURL + 'api/image/upload', // 使用正确的上传API地址
      uploadHeaders: {
        // 根据需要添加请求头，如token
        // 'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      rules: {
        permission: [
          { required: true, message: '请选择权限', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^\d{11}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 32, message: '密码长度应为6-32个字符', trigger: 'blur' }
        ],
        wallet: [
          { required: true, message: '请输入余额', trigger: 'blur' },
          { type: 'number', message: '余额必须为数字', trigger: 'blur' }
        ],
        nickname: [
          { max: 20, message: '昵称长度不能超过20个字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        email: [
          { pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        profile: [
          { max: 50, message: '简介不能超过50个字符', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    filteredUsersData() {
      if (this.selectedPermission === "") {
        return this.usersData;
      }
      return this.usersData.filter(item => item.permission === this.selectedPermission);
    },
    paginatedUsersData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredUsersData.slice(start, end);
    },
  },
  methods: {    // 获取用户列表
    fetchUsers() {
      this.isLoading = true;
      // 使用adminApi获取所有用户
      adminApi.getAllUsers()
        .then(response => {
          console.log('获取用户数据成功:', response);
          if (response.data && response.data.code === 1) {
            // 处理成功的响应，添加isEditing属性
            this.usersData = response.data.data.map(item => {
              // 对于密码，设置为占位符，避免显示真实密码
              return {
                ...item,
                password: '••••••••',
                isEditing: false
              };
            });
          } else {
            // 处理错误响应
            console.error('获取用户数据失败:', response.data?.msg || '未知错误');
            ElMessage.error('获取用户列表失败: ' + (response.data?.msg || '未知错误'));
            
            // 使用空数组
            this.usersData = [];
          }
        })
        .catch(error => {
          console.error('获取用户列表接口调用出错:', error);
          ElMessage.error('获取用户列表失败，请稍后重试');
          this.usersData = [];
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    // 显示添加对话框
    showAddDialog() {
      this.dialogVisible = true;
      // 重置表单
      this.newUser = {
        permission: 1, // 默认为普通用户
        phone: '',
        password: '',
        wallet: 0,
        nickname: '',
        gender: 0, // 默认保密
        email: '',
        profile: '',
        image: ''
      };
      if (this.$refs.userForm) {
        this.$refs.userForm.resetFields();
      }
    },    // 提交新用户
    submitNewUser() {
      if (this.$refs.userForm) {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            this.isLoading = true;
            // 使用adminApi创建用户
            adminApi.createUser(this.newUser)
              .then(response => {
                if (response.data && response.data.code === 1) {
                  ElMessage.success('添加用户成功');
                  this.fetchUsers(); // 重新加载用户列表
                  this.dialogVisible = false;
                } else {
                  // 处理错误响应
                  ElMessage.error('添加用户失败: ' + (response.data?.msg || '未知错误'));
                }
              })
              .catch(error => {
                console.error('添加用户失败:', error);
                ElMessage.error('添加用户失败，请稍后重试');
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
      this.usersData.forEach(item => {
        if (item.uid !== row.uid) {
          item.isEditing = false;
        }
      });
      row.isEditing = true;
      // 保存原始数据，用于取消编辑时恢复
      row._originalData = JSON.parse(JSON.stringify(row));
    },    // 保存行
    saveRow(row) {
      this.isLoading = true;
      // 使用adminApi更新用户
      adminApi.updateUser(row)
        .then(response => {
          if (response.data && response.data.code === 1) {
            row.isEditing = false;
            delete row._originalData; // 删除原始数据
            ElMessage.success('更新用户成功');
          } else {
            // 如果更新失败，回滚到原始数据
            if (row._originalData) {
              Object.assign(row, row._originalData);
            }
            ElMessage.error('更新用户失败: ' + (response.data?.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('更新用户失败:', error);
          // 如果更新失败，回滚到原始数据
          if (row._originalData) {
            Object.assign(row, row._originalData);
          }
          ElMessage.error('更新用户失败，请稍后重试');
        })
        .finally(() => {
          row.isEditing = false;
          delete row._originalData;
          this.isLoading = false;
        });
    },    // 删除行
    deleteRow(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true;
        // 使用adminApi删除用户
        adminApi.deleteUser(row.uid)
          .then(response => {
            if (response.data && response.data.code === 1) {
              // 从列表中移除该用户
              const index = this.usersData.findIndex(item => item.uid === row.uid);
              if (index !== -1) {
                this.usersData.splice(index, 1);
              }
              ElMessage.success('删除用户成功');
            } else {
              ElMessage.error('删除用户失败: ' + (response.data?.msg || '未知错误'));
            }
          })
          .catch(error => {
            console.error('删除用户失败:', error);
            ElMessage.error('删除用户失败，请稍后重试');
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

    // 根据权限获取对应的类型样式
    getPermissionType(permission) {
      const types = ['danger', 'info', 'success', 'warning'];
      return types[permission] || 'info';
    },

    // 根据权限值获取权限名称
    getPermissionLabel(permValue) {
      const perm = this.permissionOptions.find(p => p.value === permValue);
      return perm ? perm.label : `未知权限(${permValue})`;
    },

    // 根据性别值获取性别名称
    getGenderLabel(genderValue) {
      const gender = this.genderOptions.find(g => g.value === genderValue);
      return gender ? gender.label : '未知';
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
            target.image = `https://example.com/avatars/${file.name}`;
          }, 1000);
        }
      }
      ElMessage.success('头像上传成功');
    },

    // 图片上传前验证
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        ElMessage.error('上传头像只能是 JPG/PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        ElMessage.error('上传头像大小不能超过 2MB!');
        return false;
      }
      return isJPG && isLt2M;
    },
  },
  created() {
    this.fetchUsers();
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