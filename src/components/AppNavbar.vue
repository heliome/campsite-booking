<template>
  <nav class="app-navbar">
    <div class="nav-links">
      <router-link to="/search">Search</router-link>
      <router-link to="/">Home</router-link>
      <router-link to="/bookings">My Bookings</router-link>
    </div>
    <div class="auth-links">
      <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
      <router-link v-if="isLoggedIn" @click="logout" to="/">Logout</router-link>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'AppNavbar',
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    ...mapActions(['logout']),
  },
};
</script>

<style scoped>
.app-navbar {
  background-color: #333;
  color: #fff;
  padding: 1em;
  display: flex;
  justify-content: center;
}
.nav-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
}
.nav-links {
  display: flex;
  justify-content: center;
  flex: 1;
}
.nav-links a {
  margin: 0 1em;
  color: #fff;
  text-decoration: none;
}
.auth-links {
  display: flex;
  justify-content: flex-end;
}
.auth-links a,
.auth-links span {
  margin-left: 1em;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
}
</style>