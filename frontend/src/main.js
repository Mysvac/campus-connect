import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 创建 Vue 应用实例
const app = createApp(App);

// 使用插件
app.use(store).use(router).use(ElementPlus);

// 在挂载应用前初始化 Vuex 中的用户状态
store.dispatch('initializeAuth');

// 挂载应用
app.mount('#app');
