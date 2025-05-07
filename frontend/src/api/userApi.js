import api from './index';
import { DEBUG_MODE } from './index';
import { MOCK_DATA, getMockResponse } from './mockData';

// 用户相关 API
export default {
  // 用户登录
  login: (data) => {
    // 调试模式下且没有JWT令牌，模拟登录
    if (DEBUG_MODE && !localStorage.getItem('jwt')) {
      console.log("DEBUG MODE: 模拟用户登录");
      const { phone, password } = data;
      
      // 校验手机号和密码
      if (!phone || phone.length !== 11) {
        return Promise.resolve({
          data: {
            code: 0,
            msg: "手机号无效",
            data: null
          }
        });
      }
      
      if (!password || password.length < 6) {
        return Promise.resolve({
          data: {
            code: 0,
            msg: "密码无效",
            data: null
          }
        });
      }
      
      // 查找用户
      const user = MOCK_DATA.users.find(u => u.phone === phone);
      const correctPassword = MOCK_DATA.userPasswords[phone];
      
      if (!user) {
        return Promise.resolve({
          data: {
            code: 0,
            msg: "用户不存在",
            data: null
          }
        });
      }
      
      if (password !== correctPassword) {
        return Promise.resolve({
          data: {
            code: 0,
            msg: "密码错误",
            data: null
          }
        });
      }
      
      // 登录成功，生成模拟JWT令牌
      const token = `mock-jwt-token-${Date.now()}`;
      localStorage.setItem('jwt', token);
      
      // 创建符合后端格式的用户数据
      const userData = {
        uid: user.uid,
        permission: user.permission,
        phone: user.phone,
        wallet: user.wallet,
        nickname: user.name, // 后端使用nickname字段
        gender: user.gender,
        email: user.email,
        profile: user.profile,
        image: user.profile  // 后端使用image字段存储头像
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      return getMockResponse(userData);
    }
    
    return api.post('/api/user/login', data);
  },
  
  // 用户注册
  register: (data) => {
    // 调试模式下且没有JWT令牌，模拟注册
    if (DEBUG_MODE && !localStorage.getItem('jwt')) {
      console.log("DEBUG MODE: 模拟用户注册");
      const { phone, password, nickname, permission } = data;
      
      // 校验手机号和密码
      if (!phone || phone.length !== 11) {
        return Promise.resolve({
          data: {
            code: 0,
            msg: "手机号无效",
            data: null
          }
        });
      }
      
      if (!password || password.length < 6) {
        return Promise.resolve({
          data: {
            code: 0,
            msg: "密码无效",
            data: null
          }
        });
      }
      
      // 检查用户是否已存在
      const existingUser = MOCK_DATA.users.find(u => u.phone === phone);
      if (existingUser) {
        return Promise.resolve({
          data: {
            code: 0,
            msg: "用户已存在",
            data: null
          }
        });
      }
      
      // 创建新用户，符合后端的数据格式
      const newUser = {
        uid: MOCK_DATA.users.length + 10000, // 确保uid不重复
        nickname: nickname || `用户${phone.substring(7)}`,
        phone,
        email: data.email || "",
        profile: "",
        image: `https://via.placeholder.com/200x200?text=User${phone.substring(7)}`,
        gender: data.gender || 0,
        wallet: 0,
        permission: permission || 1, // 普通用户
        registerTime: Date.now()
      };
      
      // 添加用户和密码
      MOCK_DATA.users.push(newUser);
      MOCK_DATA.userPasswords[phone] = password;
      
      return Promise.resolve({
        data: {
          code: 1,
          msg: "注册成功",
          data: null
        }
      });
    }
    
    return api.post('/api/user/register', data);
  },
  
  // 更新用户信息
  updateUser: (data) => {
    // 调试模式下且没有JWT令牌，模拟更新用户信息
    if (DEBUG_MODE && !localStorage.getItem('jwt')) {
      console.log("DEBUG MODE: 模拟更新用户信息");
      const { uid, phone } = data;
      
      // 查找用户
      const userIndex = MOCK_DATA.users.findIndex(u => u.phone === phone || u.uid === uid);
      if (userIndex === -1) {
        return Promise.resolve({
          data: {
            code: 0,
            msg: "用户不存在",
            data: null
          }
        });
      }
      
      // 更新用户信息，处理字段映射
      const updatedUser = {
        ...MOCK_DATA.users[userIndex]
      };
      
      // 处理字段映射
      if (data.nickname) updatedUser.name = data.nickname;
      if (data.image) updatedUser.profile = data.image;
      
      // 其他字段直接复制
      if (data.password) MOCK_DATA.userPasswords[phone] = data.password;
      if (data.email) updatedUser.email = data.email;
      if (data.gender) updatedUser.gender = data.gender;
      if (data.profile) updatedUser.profile = data.profile;
      
      MOCK_DATA.users[userIndex] = updatedUser;
      
      // 如果是当前登录用户，更新本地存储
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.uid === updatedUser.uid) {
        // 转换为后端格式
        const userData = {
          uid: updatedUser.uid,
          permission: updatedUser.permission,
          phone: updatedUser.phone,
          wallet: updatedUser.wallet,
          nickname: updatedUser.name,
          gender: updatedUser.gender,
          email: updatedUser.email,
          profile: updatedUser.profile,
          image: updatedUser.profile
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }
      
      return getMockResponse(updatedUser);
    }
    
    return api.post('/api/user/update', data);
  },

  // 获取用户信息
  getUserInfo: (uid) => {
    // 调试模式下且没有JWT令牌，返回模拟用户数据
    if (DEBUG_MODE && !localStorage.getItem('jwt')) {
      console.log("DEBUG MODE: 返回模拟用户数据");
      
      // 如果存在本地用户信息，优先返回
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.uid) {
        return getMockResponse(currentUser);
      }
      
      // 否则根据uid查找用户
      if (uid) {
        const user = MOCK_DATA.users.find(u => u.uid === parseInt(uid));
        if (user) {
          // 转换为后端格式
          const userData = {
            uid: user.uid,
            permission: user.permission,
            phone: user.phone,
            wallet: user.wallet,
            nickname: user.name,
            gender: user.gender,
            email: user.email,
            profile: user.profile,
            image: user.profile
          };
          return getMockResponse(userData);
        }
      }
      
      // 都没有就返回第一个用户
      const defaultUser = MOCK_DATA.users[0];
      const userData = {
        uid: defaultUser.uid,
        permission: defaultUser.permission,
        phone: defaultUser.phone,
        wallet: defaultUser.wallet,
        nickname: defaultUser.name,
        gender: defaultUser.gender,
        email: defaultUser.email,
        profile: defaultUser.profile,
        image: defaultUser.profile
      };
      return getMockResponse(userData);
    }
    
    return api.get(`/api/user/info${uid ? `/${uid}` : ''}`);
  },

  // 退出登录
  logout: () => {
    // 调试模式下，清除本地存储
    if (DEBUG_MODE) {
      console.log("DEBUG MODE: 用户退出登录");
      localStorage.removeItem('jwt');
      localStorage.removeItem('currentUser');
      return Promise.resolve({
        data: {
          code: 1,
          msg: "退出成功",
          data: null
        }
      });
    }
    
    return api.post('/api/user/logout');
  },

  // 管理员登录
  adminLogin: (data) => {
    // 调试模式下且没有JWT令牌，模拟管理员登录
    if (DEBUG_MODE && !localStorage.getItem('jwt')) {
      console.log("DEBUG MODE: 模拟管理员登录");
      const { phone, password } = data;
      
      // 查找管理员用户
      const admin = MOCK_DATA.users.find(u => u.phone === phone && u.permission === 2);
      const correctPassword = MOCK_DATA.userPasswords[phone];
      
      if (!admin) {
        return Promise.resolve({
          data: {
            code: 0,
            msg: "管理员不存在",
            data: null
          }
        });
      }
      
      if (password !== correctPassword) {
        return Promise.resolve({
          data: {
            code: 0,
            msg: "密码错误",
            data: null
          }
        });
      }
      
      // 登录成功，生成模拟JWT令牌
      const token = `mock-admin-jwt-token-${Date.now()}`;
      localStorage.setItem('jwt', token);
      
      // 转换为后端格式
      const adminData = {
        uid: admin.uid,
        permission: admin.permission,
        phone: admin.phone,
        wallet: admin.wallet,
        nickname: admin.name,
        gender: admin.gender,
        email: admin.email,
        profile: admin.profile,
        image: admin.profile
      };
      localStorage.setItem('currentAdmin', JSON.stringify(adminData));
      
      return getMockResponse(adminData);
    }
    
    return api.post('/api/user/admin-login', data);
  }
};