import axios from 'axios';
import router from '@/router';

// 调试模式开关，在开发环境下可以绕过登录检查
export const DEBUG_MODE = false;

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers['token'] = `${token}`;
        } else {
            console.warn('No JWT token found');
            // 在调试模式下，跳过登录检查
            if (!DEBUG_MODE) {
                // 不是调试模式，执行正常的登录检查
                if (!(config.url.includes('login') || config.url.includes('register'))) {
                    router.push('/user-login');
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
api.interceptors.response.use(
    (response) => {
        // 在调试模式下，跳过登录检查
        if (!DEBUG_MODE) {
            const {code, msg, data} = response.data;
            if (code === 0 && msg === "NOT_LOGIN") {
                localStorage.removeItem('jwt');
                router.push('/user-login');
            }
        }
        return response;
    },
    (error) => {
        // 在调试模式下，不做任何登录相关的重定向
        if (!DEBUG_MODE && error.response) {
            const {code, msg} = error.response.data;

            switch (error.response.status) {
                case 401:
                    console.error('Unauthorized: Token may be invalid or expired');
                    localStorage.removeItem('jwt');
                    router.push('/user-login');
                    break;
                case 403:
                    console.error('Forbidden: You do not have permission to access this resource');
                    break;
                default:
                    console.error(`Error ${error.response.status}: ${msg}`);
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;