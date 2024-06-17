<template>
  <div class="search-page">
    <div class="filters">
      <h2>Search Campsites</h2>
      <input type="text" v-model="searchTerm" placeholder="Search by name..." />
      <h2>Features</h2>
      <div v-if="features.length">
        <div v-for="feature in features" :key="feature.featureID" class="checkbox-group">
          <input type="checkbox" :value="feature.featureID" v-model="selectedFeatures" />
          <label>{{ feature.name }}</label>
        </div>
      </div>
      <div v-else>
        <p>No features available.</p>
      </div>
      <h2>Terrains</h2>
      <div v-if="terrains.length">
        <div v-for="terrain in terrains" :key="terrain.terrainID" class="checkbox-group">
          <input type="checkbox" :value="terrain.terrainID" v-model="selectedTerrains" />
          <label>{{ terrain.name }}</label>
        </div>
      </div>
      <div v-else>
        <p>No terrains available.</p>
      </div>
      <button @click="searchCampsites">Search</button>
    </div>
    <div class="campsites">
      <ul>
        <li v-for="campsite in campsites" :key="campsite.campsiteId" @click="viewCampsite(campsite.campsiteId)">
          <img v-if="campsite.imageUrl" :src="getImageUrl(campsite.imageUrl)" alt="Campsite Image" class="campsite-image" />
          <div class="campsite-info">
            <h2>{{ campsite.name }}</h2>
            <p class="bookings">Bookings: {{ campsite.numberOfBookings }}</p>
          </div>
        </li>
      </ul>
      <div class="pagination">
        <button @click="previousPage" :disabled="pageNumber === 1">Previous</button>
        <span>Page {{ pageNumber }}</span>
        <button @click="nextPage" :disabled="!hasMore">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SearchPage',
  data() {
    return {
      features: [],
      terrains: [],
      selectedFeatures: [],
      selectedTerrains: [],
      searchTerm: '',
      campsites: [],
      pageNumber: 1,
      pageSize: 5,
      hasMore: true
    };
  },
  async created() {
    await this.fetchFeaturesAndTerrains();
    this.searchCampsites();
  },
  methods: {
    getImageUrl(imagePath) {
      return `https://localhost:5151${imagePath}`;
    },
    async fetchFeaturesAndTerrains() {
      try {
        const [featuresResponse, terrainsResponse] = await Promise.all([
          axios.get('https://localhost:5151/Features/getAll'),
          axios.get('https://localhost:5151/Terrains/getAll')
        ]);

        this.features = featuresResponse.data || [];
        this.terrains = terrainsResponse.data || [];
      } catch (error) {
        console.error('Error fetching features and terrains:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    },
    async searchCampsites() {
      try {
        const response = await axios.post('https://localhost:5151/Campsite/searchCampsites', {
          featureIds: this.selectedFeatures,
          terrainIds: this.selectedTerrains,
          searchTerm: this.searchTerm
        }, {
          params: {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize
          }
        });

        this.campsites = response.data.campsites || [];
        this.hasMore = response.data.hasMore;

      } catch (error) {
        console.error('Error searching campsites:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    },
    nextPage() {
      this.pageNumber++;
      this.searchCampsites();
    },
    previousPage() {
      if (this.pageNumber > 1) {
        this.pageNumber--;
        this.searchCampsites();
      }
    },
    viewCampsite(campsiteId) {
      this.$router.push({ name: 'CampsiteDetails', params: { campsiteId } });
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
  height: 100vh;
}

.search-page {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.filters {
  width: 25%;
  padding: 20px;
  border-right: 1px solid #ccc;
}

.filters h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
}

.filters input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 0.5rem;
}

button {
  padding: 10px;
  margin-top: 1rem;
  background-color: #4e54c8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #6a11cb;
}

.campsites {
  width: 75%;
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: #f0f0f0;
}

.campsite-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 4px;
}

.campsite-info {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
}

.bookings {
  font-weight: 700;
  color: #4e54c8;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px;
  margin: 0 5px;
}
</style>
sssss