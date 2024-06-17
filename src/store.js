import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    isLoggedIn: !!localStorage.getItem('token'),
    user: null,
  },
  mutations: {
    setLoginState(state, token) {
      state.isLoggedIn = !!token;
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await axios.post('https://localhost:5151/User/login', { email, password });
        const { token } = response.data;
        commit('setLoginState', token);
        return { success: true, message: 'Login successful' };
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Login failed' };
      }
    },
    async logout({ commit }) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('https://localhost:5151/User/logout', { token });
        commit('logout');
        return { success: true };
      } catch (error) {
        console.error('Logout error:', error);
        return { success: false, message: 'Failed to logout' };
      }
    }
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    user: state => state.user
  }
});