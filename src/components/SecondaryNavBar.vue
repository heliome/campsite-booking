<template>
  <nav class="secondary-navbar">
    <div class="nav-links">
      <router-link to="/profile">Profile</router-link>
      <router-link to="/bookings">My Bookings</router-link>
      <router-link to="/my-campsites">My Campsites</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'SecondaryNavbar'
};
</script>

<style scoped>
.secondary-navbar {
  background-color: #444;
  color: #fff;
  padding: 0.5em;
  display: flex;
  justify-content: center;
}
.nav-links {
  display: flex;
  justify-content: center;
}
.nav-links a {
  margin: 0 1em;
  color: #fff;
  text-decoration: none;
}
</style>