<template>
  <div class="add-campsite-page">
    <SecondaryNavbar v-if="isLoggedIn" />
    <h1>Add Campsite</h1>
    <form @submit.prevent="addCampsite" class="campsite-form">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea v-model="description" required></textarea>
      </div>
      <div class="form-group">
        <label for="country">Country:</label>
        <input type="text" v-model="country" required />
      </div>
      <div class="form-group">
        <label for="town">Town:</label>
        <input type="text" v-model="town" required />
      </div>
      <div class="form-group">
        <label for="address">Address:</label>
        <input type="text" v-model="address" required />
      </div>
      <div class="form-group">
        <label for="image">Campsite Image:</label>
        <input type="file" @change="onFileChange" accept="image/*" required />
        <p v-if="imageError" class="error-message">{{ imageError }}</p>
      </div>
      <div class="form-group">
        <h3>Features</h3>
        <ul class="checkbox-list">
          <li v-for="feature in features" :key="feature.featureID" class="checkbox-item">
            <label>
              <input type="checkbox" :value="feature.featureID" v-model="selectedFeatures" />
              {{ feature.name }}
            </label>
          </li>
        </ul>
      </div>
      <div class="form-group">
        <h3>Terrain</h3>
        <ul class="checkbox-list">
          <li v-for="terrain in terrains" :key="terrain.terrainID" class="checkbox-item">
            <label>
              <input type="checkbox" :value="terrain.terrainID" v-model="selectedTerrains" />
              {{ terrain.name }}
            </label>
          </li>
        </ul>
      </div>
      <button type="submit" class="submit-button">Add Campsite</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import SecondaryNavbar from '../components/SecondaryNavBar.vue';

export default {
  name: 'AddCampsitePage',
  components: {
    SecondaryNavbar
  },
  data() {
    return {
      name: '',
      description: '',
      country: '',
      town: '',
      address: '',
      features: [],
      terrains: [],
      selectedFeatures: [],
      selectedTerrains: [],
      image: null,
      imageError: ''
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.image = file;
        this.imageError = '';
      } else {
        this.image = null;
        this.imageError = 'Please select a valid image file.';
      }
    },
    async fetchFeaturesAndTerrains() {
      try {
        const [featuresResponse, terrainsResponse] = await Promise.all([
          axios.get('https://localhost:5151/Features/getAll'),
          axios.get('https://localhost:5151/Terrains/getAll')
        ]);
        this.features = featuresResponse.data;
        this.terrains = terrainsResponse.data;
      } catch (error) {
        console.error('Error fetching features and terrains:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    },
    async addCampsite() {
      if (!this.image) {
        this.imageError = 'Image is required.';
        return;
      }

      try {
        const formData = new FormData();
        formData.append('token', localStorage.getItem('token'));
        formData.append('name', this.name);
        formData.append('description', this.description);
        formData.append('country', this.country);
        formData.append('town', this.town);
        formData.append('address', this.address);
        formData.append('image', this.image);

        this.selectedFeatures.forEach(feature => formData.append('featureIds', feature));
        this.selectedTerrains.forEach(terrain => formData.append('terrainIds', terrain));

        await axios.post('https://localhost:5151/Campsite/addCampsite', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        alert('Campsite added successfully');
        this.$router.push('/my-campsites');
      } catch (error) {
        console.error('Error adding campsite:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.fetchFeaturesAndTerrains();
    }
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

.add-campsite-page {
  padding: 20px;
  max-width: 800px;
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

.campsite-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="file"],
.form-group textarea {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  color: #333;
}

.form-group textarea {
  resize: vertical;
  height: 100px;
}

.checkbox-list {
  list-style-type: none;
  padding: 0;
}

.checkbox-item {
  margin-bottom: 10px;
}

.submit-button {
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 0.9em;
}
</style>
