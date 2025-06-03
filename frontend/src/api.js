import api from './api/index';
import messageApi from './api/messageApi';
import goodApi from './api/goodApi';
import scoreApi from './api/scoreApi';
import taskApi from './api/taskApi';
import userApiModule from './api/userApi';
import adminApiModule from './api/adminApi';
import { DEBUG_MODE } from './api/index';

// 导出调试模式标志
export { DEBUG_MODE };

// 导出基础的axios实例
export default api;

// 导出各个模块API
export const messageboardApi = messageApi;
export const transactionsApi = goodApi;
export const ratingsApi = scoreApi;
export const tasksApi = taskApi;
export const userApi = userApiModule;
export const adminApi = adminApiModule;