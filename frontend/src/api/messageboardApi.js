import api from './index';
import { DEBUG_MODE } from './index';
import { MOCK_DATA, getMockResponse } from './mockData';

// 留言板相关 API
export default {
  // 获取留言列表
  getMessages: () => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的留言列表数据");
      return getMockResponse(MOCK_DATA.messages);
    }
    return api.get('/api/message/get-all-messages');
  },

  // 获取留言详情
  getMessageDetail: (id) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的留言详情数据");
      const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
      return getMockResponse(message || MOCK_DATA.messages[0]);
    }
    return api.get(`/api/message/get-message-by-id/${id}`);
  },

  // 发布留言
  createMessage: (data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟发布留言");
      const newMessage = {
        mid: MOCK_DATA.messages.length + 1,
        uid: 1001, // 模拟用户ID
        title: data.title,
        content: data.content,
        tag: data.tag,
        time: Date.now(),
        praise: 0,
        isLiked: false,
        comments: []
      };
      MOCK_DATA.messages.unshift(newMessage);
      return getMockResponse(newMessage);
    }
    return api.post('/api/message/add-message', data);
  },

  // 点赞留言
  likeMessage: (id) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟点赞留言");
      const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
      if (message) {
        message.isLiked = true;
        message.praise += 1;
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false});
    }
    return api.post(`/api/message/like-message/${id}`);
  },

  // 取消点赞留言
  unlikeMessage: (id) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟取消点赞留言");
      const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
      if (message) {
        message.isLiked = false;
        message.praise = Math.max(0, message.praise - 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false});
    }
    return api.delete(`/api/message/unlike-message/${id}`);
  },

  // 获取指定留言的所有评论
  getMessageComments: (id) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的留言评论列表数据");
      const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
      return getMockResponse(message ? message.comments : []);
    }
    return api.get(`/api/message/get-comments-by-mid/${id}`);
  },

  // 评论留言
  commentMessage: (id, data) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟评论留言");
      const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
      if (message) {
        const newComment = {
          cid: Date.now(),
          uid: 1001, // 模拟用户ID
          content: data.content,
          time: Date.now(),
          praise: 0,
          isLiked: false
        };
        message.comments.push(newComment);
        return getMockResponse(newComment);
      }
      return getMockResponse({success: false});
    }    return api.post(`/api/message/add-comment/${id}`, data);
  },

  // 获取指定留言的所有评论
  getMessageComments: (id) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 返回模拟的留言评论列表数据");
      const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
      return getMockResponse(message ? message.comments : []);
    }
    return api.get(`/api/message/get-comments-by-mid/${id}`);
  },

  // 点赞评论
  likeComment: (id) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟点赞评论");
      for (const message of MOCK_DATA.messages) {
        const comment = message.comments.find(c => c.cid === parseInt(id));
        if (comment) {
          comment.isLiked = true;
          comment.praise += 1;
          return getMockResponse({success: true});
        }
      }
      return getMockResponse({success: false});
    }
    return api.post(`/api/message/like-comment/${id}`);
  },
  // 取消点赞评论
  unlikeComment: (id) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟取消点赞评论");
      for (const message of MOCK_DATA.messages) {
        const comment = message.comments.find(c => c.cid === parseInt(id));
        if (comment) {
          comment.isLiked = false;
          comment.praise = Math.max(0, comment.praise - 1);
          return getMockResponse({success: true});
        }
      }
      return getMockResponse({success: false});
    }
    return api.delete(`/api/message/unlike-comment/${id}`);
  },

  // 删除留言
  deleteMessage: (id) => {
    if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
      console.log("DEBUG MODE: 模拟删除留言");
      const index = MOCK_DATA.messages.findIndex(m => m.mid === parseInt(id));
      if (index !== -1) {
        MOCK_DATA.messages.splice(index, 1);
        return getMockResponse({success: true});
      }
      return getMockResponse({success: false});
    }
    return api.delete(`/api/message/delete-message-by-mid/${id}`);
  }
};