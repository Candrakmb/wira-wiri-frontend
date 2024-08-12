// src/store/index.js
import { createStore } from 'vuex';
import api from '@/api/axios.js'; 

const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');
const isAuthenticated = savedUser ? true : false;

const store = createStore({
  state: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken ? savedToken : null,
    isAuthenticated: isAuthenticated,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(user)); // Simpan di localStorage
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token); // Simpan di localStorage
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user'); 
      localStorage.removeItem('token');
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      const response = await api.post('/login', { email, password });
      const user = response.data.user;
      const token = response.data.token;
      commit('setUser', user);
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('clearUser');
    },
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    token: state => state.token,
  }
});

export default store;
