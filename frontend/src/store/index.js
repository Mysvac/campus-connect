import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    isAuthenticated: false
  },
  getters: {
    // 获取当前用户
    currentUser: state => state.user,
    // 判断是否已登录
    isAuthenticated: state => state.isAuthenticated
  },
  mutations: {
    // 设置用户信息
    setUser(state, userData) {
      state.user = userData;
      state.isAuthenticated = !!userData;
    },
    // 清除用户信息
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  actions: {
    // 初始化时从localStorage加载用户信息
    initializeAuth({ commit }) {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        commit('setUser', JSON.parse(userData));
      }
    },    // 登录
    login({ commit }, userData) {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true'); // 设置认证标记
      commit('setUser', userData);
    },    // 登出
    logout({ commit }) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated'); // 清除认证标记
      commit('clearUser');
    }
  },
  modules: {
  }
})
