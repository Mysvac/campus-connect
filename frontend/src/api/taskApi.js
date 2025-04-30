import api from './index';
import { DEBUG_MODE } from './index';
import { MOCK_DATA, getMockResponse } from './mockData';

// 任务相关 API
export default {
    // 获取所有任务
    getTasks: () => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的任务列表数据");
            return getMockResponse(MOCK_DATA.tasks);
        }
        return api.get('/api/task/get-all-tasks');
    },

    // 获取任务详情
    getTaskDetail: (id) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的任务详情数据");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(id));
            return getMockResponse(task || MOCK_DATA.tasks[0]);
        }
        return api.get(`/api/task/get-tasks-by-tid/${id}`);
    },

    // 发布新任务
    createTask: (data) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟创建新任务");
            const newTask = {
                tid: MOCK_DATA.tasks.length + 1,
                uid: 101, // 模拟用户ID
                name: data.name,
                details: data.details,
                tag: data.tag,
                money: data.money,
                reward: data.reward,
                status: 0, // 未接单
                location: data.location,
                contact: data.contact,
                deadline: data.deadline,
                time: Date.now(),
                applicants: []
            };
            MOCK_DATA.tasks.unshift(newTask);
            return getMockResponse(newTask);
        }
        return api.post('/api/task/add-task', data);
    },

    // 申请任务
    applyTask: (id, data) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟申请任务");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(id));
            if (task) {
                if (task.status === 0) { // 未接单
                    const application = {
                        uid: 101, // 模拟用户ID
                        time: Date.now(),
                        status: 0, // 待接受
                        message: data.message || ''
                    };
                    task.applicants.push(application);
                    return getMockResponse({ success: true });
                } else {
                    return getMockResponse({ success: false, message: '任务已被接取' });
                }
            }
            return getMockResponse({ success: false, message: '任务不存在' });
        }
        return api.post(`/api/task/apply-task/${id}`, data);
    },

    // 接受申请
    acceptApplicant: (taskId, userId) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟接受申请");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(taskId));
            if (task) {
                const applicant = task.applicants.find(a => a.uid === parseInt(userId));
                if (applicant) {
                    task.status = 1; // 已接单
                    applicant.status = 1; // 已接受
                    // 拒绝其他申请
                    task.applicants.forEach(a => {
                        if (a.uid !== parseInt(userId)) {
                            a.status = 2; // 已拒绝
                        }
                    });
                    return getMockResponse({ success: true });
                }
                return getMockResponse({ success: false, message: '申请不存在' });
            }
            return getMockResponse({ success: false, message: '任务不存在' });
        }
        return api.post(`/api/task/accept-applicant?taskId=${taskId}&userId=${userId}`);
    },

    // 完成任务
    completeTask: (id) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟完成任务");
            const task = MOCK_DATA.tasks.find(t => t.tid === parseInt(id));
            if (task) {
                if (task.status === 1) { // 已接单
                    task.status = 2; // 已完成
                    return getMockResponse({ success: true });
                } else {
                    return getMockResponse({ success: false, message: '任务状态不正确' });
                }
            }
            return getMockResponse({ success: false, message: '任务不存在' });
        }
        return api.post(`/api/task/complete-task/${id}`);
    },

    // 删除任务
    deleteTask: (id) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 模拟删除任务");
            const taskIndex = MOCK_DATA.tasks.findIndex(t => t.tid === parseInt(id));
            if (taskIndex !== -1) {
                MOCK_DATA.tasks.splice(taskIndex, 1);
                return getMockResponse({ success: true });
            }
            return getMockResponse({ success: false, message: '任务不存在' });
        }
        return api.get(`/api/task/delete-tasks-by-tid/${id}`);
    },

    // 根据标签获取任务
    getTasksByTag: (tag) => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回按标签过滤的模拟任务数据");
            const filteredTasks = MOCK_DATA.tasks.filter(t => t.tag === tag);
            return getMockResponse(filteredTasks);
        }
        return api.get(`/api/task/get-tasks-by-tag/${tag}`);
    },

    // 获取任务标签
    getTaskTags: () => {
        if (DEBUG_MODE && !localStorage.getItem('jwt')) {
            console.log("DEBUG MODE: 返回模拟的任务标签数据");
            return getMockResponse(MOCK_DATA.taskTags);
        }
        return api.get('/api/task/get-tags');
    }
};