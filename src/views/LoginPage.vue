<template>
  <div class="login">
    <div class="login-container">
      <h1>Welcome Back</h1>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Log In</button>
      </form>
      <router-link to="/register" class="register-link">Create an Account</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    ...mapActions(['login']), 
    async handleLogin() { 
      try {
        const { success, message } = await this.login({ email: this.email, password: this.password });
        if (success) {
          this.$router.push('/'); 
        } else {
          alert(message); 
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.'); 
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(to right, #ff7e5f, #feb47b);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-container {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

h1 {
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  border-color: #ff7e5f;
  outline: none;
}

button {
  padding: 0.75rem;
  background-color: #ff7e5f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #feb47b;
}

.register-link {
  display: block;
  margin-top: 1rem;
  color: #ff7e5f;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #feb47b;
}
</style>
