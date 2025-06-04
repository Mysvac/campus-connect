import api from './index';
import { DEBUG_MODE } from './index';
import { MOCK_DATA, getMockResponse } from './mockData';

// 任务相关 API
export default {    // 获取所有任务
    getTasks: () => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的任务列表数据");
            return getMockResponse(MOCK_DATA.tasks);
        }
        return api.get('/api/task/get-all-tasks');
    },

    // 获取任务详情
    getTaskDetail: (id) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的任务详情数据");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(id));
            return getMockResponse(task || MOCK_DATA.tasks[0]);
        }
        return api.get(`/api/task/get-tasks-by-tid/${id}`);
    },    // 发布新任务
    createTask: (data) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟创建新任务");
            // 获取当前用户ID
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const currentUserId = currentUser.uid || 1001; // 默认使用1001
            
            const newTask = {
                tid: MOCK_DATA.tasks.length + 1,
                uid: currentUserId,
                name: data.name,
                details: data.details,
                tag: data.tag,
                money: data.money,
                status: 0, // 未接单
                contact: data.contact,
                time: Date.now(),
                applicants: []
            };
            MOCK_DATA.tasks.unshift(newTask);
            return getMockResponse(newTask);
        }
        return api.post('/api/task/add-task', data);
    },    // 申请任务
    applyTask: (id, data = {}) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟申请任务");
            // 获取当前用户ID
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const currentUserId = currentUser.uid || 1001; // 默认使用1001
            
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(id));
            if (task) {
                if (task.status === 0) { // 待接取
                    // 检查用户是否已经申请过
                    const existingApplication = task.applicants.find(a => a.uid === currentUserId);
                    if (existingApplication) {
                        return getMockResponse({success: false, message: '您已经申请过此任务'});
                    }
                    
                    // 直接将任务状态改为进行中（根据后端逻辑）
                    task.status = 1;
                    const application = {
                        uid: currentUserId, // 使用动态用户ID
                        tid: parseInt(id),
                        time: Date.now(),
                        status: 1, // 进行中
                        message: data.message || ''
                    };
                    task.applicants.push(application);
                    return getMockResponse({success: true});
                } else {
                    return getMockResponse({success: false, message: '任务不可申请'});
                }
            }
            return getMockResponse({success: false, message: '任务不存在'});
        }
        return api.post(`/api/task/apply-task/${id}`, data);
    },// 接受申请
    acceptApplicant: (taskId, userId) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟接受申请");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(taskId));
            if (task) {
                const applicant = task.applicants.find(a => a.uid === parseInt(userId));
                if (applicant) {
                    // 将被接受的申请者状态设为待同意
                    applicant.status = 0; // 待同意
                    // 将任务状态改为进行中
                    task.status = 1; // 进行中
                    return getMockResponse({success: true});
                }
                return getMockResponse({success: false, message: '申请人不存在'});
            }
            return getMockResponse({success: false, message: '任务不存在'});
        }
        return api.post(`/api/task/accept-applicant/${taskId}/${userId}`);
    },    // 完成任务
    completeTask: (id, uid = null) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟完成任务");
            console.log("传入的用户UID:", uid);
            // 如果没有提供uid，从localStorage获取当前用户ID
            if (!uid) {
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                console.log("从localStorage获取的用户信息:", currentUser);
                uid = currentUser.uid;
                
                // 如果还是没有获取到uid，给出警告并使用默认值
                if (!uid) {
                    console.warn("警告: 无法获取当前用户ID，使用默认值1001");
                    uid = 1001;
                }
            }
            
            console.log("最终使用的用户UID:", uid);
            
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(id));
            if (task) {
                task.status = 3; // 已完成
                return getMockResponse({success: true});
            }
            return getMockResponse({success: false, message: '任务不存在'});
        }
        return api.post(`/api/task/complete-task/${id}/${uid}`);
    },terminateTask: (id) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟终止任务");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(id));
            if (task) {
                task.status = 2; // 已终止
                return getMockResponse({success: true});
            }
            return getMockResponse({success: false, message: '任务不存在'});
        }
        return api.post(`/api/task/terminate-task/${id}`);
    },

    // 放弃任务（用户放弃已接取的任务）
    abandonTask: (taskId, userId) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟放弃任务");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(taskId));
            if (task) {
                task.status = 0; // 回到待接取状态
                // 移除申请记录
                if (task.applicants) {
                    task.applicants = task.applicants.filter(a => a.uid !== parseInt(userId));
                }
                return getMockResponse({success: true});
            }
            return getMockResponse({success: false, message: '任务不存在'});
        }
        return api.post(`/api/task/terminate-taskhandle/${taskId}/${userId}`);
    },

    // 获取任务标签
    getTaskTags: () => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的任务标签数据");
            return getMockResponse(MOCK_DATA.taskTags);
        }
        return api.get('/api/task/get-tags');
    },
    
    // 根据标签获取任务
    getTasksByTag: (tag) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的标签筛选任务数据");
            const tasks = tag === '全部' ? 
                MOCK_DATA.tasks : 
                MOCK_DATA.tasks.filter(t => t.tag === tag);
            return getMockResponse(tasks);
        }
        return api.get(`/api/task/get-tasks-by-tag/${tag}`);
    },
      // 获取用户发布的任务
    getUserTasks: (userId) => {
        console.log('getUserTasks 被调用, 用户ID:', userId, 'DEBUG_MODE:', DEBUG_MODE, 'isAuthenticated:', localStorage.getItem('isAuthenticated'));
        
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的用户任务数据");
            const tasks = MOCK_DATA.tasks.filter(t => t.uid === parseInt(userId));
            return getMockResponse(tasks);
        }
        
        console.log('发送真实 API 请求到:', `/api/task/get-tasks-by-uid/${userId}`);
        return api.get(`/api/task/get-tasks-by-uid/${userId}`);
    },
    
    // 获取用户申请的任务
    getUserAppliedTasks: (userId) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的用户申请任务数据");
            const tasks = MOCK_DATA.tasks.filter(t => 
                t.applicants && t.applicants.some(a => a.uid === parseInt(userId))
            );
            return getMockResponse(tasks);
        }
        return api.get(`/api/task/get-applied-tasks/${userId}`);
    },    // 获取任务申请者列表（统一方法名）
    getTaskApplicants: (taskId) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 返回模拟的任务申请者数据");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(taskId));
            if (task && task.applicants) {
                return getMockResponse(task.applicants);
            }
            return getMockResponse([]);
        }
        return api.get(`/api/task/get-taskshandle-by-tid/${taskId}`);
    },

    // 接受申请者
    acceptApplicant: (taskId, userId) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟接受申请者");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(taskId));
            if (task) {
                // 更新任务状态为进行中
                task.status = 1;
                // 设置接受的用户为执行者
                task.executorId = parseInt(userId);
                // 清空申请者列表或标记其他申请者为被拒绝
                if (task.applicants) {
                    task.applicants = task.applicants.map(applicant => ({
                        ...applicant,
                        status: applicant.uid === parseInt(userId) ? 1 : 2 // 1=接受, 2=拒绝
                    }));
                }
                return getMockResponse({success: true});
            }
            return getMockResponse({success: false, message: '任务不存在'});
        }
        return api.post(`/api/task/accept-applicant/${taskId}/${userId}`);
    },

    // 拒绝申请者
    rejectApplicant: (taskId, userId) => {
        if (DEBUG_MODE && localStorage.getItem('isAuthenticated') !== 'true') {
            console.log("DEBUG MODE: 模拟拒绝申请者");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(taskId));
            if (task && task.applicants) {
                // 从申请者列表中移除该用户或标记为拒绝
                task.applicants = task.applicants.map(applicant => 
                    applicant.uid === parseInt(userId) 
                        ? {...applicant, status: 2} // 2=拒绝
                        : applicant
                ).filter(applicant => applicant.status !== 2); // 移除被拒绝的申请者
                return getMockResponse({success: true});
            }
            return getMockResponse({success: false, message: '任务不存在或申请者不存在'});
        }
        return api.post(`/api/task/reject-applicant/${taskId}/${userId}`);
    },
};