import api from './index';
import { DEBUG_MODE } from './index';
import { MOCK_DATA, getMockResponse } from './mockData';

// 评分相关 API
export default {    // 获取评分标签
    getRatingTags: () => {
        console.log("获取评分标签");
        // 提供一些通用的评分标签
        const mockTags = ['课程', '食堂', '宿舍', '图书馆', '校园设施', '教师', '活动', '服务', '公共区域', '其他'];
        
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
    },

    // 添加新评分
    createRating: (data) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟创建新评分");
            const newRating = {
                rid: MOCK_DATA.ratings.length + 1,
                sid: MOCK_DATA.ratings.length + 1,
                uid: 101, // 模拟用户ID
                targetType: data.targetType,
                targetId: data.targetId,
                targetName: data.targetName,
                goal: data.goal,
                rating: data.rating,
                score: data.rating,
                review: data.review,
                tag: data.tag,
                time: Date.now(),
                likes: 0,
                isLiked: false,
                comments: []
            };
            MOCK_DATA.ratings.unshift(newRating);
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
    },
      // 添加评分评论
    commentRating: (id, data) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟评论评分");
            const rating = MOCK_DATA.ratings.find(r => r.rid === parseInt(id) || r.sid === parseInt(id));
            if (rating) {
                const newComment = {
                    cid: Date.now(),
                    uid: 101, // 模拟用户ID
                    sid: rating.sid || rating.rid,
                    content: data.content,
                    comment: data.content,
                    score: data.score || 5.0,
                    time: Date.now(),
                    likes: 0,
                    isLiked: false
                };
                rating.comments.push(newComment);
                return getMockResponse(newComment);
            }
            return getMockResponse({success: false});
        }
        return api.post(`/api/score/add-comment`, { ...data, sid: id });
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