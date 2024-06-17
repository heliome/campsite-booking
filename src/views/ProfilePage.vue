<template>
  <div class="profile-page">
    <SecondaryNavbar />
    <h1>Profile</h1>
    <div v-if="user" class="profile-info">
      <p><strong>First Name:</strong> {{ user.firstName }}</p>
      <p><strong>Last Name:</strong> {{ user.lastName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <button @click="toggleEditName">Change Name</button>
      <button @click="toggleEditEmail">Change Email</button>
      <button @click="toggleEditPassword">Change Password</button>
    </div>

    <div v-if="editingName" class="edit-section">
      <h2>Edit Name</h2>
      <form @submit.prevent="updateName">
        <div class="form-group">
          <label for="firstName">First Name:</label>
          <input type="text" v-model="firstName" />
        </div>
        <div class="form-group">
          <label for="lastName">Last Name:</label>
          <input type="text" v-model="lastName" />
        </div>
        <button type="submit">Save</button>
        <button type="button" @click="cancelEditName">Cancel</button>
      </form>
    </div>

    <div v-if="editingEmail" class="edit-section">
      <h2>Edit Email</h2>
      <form @submit.prevent="updateEmail">
        <div class="form-group">
          <label for="oldPassword">Old Password:</label>
          <input type="password" v-model="oldPassword" />
        </div>
        <div class="form-group">
          <label for="email">New Email:</label>
          <input type="email" v-model="email" />
        </div>
        <button type="submit">Save</button>
        <button type="button" @click="cancelEditEmail">Cancel</button>
      </form>
    </div>

    <div v-if="editingPassword" class="edit-section">
      <h2>Edit Password</h2>
      <form @submit.prevent="updatePassword">
        <div class="form-group">
          <label for="oldPassword">Old Password:</label>
          <input type="password" v-model="oldPassword" />
        </div>
        <div class="form-group">
          <label for="newPassword">New Password:</label>
          <input type="password" v-model="newPassword" />
        </div>
        <button type="submit">Save</button>
        <button type="button" @click="cancelEditPassword">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SecondaryNavbar from '../components/SecondaryNavBar.vue';

export default {
  name: 'ProfilePage',
  components: {
    SecondaryNavbar
  },
  data() {
    return {
      user: null,
      editingName: false,
      editingEmail: false,
      editingPassword: false,
      firstName: '',
      lastName: '',
      email: '',
      oldPassword: '',
      newPassword: ''
    };
  },
  methods: {
    toggleEditName() {
      this.editingName = !this.editingName;
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
    },
    toggleEditEmail() {
      this.editingEmail = !this.editingEmail;
      this.email = this.user.email;
    },
    toggleEditPassword() {
      this.editingPassword = !this.editingPassword;
    },
    cancelEditName() {
      this.editingName = false;
    },
    cancelEditEmail() {
      this.editingEmail = false;
    },
    cancelEditPassword() {
      this.editingPassword = false;
    },
    async fetchProfile() {
      try {
        const response = await axios.post('https://localhost:5151/User/showProfile', {
          token: localStorage.getItem('token')
        });
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    },
    async updateName() {
      try {
        const response = await axios.put('https://localhost:5151/User/profile', {
          token: localStorage.getItem('token'),
          firstName: this.firstName,
          lastName: this.lastName
        });
        this.user.firstName = this.firstName;
        this.user.lastName = this.lastName;
        this.editingName = false;
        alert(response.data.message);
      } catch (error) {
        console.error('Error updating name:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    },
    async updateEmail() {
      try {
        const response = await axios.put('https://localhost:5151/User/profile/email', {
          token: localStorage.getItem('token'),
          oldPassword: this.oldPassword,
          email: this.email
        });
        this.user.email = this.email;
        this.editingEmail = false;
        alert(response.data.message);
      } catch (error) {
        console.error('Error updating email:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    },
    async updatePassword() {
      try {
        const response = await axios.put('https://localhost:5151/User/profile/password', {
          token: localStorage.getItem('token'),
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        });
        this.editingPassword = false;
        alert(response.data.message);
      } catch (error) {
        console.error('Error updating password:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    }
  },
  mounted() {
    this.fetchProfile();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  background: #f8f9fa;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.profile-page {
  padding: 20px;
  max-width: 600px;
  margin: 40px auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.profile-info {
  text-align: left;
  margin-bottom: 20px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.edit-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

form .form-group {
  margin-bottom: 15px;
}

form label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

form input {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  color: #333;
}

form button {
  margin-top: 10px;
  background-color: #28a745;
}

form button[type="button"] {
  background-color: #6c757d;
}

form button:hover {
  background-color: #218838;
}

form button[type="button"]:hover {
  background-color: #5a6268;
}
</style>
