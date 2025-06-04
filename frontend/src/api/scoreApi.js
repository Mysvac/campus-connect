import api from './index';
import { DEBUG_MODE } from './index';
import { MOCK_DATA, getMockResponse } from './mockData';

// 评分相关 API
export default {    // 获取评分标签
    getRatingTags: () => {
        console.log("获取评分标签");
        // 提供与实际评分数据一致的标签
        const mockTags = ['课程教学', '学习场所', '餐饮美食', '住宿条件', '运动健身', '校园服务', '校园活动'];
        
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的评分标签数据");
            return getMockResponse(mockTags);
        }
        
        // 由于后端没有专门的API获取标签列表，这里直接返回模拟数据
        // 也可以考虑调用 getRatings API，然后从返回的评分中提取不同的标签
        return getMockResponse(mockTags);
    },
    
    // 获取所有评分
    getRatings: () => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的评分列表数据");
            return getMockResponse(MOCK_DATA.ratings);
        }
        return api.get('/api/score/get-all-scores');
    },

    // 获取评分详情
    getRatingDetail: (id) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的评分详情数据");
            const rating = MOCK_DATA.ratings.find(r => r.rid === parseInt(id));
            return getMockResponse(rating || MOCK_DATA.ratings[0]);
        }
        return api.get(`/api/score/get-score-by-sid/${id}`);
    },    // 上传图片
    uploadImage: (formData) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟上传图片");
            // 模拟返回一个相对路径（不包含host）
            const mockImagePath = `/image/mock-${Date.now()}.jpg`;
            return getMockResponse(mockImagePath);
        }
        return api.post('/api/image/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },    // 添加新评分
    createRating: (data) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟创建新评分");
            // 获取当前用户ID
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const currentUserId = currentUser.uid || 1001; // 默认使用1001
            
            const newRating = {
                rid: MOCK_DATA.ratings.length + 1,
                sid: MOCK_DATA.ratings.length + 1,
                uid: currentUserId, // 使用动态用户ID
                goal: data.goal,
                tag: data.tag,
                intro: data.intro,image: data.image,
                score: data.score,
                num: 0, // 初始参与人数为0
                status: 0,
                time: Date.now(),
                likes: 0,
                isLiked: false,
                comments: []
            };
            MOCK_DATA.ratings.unshift(newRating);
            // 确保返回的数据包含新创建的评分信息，特别是sid
            return getMockResponse(newRating);
        }
        return api.post('/api/score/add-score', data);
    },

    // 更新评分
    updateRating: (data) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟更新评分");
            const rating = MOCK_DATA.ratings.find(r => r.rid === data.rid || r.sid === data.sid);
            if (rating) {
                Object.assign(rating, data);
                return getMockResponse({success: true});
            }
            return getMockResponse({success: false});
        }
        return api.post('/api/score/update-score', data);
    },    // 点赞评分
    likeRating: (id) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟点赞评分");
            const rating = MOCK_DATA.ratings.find(r => r.rid === parseInt(id) || r.sid === parseInt(id));
            if (rating) {
                rating.isLiked = true;
                rating.likes += 1;
                return getMockResponse({success: true});
            }
            return getMockResponse({success: false});
        }
        return api.post(`/api/score/like-score/${id}`);
    },    // 取消点赞评分
    unlikeRating: (id) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟取消点赞评分");
            const rating = MOCK_DATA.ratings.find(r => r.rid === parseInt(id) || r.sid === parseInt(id));
            if (rating) {
                rating.isLiked = false;
                rating.likes = Math.max(0, rating.likes - 1);
                return getMockResponse({success: true});
            }
            return getMockResponse({success: false});
        }
        return api.delete(`/api/score/unlike-score/${id}`);
    },    // 添加评分评论
    commentRating: (id, data) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟评论评分", { id, data });
            // 获取当前用户ID
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const currentUserId = currentUser.uid || 1001; // 默认使用1001
            
            const rating = MOCK_DATA.ratings.find(r => r.rid === parseInt(id) || r.sid === parseInt(id));
            if (rating) {
                const newComment = {
                    cid: Date.now(),
                    uid: currentUserId, // 使用动态用户ID
                    sid: rating.sid || rating.rid,
                    content: data.comment || data.content,
                    comment: data.comment || data.content,
                    score: data.score || 5.0,
                    time: data.time || Date.now(),
                    likes: 0,
                    isLiked: false,
                    userName: currentUser.name || '当前用户', // 使用真实用户名
                    userAvatar: currentUser.avatar || `https://via.placeholder.com/48?text=U${currentUserId}` // 使用真实头像
                };
                rating.comments.push(newComment);
                console.log("DEBUG MODE: 评论已添加到模拟数据", newComment);
                return getMockResponse(newComment);
            }
            console.log("DEBUG MODE: 未找到对应的评分", id);
            return getMockResponse({success: false});
        }
        
        // 构造符合后端 ScoresComment 实体的数据结构
        const commentData = {
            sid: parseInt(id), // 确保是数字类型
            score: data.score || 0,
            comment: data.comment,
            time: data.time || Date.now()
            // uid 会由后端从 session 中获取，不需要前端传递
        };
        
        console.log("API调用 add-comment，数据:", commentData);
        return api.post(`/api/score/add-comment`, commentData);
    },
      // 获取评分的评论
    getRatingComments: (id) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的评分评论数据");
            const rating = MOCK_DATA.ratings.find(r => r.rid === parseInt(id) || r.sid === parseInt(id));
            return getMockResponse(rating ? rating.comments : []);
        }
        return api.get(`/api/score/get-comments-by-sid/${id}`);
    },
      // 点赞评分评论
    likeComment: (id) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟点赞评分评论");
            for (const rating of MOCK_DATA.ratings) {
                const comment = rating.comments.find(c => c.cid === parseInt(id));
                if (comment) {
                    comment.isLiked = true;
                    comment.likes += 1;
                    return getMockResponse({success: true});
                }
            }
            return getMockResponse({success: false});
        }
        return api.post(`/api/score/like-comment/${id}`);
    },
      // 取消点赞评论
    unlikeComment: (id) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟取消点赞评分评论");
            for (const rating of MOCK_DATA.ratings) {
                const comment = rating.comments.find(c => c.cid === parseInt(id));
                if (comment) {
                    comment.isLiked = false;
                    comment.likes = Math.max(0, comment.likes - 1);
                    return getMockResponse({success: true});
                }
            }
            return getMockResponse({success: false});
        }
        return api.delete(`/api/score/unlike-comment/${id}`);
    }
};