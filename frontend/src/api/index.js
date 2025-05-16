import axios from 'axios';
import router from '@/router';

// 调试模式开关，在开发环境下可以绕过登录检查
export const DEBUG_MODE = false;

const api = axios.create({
    // baseURL: 'http://10.100.164.32:18081/',
    baseURL: 'https://api.mythovac.com/',
    withCredentials: true, // 添加此配置以允许跨域请求发送Cookie
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {        // 检查是否有会话认证（使用前端全局认证状态而不是JWT）
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (!isAuthenticated) {
            console.warn('Not authenticated');
            // 在调试模式下，跳过登录检查
            if (!DEBUG_MODE) {
                // 不是调试模式，执行正常的登录检查
                if (!(config.url.includes('login') || config.url.includes('register'))) {
                    // 检查当前路由是否已经在登录页，避免死循环
                    try {
                        // 获取当前路径，但由于router可能还未实例化完成，需要进行错误处理
                        let currentPath = '/';
                        
                        // 避免直接访问router.currentRoute，可能不存在
                        if (router && router.currentRoute && router.currentRoute.value) {
                            currentPath = router.currentRoute.value.path;
                        } else if (window.location.pathname) {
                            // 降级处理：直接从window.location获取路径
                            currentPath = window.location.pathname;
                        }
                        
                        // 只有不在登录相关页面时才跳转
                        if (currentPath !== '/user-login' && currentPath !== '/user-register') {
                            console.log('未授权，跳转到登录页', currentPath);
                            router.push('/user-login');
                        }
                    } catch (e) {
                        console.error('路由跳转错误:', e);
                    }
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
            const {code, msg, data} = response.data;            if (code === 0 && msg === "NOT_LOGIN") {
                // 清除认证标记
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('currentUser');
                // 检查当前路由是否已经在登录页，避免死循环
                try {
                    // 获取当前路径，但由于router可能还未实例化完成，需要进行错误处理
                    let currentPath = '/';
                    
                    if (router && router.currentRoute && router.currentRoute.value) {
                        currentPath = router.currentRoute.value.path;
                    } else if (window.location.pathname) {
                        currentPath = window.location.pathname;
                    }
                    
                    if (currentPath !== '/user-login' && currentPath !== '/user-register') {
                        console.log('响应拦截：未授权，跳转到登录页', currentPath);
                        router.push('/user-login');
                    }
                } catch (e) {
                    console.error('路由跳转错误:', e);
                }
            }
        }
        return response;
    },
    (error) => {
        // 在调试模式下，不做任何登录相关的重定向
        if (!DEBUG_MODE && error.response) {
            const {code, msg} = error.response.data;

            switch (error.response.status) {                case 401:
                    console.error('Unauthorized: Session may be invalid or expired');
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('currentUser');
                    // 检查当前路由是否已经在登录页，避免死循环
                    const currentPath = router.currentRoute.value.path;
                    if (currentPath !== '/user-login' && currentPath !== '/user-register') {
                        router.push('/user-login');
                    }
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