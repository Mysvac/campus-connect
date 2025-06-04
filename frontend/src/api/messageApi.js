import api from './index';
import { DEBUG_MODE } from './index';
import { MOCK_DATA, getMockResponse } from './mockData';

// 留言板相关 API
export default {
    // 获取所有留言
    getMessages: () => {
        // 调试模式下且没有JWT令牌，返回模拟数据
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的留言列表数据");
            return getMockResponse(MOCK_DATA.messages);
        }
        return api.get('/api/message/get-all-messages');
    },
    
    // 获取留言详情
    getMessageDetail: (id) => {
        // 调试模式下且没有JWT令牌，返回模拟数据
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的留言详情数据");
            const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
            return getMockResponse(message || MOCK_DATA.messages[0]);
        }
        return api.get(`/api/message/get-message-by-mid/${id}`);
    },
      // 发布新留言或更新现有留言
    createMessage: (data) => {
        // 调试模式下且没有JWT令牌，模拟创建或更新留言
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            if (data.mid) {
                // 更新现有留言
                console.log("DEBUG MODE: 模拟更新留言");
                const messageIndex = MOCK_DATA.messages.findIndex(m => m.mid === parseInt(data.mid));
                if (messageIndex !== -1) {
                    // 保留原有的时间戳、点赞数和评论
                    const originalMessage = MOCK_DATA.messages[messageIndex];
                    MOCK_DATA.messages[messageIndex] = {
                        ...originalMessage,
                        title: data.title,
                        content: data.content,
                        tag: data.tag
                        // 保留 mid, uid, time, praise, comments 等原有数据
                    };
                    return getMockResponse(MOCK_DATA.messages[messageIndex]);
                } else {
                    return getMockResponse({success: false, msg: "留言不存在"});
                }
            } else {
                // 创建新留言
                console.log("DEBUG MODE: 模拟创建新留言");
                const newMessage = {
                    mid: Math.max(...MOCK_DATA.messages.map(m => m.mid || 0)) + 1,
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
        }        return api.post('/api/message/add-message', data);
    },

    // 更新留言 - 使用新的update-message接口
    updateMessage: (data) => {
        // 调试模式下且没有JWT令牌，模拟更新留言
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟更新留言");
            const messageIndex = MOCK_DATA.messages.findIndex(m => m.mid === parseInt(data.mid));
            if (messageIndex !== -1) {
                // 保留原有的时间戳、点赞数和评论
                const originalMessage = MOCK_DATA.messages[messageIndex];
                MOCK_DATA.messages[messageIndex] = {
                    ...originalMessage,
                    title: data.title,
                    content: data.content,
                    tag: data.tag
                    // 保留 mid, uid, time, praise, comments 等原有数据
                };
                return getMockResponse(MOCK_DATA.messages[messageIndex]);
            } else {
                return getMockResponse({success: false, msg: "留言不存在"});
            }
        }
        return api.post('/api/message/update-message', data);
    },
    
    // 点赞留言
    likeMessage: (id) => {
        // 调试模式下且没有JWT令牌，模拟点赞
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟点赞留言");
            const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
            if (message) {
                message.isLiked = true;
                message.praise += 1;
            }
            return getMockResponse({success: true});
        }
        return api.post(`/api/message/like-message/${id}`);
    },
    
    // 取消点赞留言
    unlikeMessage: (id) => {
        // 调试模式下且没有JWT令牌，模拟取消点赞
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟取消点赞留言");
            const message = MOCK_DATA.messages.find(m => m.mid === parseInt(id));
            if (message) {
                message.isLiked = false;
                message.praise = Math.max(0, message.praise - 1);
            }
            return getMockResponse({success: true});
        }
        return api.delete(`/api/message/unlike-message/${id}`);
    },
    
    // 评论留言
    commentMessage: (id, data) => {
        // 调试模式下且没有JWT令牌，模拟评论
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
        }
        return api.post(`/api/message/add-comment`, { ...data, mid: id });
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
        // 调试模式下且没有JWT令牌，模拟点赞评论
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
        // 调试模式下且没有JWT令牌，模拟取消点赞评论
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
    },    // 删除留言
    deleteMessage: (id) => {
        // 调试模式下且没有JWT令牌，模拟删除留言
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
    },

    // 获取指定用户的所有留言
    getMessagesByUid: (uid) => {
        // 调试模式下且没有JWT令牌，返回模拟数据
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的用户留言列表数据");
            const userMessages = MOCK_DATA.messages.filter(m => m.uid === parseInt(uid));
            return getMockResponse(userMessages);
        }
        return api.get(`/api/message/get-messages-by-uid/${uid}`);
    },

    // 获取指定标签的所有留言
    getMessagesByTag: (tag) => {
        // 调试模式下且没有JWT令牌，返回模拟数据
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的标签留言列表数据");
            const tagMessages = MOCK_DATA.messages.filter(m => m.tag === tag);
            return getMockResponse(tagMessages);
        }
        return api.get(`/api/message/get-messages-by-tag/${tag}`);
    }
};