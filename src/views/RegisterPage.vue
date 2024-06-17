<template>
  <div class="register">
    <div class="register-container">
      <h1>Create an Account</h1>
      <form @submit.prevent="register">
        <div class="input-group">
          <label for="firstname">First Name</label>
          <input type="text" v-model="firstName" required />
        </div>
        <div class="input-group">
          <label for="lastname">Last Name</label>
          <input type="text" v-model="lastName" required />
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <router-link to="/login" class="login-link">Already have an account? Log In</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterPage",
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post("https://localhost:5151/User/registration", {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password
        }, 
        {
          withCredentials: true
        });
        console.log(response.data);
        alert('Registration successful! You can now log in.');
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.register-container {
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
  border-color: #6a11cb;
  outline: none;
}

button {
  padding: 0.75rem;
  background-color: #6a11cb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2575fc;
}

.login-link {
  display: block;
  margin-top: 1rem;
  color: #6a11cb;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #2575fc;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
