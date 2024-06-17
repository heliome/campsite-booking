import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
axios.defaults.withCredentials = true;

createApp(App)
  .use(router)
  .use(store)
  .mount('#app');