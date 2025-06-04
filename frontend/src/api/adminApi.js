import api from './index';
import { DEBUG_MODE } from './index';
import { MOCK_DATA, getMockResponse } from './mockData';

// 管理员相关 API
export default {
  // 获取所有用户
  getAllUsers: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的所有用户数据");
      return getMockResponse(MOCK_DATA.users);
    }
    return api.get('/api/user/get-all-users');
  },

  // 删除用户
  deleteUser: (uid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟删除用户");
      const index = MOCK_DATA.users.findIndex(u => u.uid === parseInt(uid));
      if (index !== -1) {
        MOCK_DATA.users.splice(index, 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false, message: '用户不存在'});
    }
    return api.delete(`/api/user/delete-user-by-uid/${uid}`);
  },
  // 更新用户信息（管理员权限）
  updateUser: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员更新用户信息");
      const userIndex = MOCK_DATA.users.findIndex(u => u.uid === data.uid);
      if (userIndex === -1) {
        return getMockResponse({success: false, message: '用户不存在'});
      }
      
      // 更新用户信息
      const updatedUser = {
        ...MOCK_DATA.users[userIndex],
        ...data
      };
      
      MOCK_DATA.users[userIndex] = updatedUser;
      return getMockResponse({success: true, data: updatedUser});
    }
    return api.post('/api/user/update', data);
  },

  // 创建新用户（管理员权限）
  createUser: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员创建用户");
      // 检查手机号是否已存在
      const existingUser = MOCK_DATA.users.find(u => u.phone === data.phone);
      if (existingUser) {
        return getMockResponse({success: false, message: '手机号已存在'});
      }
      
      // 创建新用户
      const newUser = {
        uid: Math.max(...MOCK_DATA.users.map(u => u.uid)) + 1,
        phone: data.phone,
        password: data.password,
        wallet: data.wallet || 0,
        nickname: data.nickname || `用户${data.phone.substring(7)}`,
        gender: data.gender || 0,
        email: data.email || '',
        profile: data.profile || '',
        image: data.image || '',
        permission: data.permission || 1,
      };
      
      MOCK_DATA.users.push(newUser);
      return getMockResponse({success: true, data: newUser});
    }
    return api.post('/api/user/admin-create', data);
  },

  // 获取所有商品
  getAllProducts: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的所有商品数据");
      return getMockResponse(MOCK_DATA.products);
    }
    return api.get('/api/good/get-all-goods');
  },

  // 获取所有任务
  getAllTasks: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的所有任务数据");
      return getMockResponse(MOCK_DATA.tasks);
    }
    return api.get('/api/task/get-all-tasks');
  },

  // 获取所有评分
  getAllRatings: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的所有评分数据");
      return getMockResponse(MOCK_DATA.ratings);
    }
    return api.get('/api/score/get-all-scores');
  },

  // 获取所有留言
  getAllMessages: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的所有留言数据");
      return getMockResponse(MOCK_DATA.messages);
    }
    return api.get('/api/message/get-all-messages');
  },

  // 创建任务（管理员权限）
  createTask: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员创建任务");
      // 创建新任务
      const newTask = {
        tid: Math.max(...MOCK_DATA.tasks.map(t => t.tid)) + 1,
        uid: data.uid || 101,
        name: data.name,
        money: data.money || 0,
        contact: data.contact || '',
        details: data.details || '',
        status: data.status || 0,
        tag: data.tag || '',
        time: data.time || Date.now()
      };
      
      MOCK_DATA.tasks.push(newTask);
      return getMockResponse({success: true, data: newTask});
    }
    return api.post('/api/task/add-task', data);
  },

  // 更新任务（管理员权限）
  updateTask: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员更新任务");
      const taskIndex = MOCK_DATA.tasks.findIndex(t => t.tid === data.tid);
      if (taskIndex === -1) {
        return getMockResponse({success: false, message: '任务不存在'});
      }
      
      // 更新任务信息
      MOCK_DATA.tasks[taskIndex] = {
        ...MOCK_DATA.tasks[taskIndex],
        ...data
      };
      
      return getMockResponse({success: true, data: MOCK_DATA.tasks[taskIndex]});
    }
    return api.post('/api/task/update-task', data);
  },
  // 删除任务（管理员权限）
  deleteTask: (tid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员删除任务");
      const index = MOCK_DATA.tasks.findIndex(t => t.tid === parseInt(tid));
      if (index !== -1) {
        MOCK_DATA.tasks.splice(index, 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false, message: '任务不存在'});
    }
    return api.delete(`/api/task/delete-tasks-by-tid/${tid}`);
  },

  // 创建评分（管理员权限）
  createRating: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员创建评分");
      // 创建新评分
      const newRating = {
        sid: Math.max(...MOCK_DATA.ratings.map(r => r.sid), 0) + 1,
        tag: data.tag || '',
        num: data.num || 0,
        goal: data.goal || '',
        intro: data.intro || '',
        image: data.image || '',
        score: data.score || 0
      };
      
      MOCK_DATA.ratings.push(newRating);
      return getMockResponse({success: true, data: newRating});
    }
    return api.post('/api/score/add-score', data);
  },

  // 更新评分（管理员权限）
  updateRating: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员更新评分");
      const ratingIndex = MOCK_DATA.ratings.findIndex(r => r.sid === data.sid);
      if (ratingIndex === -1) {
        return getMockResponse({success: false, message: '评分不存在'});
      }
      
      // 更新评分信息
      MOCK_DATA.ratings[ratingIndex] = {
        ...MOCK_DATA.ratings[ratingIndex],
        ...data
      };
      
      return getMockResponse({success: true, data: MOCK_DATA.ratings[ratingIndex]});
    }
    return api.post('/api/score/update-score', data);
  },

  // 删除评分（管理员权限）
  deleteRating: (sid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员删除评分");
      const index = MOCK_DATA.ratings.findIndex(r => r.sid === parseInt(sid));
      if (index !== -1) {
        MOCK_DATA.ratings.splice(index, 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false, message: '评分不存在'});
    }
    return api.delete(`/api/score/delete-score-by-sid/${sid}`);
  },
    // 获取评分标签列表
  getRatingTags: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的评分标签数据");
      const uniqueTags = [...new Set(MOCK_DATA.ratings.map(item => item.tag))];
      return getMockResponse(uniqueTags);
    }
    return api.get('/api/score/get-score-tags');
  },
  
  // 创建商品（管理员权限）
  createProduct: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员创建商品");
      // 创建新商品
      const newProduct = {
        gid: Math.max(...MOCK_DATA.products.map(p => p.gid), 0) + 1,
        uid: data.uid || 101,
        price: data.price || 0,
        name: data.name || '',
        image: data.image || '',
        tag: data.tag || 1,
        intro: data.intro || '',
        quantity: data.quantity || 0,
        sales: data.sales || 0,
        time: data.time || Date.now()
      };
      
      MOCK_DATA.products.push(newProduct);
      return getMockResponse({success: true, data: newProduct});
    }
    return api.post('/api/good/add-good', data);
  },

  // 更新商品（管理员权限）
  updateProduct: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员更新商品");
      const productIndex = MOCK_DATA.products.findIndex(p => p.gid === data.gid);
      if (productIndex === -1) {
        return getMockResponse({success: false, message: '商品不存在'});
      }
      
      // 更新商品信息
      MOCK_DATA.products[productIndex] = {
        ...MOCK_DATA.products[productIndex],
        ...data
      };
      
      return getMockResponse({success: true, data: MOCK_DATA.products[productIndex]});
    }
    return api.post('/api/good/update-good', data);
  },

  // 删除商品（管理员权限）
  deleteProduct: (gid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员删除商品");
      const index = MOCK_DATA.products.findIndex(p => p.gid === parseInt(gid));
      if (index !== -1) {
        MOCK_DATA.products.splice(index, 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false, message: '商品不存在'});
    }
    return api.delete(`/api/good/delete-good-by-gid/${gid}`);
  },
  
  // 获取商品标签列表
  getProductTags: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的商品标签数据");
      const uniqueTags = [...new Set(MOCK_DATA.products.map(item => item.tag))];
      // 返回标签对象列表
      const tagList = [
        {value: 1, label: '二手电子'},
        {value: 2, label: '教材书籍'},
        {value: 3, label: '生活用品'},
        {value: 4, label: '服装鞋帽'},
        {value: 5, label: '文具用品'},
        {value: 6, label: '代步工具'}
      ];
      return getMockResponse(tagList);
    }
    return api.get('/api/good/get-good-tags');
  },
  
  // 创建留言（管理员权限）
  createMessage: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员创建留言");
      // 创建新留言
      const newMessage = {
        mid: Math.max(...MOCK_DATA.messages.map(m => m.mid), 0) + 1,
        uid: data.uid || 101,
        title: data.title || '',
        content: data.content || '',
        praise: data.praise || 0,
        tag: data.tag || '',
        time: data.time || Date.now()
      };
      
      MOCK_DATA.messages.push(newMessage);
      return getMockResponse({success: true, data: newMessage});
    }
    return api.post('/api/message/add-message', data);
  },

  // 更新留言（管理员权限）
  updateMessage: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员更新留言");
      const messageIndex = MOCK_DATA.messages.findIndex(m => m.mid === data.mid);
      if (messageIndex === -1) {
        return getMockResponse({success: false, message: '留言不存在'});
      }
      
      // 更新留言信息
      MOCK_DATA.messages[messageIndex] = {
        ...MOCK_DATA.messages[messageIndex],
        ...data
      };
      
      return getMockResponse({success: true, data: MOCK_DATA.messages[messageIndex]});
    }
    return api.post('/api/message/update-message', data);
  },

  // 删除留言（管理员权限）
  deleteMessage: (mid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员删除留言");
      const index = MOCK_DATA.messages.findIndex(m => m.mid === parseInt(mid));
      if (index !== -1) {
        MOCK_DATA.messages.splice(index, 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false, message: '留言不存在'});
    }
    return api.delete(`/api/message/delete-message-by-mid/${mid}`);
  },
  
  // 获取留言标签列表
  getMessageTags: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的留言标签数据");
      const uniqueTags = [...new Set(MOCK_DATA.messages.map(item => item.tag))];
      return getMockResponse(uniqueTags.filter(tag => tag));
    }
    return api.get('/api/message/get-message-tags');
  },

  // 创建留言评论（管理员权限）
  createMessageComment: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员创建留言评论");
      // 创建新留言评论
      const newComment = {
        cid: Math.max(...MOCK_DATA.messageComments.map(c => c.cid), 0) + 1,
        mid: data.mid || 1,
        uid: data.uid || 101,
        content: data.content || '',
        time: data.time || Date.now()
      };
      
      MOCK_DATA.messageComments.push(newComment);
      return getMockResponse({success: true, data: newComment});
    }
    return api.post('/api/message/add-comment', data);
  },

  // 更新留言评论（管理员权限）
  updateMessageComment: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员更新留言评论");
      const commentIndex = MOCK_DATA.messageComments.findIndex(c => c.cid === data.cid);
      if (commentIndex === -1) {
        return getMockResponse({success: false, message: '评论不存在'});
      }
      
      // 更新评论信息
      MOCK_DATA.messageComments[commentIndex] = {
        ...MOCK_DATA.messageComments[commentIndex],
        ...data
      };
      
      return getMockResponse({success: true, data: MOCK_DATA.messageComments[commentIndex]});
    }
    return api.post('/api/message/update-comment', data);
  },

  // 删除留言评论（管理员权限）
  deleteMessageComment: (cid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员删除留言评论");
      const index = MOCK_DATA.messageComments.findIndex(c => c.cid === parseInt(cid));
      if (index !== -1) {
        MOCK_DATA.messageComments.splice(index, 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false, message: '评论不存在'});
    }
    return api.delete(`/api/message/delete-comment-by-cid/${cid}`);
  },
  
  // 创建评分评论（管理员权限）
  createRatingComment: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员创建评分评论");
      // 创建新评分评论
      const newComment = {
        cid: Math.max(...MOCK_DATA.ratingComments.map(c => c.cid), 0) + 1,
        sid: data.sid || 1,
        uid: data.uid || 101,
        content: data.content || '',
        time: data.time || Date.now()
      };
      
      MOCK_DATA.ratingComments.push(newComment);
      return getMockResponse({success: true, data: newComment});
    }
    return api.post('/api/score/add-comment', data);
  },

  // 更新评分评论（管理员权限）
  updateRatingComment: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员更新评分评论");
      const commentIndex = MOCK_DATA.ratingComments.findIndex(c => c.cid === data.cid);
      if (commentIndex === -1) {
        return getMockResponse({success: false, message: '评论不存在'});
      }
      
      // 更新评论信息
      MOCK_DATA.ratingComments[commentIndex] = {
        ...MOCK_DATA.ratingComments[commentIndex],
        ...data
      };
      
      return getMockResponse({success: true, data: MOCK_DATA.ratingComments[commentIndex]});
    }
    return api.post('/api/score/update-comment', data);
  },

  // 删除评分评论（管理员权限）
  deleteRatingComment: (cid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员删除评分评论");
      const index = MOCK_DATA.ratingComments.findIndex(c => c.cid === parseInt(cid));
      if (index !== -1) {
        MOCK_DATA.ratingComments.splice(index, 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false, message: '评论不存在'});
    }
    return api.delete(`/api/score/delete-comment-by-cid/${cid}`);
  },
  
  // 更新任务状态（管理员权限）
  updateTaskStatus: (tid, status) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员更新任务状态");
      const taskIndex = MOCK_DATA.tasks.findIndex(t => t.tid === tid);
      if (taskIndex === -1) {
        return getMockResponse({success: false, message: '任务不存在'});
      }
      
      // 更新任务状态
      MOCK_DATA.tasks[taskIndex].status = status;
      return getMockResponse({success: true, data: MOCK_DATA.tasks[taskIndex]});
    }
    return api.post('/api/task/update-task-status', { tid, status });
  },
  
  // 获取所有订单
  getAllOrders: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的所有订单数据");
      return getMockResponse(MOCK_DATA.orders);
    }
    return api.get('/api/good/get-all-goodsbuy');
  },
  
  // 更新订单（管理员权限）
  updateOrder: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员更新订单");
      const orderIndex = MOCK_DATA.orders.findIndex(o => o.oid === data.oid);
      if (orderIndex === -1) {
        return getMockResponse({success: false, message: '订单不存在'});
      }
      
      // 更新订单信息
      MOCK_DATA.orders[orderIndex] = {
        ...MOCK_DATA.orders[orderIndex],
        ...data
      };
      
      return getMockResponse({success: true, data: MOCK_DATA.orders[orderIndex]});
    }
    return api.post('/api/order/update-order', data);
  },
  
  // 删除订单（管理员权限）
  deleteOrder: (oid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员删除订单");
      const index = MOCK_DATA.orders.findIndex(o => o.oid === parseInt(oid));
      if (index !== -1) {
        MOCK_DATA.orders.splice(index, 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false, message: '订单不存在'});
    }
    return api.delete(`/api/order/delete-order-by-oid/${oid}`);
  },
  
  // 获取所有交易
  getAllTransactions: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的所有交易数据");
      return getMockResponse(MOCK_DATA.transactions);
    }
    return api.get('/api/transaction/get-all-transactions');
  },
  
  // 更新交易（管理员权限）
  updateTransaction: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员更新交易");
      const txIndex = MOCK_DATA.transactions.findIndex(tx => tx.txid === data.txid);
      if (txIndex === -1) {
        return getMockResponse({success: false, message: '交易不存在'});
      }
      
      // 更新交易信息
      MOCK_DATA.transactions[txIndex] = {
        ...MOCK_DATA.transactions[txIndex],
        ...data
      };
      
      return getMockResponse({success: true, data: MOCK_DATA.transactions[txIndex]});
    }
    return api.post('/api/transaction/update-transaction', data);
  },
  
  // 删除交易（管理员权限）
  deleteTransaction: (txid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员删除交易");
      const index = MOCK_DATA.transactions.findIndex(tx => tx.txid === parseInt(txid));
      if (index !== -1) {
        MOCK_DATA.transactions.splice(index, 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false, message: '交易不存在'});
    }
    return api.delete(`/api/transaction/delete-transaction-by-txid/${txid}`);
  },
  
  // 获取所有留言评论
  getAllMessageComments: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的所有留言评论数据");
      return getMockResponse(MOCK_DATA.messageComments);
    }
    return api.get('/api/message/get-all-comments');
  },
  
  // 根据留言ID获取评论
  getMessageCommentsByMid: (mid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的指定留言评论数据");
      const comments = MOCK_DATA.messageComments.filter(c => c.mid === parseInt(mid));
      return getMockResponse(comments);
    }
    return api.get(`/api/message/get-comments-by-mid/${mid}`);
  },
  
  // 获取所有评分评论
  getAllRatingComments: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的所有评分评论数据");
      return getMockResponse(MOCK_DATA.ratingComments);
    }
    return api.get('/api/score/get-all-comments');
  },
  
  // 根据评分ID获取评论
  getRatingCommentsBySid: (sid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的指定评分评论数据");
      const comments = MOCK_DATA.ratingComments.filter(c => c.sid === parseInt(sid));
      return getMockResponse(comments);
    }
    return api.get(`/api/score/get-comments-by-sid/${sid}`);
  },

  // 获取所有任务状态信息
  getAllTasksStatus: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的所有任务状态数据");
      return getMockResponse(MOCK_DATA.taskStatus);
    }
    return api.get('/api/task/get-all-task-status');
  },
  
  // 更新任务状态信息
  updateTaskStatus: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员更新任务状态");
      const statusIndex = MOCK_DATA.taskStatus.findIndex(s => s.tid === data.tid && s.uid === data.uid);
      if (statusIndex === -1) {
        // 如果不存在，则添加新记录
        const newStatus = {
          ...data,
          time: data.time || Date.now()
        };
        MOCK_DATA.taskStatus.push(newStatus);
        return getMockResponse({success: true, data: newStatus});
      }
      
      // 更新任务状态信息
      MOCK_DATA.taskStatus[statusIndex] = {
        ...MOCK_DATA.taskStatus[statusIndex],
        ...data
      };
      
      return getMockResponse({success: true, data: MOCK_DATA.taskStatus[statusIndex]});
    }
    return api.post('/api/task/update-task-status', data);
  },
  
  // 分配任务给用户
  assignTask: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员分配任务");
      // 创建新任务状态记录
      const newStatus = {
        tid: data.tid,
        uid: data.uid,
        status: data.status || 0,
        notes: data.notes || '',
        time: data.time || Date.now()
      };
      
      MOCK_DATA.taskStatus.push(newStatus);
      return getMockResponse({success: true, data: newStatus});
    }
    return api.post('/api/task/assign-task', data);
  },
  
  // 删除任务状态记录
  deleteTaskStatus: (tid, uid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员删除任务状态记录");
      const index = MOCK_DATA.taskStatus.findIndex(s => s.tid === parseInt(tid) && s.uid === parseInt(uid));
      if (index !== -1) {
        MOCK_DATA.taskStatus.splice(index, 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false, message: '任务状态记录不存在'});
    }
    return api.delete(`/api/task/delete-task-status/${tid}/${uid}`);
  },

  // 创建订单（管理员权限）
  createOrder: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员创建订单");
      // 创建新订单
      const newOrder = {
        oid: Math.max(...MOCK_DATA.orders.map(o => o.oid), 10000) + 1,
        uid: data.uid,
        gid: data.gid,
        sum: data.sum,
        number: data.number,
        status: data.status || 0,
        notes: data.notes || '',
        time: data.time || Date.now()
      };
      
      MOCK_DATA.orders.push(newOrder);
      return getMockResponse({success: true, data: newOrder});
    }
    return api.post('/api/order/add-order', data);
  },
  // 根据ID获取用户信息
  getUserById: (uid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的用户信息");
      const user = MOCK_DATA.users.find(u => u.uid === parseInt(uid));
      if (user) {
        return getMockResponse(user);
      }
      return getMockResponse(null, 0, '用户不存在');
    }
    return api.get(`/api/user/get-user-by-uid/${uid}`);
  },
  
  // 获取商品标签
  getProductTags: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的商品标签数据");
      const tags = [
        {value: 1, label: '二手电子'},
        {value: 2, label: '教材书籍'},
        {value: 3, label: '生活用品'},
        {value: 4, label: '服装鞋帽'},
        {value: 5, label: '文具用品'},
        {value: 6, label: '代步工具'}
      ];
      return getMockResponse(tags);
    }
    return api.get('/api/good/get-tags');
  },

  // 创建商品（管理员权限）
  createProduct: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员创建商品");
      // 创建新商品
      const newProduct = {
        gid: Math.max(...MOCK_DATA.products.map(p => p.gid), 0) + 1,
        uid: data.uid,
        price: data.price,
        name: data.name,
        image: data.image || '',
        tag: data.tag,
        intro: data.intro || '',
        quantity: data.quantity,
        sales: data.sales || 0,
        time: data.time || Date.now()
      };
      
      MOCK_DATA.products.push(newProduct);
      return getMockResponse({success: true, data: newProduct});
    }
    return api.post('/api/good/add-good', data);
  },

  // 更新商品（管理员权限）
  updateProduct: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员更新商品");
      const productIndex = MOCK_DATA.products.findIndex(p => p.gid === data.gid);
      if (productIndex === -1) {
        return getMockResponse({success: false, message: '商品不存在'});
      }
      
      // 更新商品信息
      MOCK_DATA.products[productIndex] = {
        ...MOCK_DATA.products[productIndex],
        ...data
      };
      
      return getMockResponse({success: true, data: MOCK_DATA.products[productIndex]});
    }
    return api.post('/api/good/update-good', data);
  },

  // 删除商品（管理员权限）
  deleteProduct: (gid) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟管理员删除商品");
      const index = MOCK_DATA.products.findIndex(p => p.gid === parseInt(gid));
      if (index !== -1) {
        MOCK_DATA.products.splice(index, 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false, message: '商品不存在'});
    }
    return api.delete(`/api/good/delete-good-by-gid/${gid}`);
  },
};