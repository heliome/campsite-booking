<template>
  <div class="my-campsites-page">
    <SecondaryNavbar v-if="isLoggedIn" />
    <h1>My Campsites</h1>
    <div v-if="!isLoggedIn" class="login-prompt">
      <p>Please Login First</p>
    </div>
    <div v-else>
      <div v-if="!isOwner" class="not-owner-section">
        <p>You are not an owner yet. Add a campsite to become an owner.</p>
        <button @click="goToAddCampsite" class="primary-button">Add Campsite</button>
      </div>
      <div v-else class="owner-section">
        <button @click="goToAddCampsite" class="primary-button add-campsite-button">Add Campsite</button>
        <ul v-if="campsites.length" class="campsites-list">
          <li v-for="campsite in campsites" :key="campsite.campsiteId" @click="viewCampsite(campsite.campsiteId)" class="campsite-item">
            <h2>{{ campsite.name }}</h2>
            <img v-if="campsite.imageUrl" :src="getImageUrl(campsite.imageUrl)" alt="Campsite Image" class="campsite-image" />
            <p>{{ campsite.country }}, {{ campsite.town }}, {{ campsite.address }}</p>
            <p>Bookings: {{ campsite.numberOfBookings }}</p>
            <p :class="{'status-terminated': campsite.terminated, 'status-active': !campsite.terminated && campsite.active, 'status-inactive': !campsite.terminated && !campsite.active}">
              Status: {{ campsite.terminated ? 'Terminated' : (campsite.active ? 'Active' : 'Inactive') }}
            </p>
            <div class="buttons">
              <button v-if="!campsite.terminated" @click.stop="changeCampsiteStatus(campsite.campsiteId, !campsite.active)">
                {{ campsite.active ? 'Deactivate' : 'Activate' }}
              </button>
              <button v-if="!campsite.terminated" @click.stop="terminateCampsite(campsite.campsiteId)">Terminate</button>
            </div>
          </li>
        </ul>
        <p v-else>No campsites found.</p>
        <div class="pagination">
          <button v-if="pageNumber > 1" @click="previousPage" :disabled="pageNumber === 1">Previous</button>
          <span class="page-number">Page {{ pageNumber }}</span>
          <button v-if="hasMore" @click="nextPage" :disabled="!hasMore">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import SecondaryNavbar from '../components/SecondaryNavBar.vue';

export default {
  name: 'MyCampsitesPage',
  components: {
    SecondaryNavbar
  },
  data() {
    return {
      isOwner: false,
      campsites: [],
      pageNumber: 1,
      pageSize: 5,
      hasMore: true
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  methods: {
    async fetchCampsites() {
      try {
        const response = await axios.post('https://localhost:5151/Campsite/getCampsites', {
          token: localStorage.getItem('token')
        }, {
          params: {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize
          }
        });

        this.isOwner = response.data.isOwner;
        this.campsites = response.data.campsites;
        this.hasMore = response.data.campsites.length === this.pageSize;
      } catch (error) {
        console.error('Error fetching campsites:', error);
      }
    },
    getImageUrl(imagePath) {
      return `https://localhost:5151${imagePath}`;
    },
    goToAddCampsite() {
      this.$router.push('/addCampsite');
    },
    async changeCampsiteStatus(campsiteId, isActive) {
      try {
        const endpoint = isActive ? 'activateCampsite' : 'deactivateCampsite';
        const response = await axios.post(`https://localhost:5151/Campsite/${endpoint}`, {
          token: localStorage.getItem('token'),
          campsiteId
        });

        if (response.data.message) {
          this.fetchCampsites();
        }
      } catch (error) {
        console.error(`Error ${isActive ? 'activating' : 'deactivating'} campsite:`, error);
      }
    },
    async terminateCampsite(campsiteId) {
      try {
        const response = await axios.post('https://localhost:5151/Campsite/terminateCampsite', {
          token: localStorage.getItem('token'),
          campsiteId
        });

        if (response.data.message) {
          this.fetchCampsites();
        }
      } catch (error) {
        console.error('Error terminating campsite:', error);
      }
    },
    viewCampsite(campsiteId) {
      this.$router.push({ name: 'CampsiteDetails', params: { campsiteId } });
    },
    nextPage() {
      this.pageNumber++;
      this.fetchCampsites();
    },
    previousPage() {
      if (this.pageNumber > 1) {
        this.pageNumber--;
        this.fetchCampsites();
      }
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.fetchCampsites();
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

.my-campsites-page {
  padding: 20px;
  max-width: 1200px;
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

.login-prompt, .not-owner-section, .owner-section {
  text-align: center;
  margin-top: 20px;
}

.primary-button {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.primary-button:hover {
  background-color: #0056b3;
}

.campsites-list {
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
}

.campsite-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.campsite-item:hover {
  background-color: #f0f0f0;
}

.campsite-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 5px;
  margin-bottom: 10px;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.buttons button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.buttons button:hover {
  background-color: #218838;
}

.buttons button:nth-child(2) {
  background-color: #dc3545;
}

.buttons button:nth-child(2):hover {
  background-color: #c82333;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px;
  margin: 0 5px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #0056b3;
}

.page-number {
  font-weight: bold;
  padding: 10px;
}

.status-terminated {
  color: red;
  font-weight: bold;
}

.status-active {
  color: green;
  font-weight: bold;
}

.status-inactive {
  color: orange;
  font-weight: bold;
}
</style>
