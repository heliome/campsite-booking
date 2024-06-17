import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import SearchPage from '../views/SearchPage.vue';
import BookingsPage from '../views/BookingsPage.vue';
import MyCampsitesPage from '../views/MyCampsitesPage.vue';
import AddCampsitePage from '../views/AddCampsitePage.vue';
import CampsiteDetailsPage from '../views/CampsiteDetailsPage.vue';


const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/profile', component: ProfilePage },
  { path: '/search', component: SearchPage },
  { path: '/bookings', component: BookingsPage },
  { path: '/my-Campsites', component: MyCampsitesPage },
  { path: '/addCampsite', component: AddCampsitePage },
  { path: '/campsite/:campsiteId', name: 'CampsiteDetails', component: CampsiteDetailsPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;