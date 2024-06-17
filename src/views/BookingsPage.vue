<template>
  <div class="my-bookings-page">
    <SecondaryNavbar v-if="isLoggedIn" />
    <h1>My Bookings</h1>
    <div v-if="!isLoggedIn" class="login-prompt">
      <p>Please login first.</p>
    </div>
    <div v-else>
      <section class="bookings-section">
        <h2>Current Bookings</h2>
        <ul v-if="paginatedCurrentBookings.length">
          <li v-for="booking in paginatedCurrentBookings" :key="booking.bookingId" @click="viewCampsite(booking.campsiteId)">
            <img v-if="booking.imageUrl" :src="getImageUrl(booking.imageUrl)" alt="Campsite Image" class="booking-image" />
            <div class="booking-info">
              <h3>{{ booking.campsiteName }}</h3>
              <p>Start: {{ formatDate(booking.timeStart) }}</p>
              <p>End: {{ formatDate(booking.timeEnd) }}</p>
            </div>
          </li>
        </ul>
        <p v-else>No current bookings.</p>
        <div class="pagination" v-if="currentBookings.length">
          <button v-if="currentPageNumber > 1" @click="previousPage('current')" :disabled="currentPageNumber === 1">Previous</button>
          <span class="page-number">Page {{ currentPageNumber }}</span>
          <button v-if="hasMoreCurrent" @click="nextPage('current')" :disabled="!hasMoreCurrent">Next</button>
        </div>
      </section>

      <section class="bookings-section">
        <h2>Future Bookings</h2>
        <ul v-if="paginatedFutureBookings.length">
          <li v-for="booking in paginatedFutureBookings" :key="booking.bookingId">
            <div @click="viewCampsite(booking.campsiteId)" class="booking-info">
              <img v-if="booking.imageUrl" :src="getImageUrl(booking.imageUrl)" alt="Campsite Image" class="booking-image" />
              <div>
                <h3>{{ booking.campsiteName }}</h3>
                <p>Start: {{ formatDate(booking.timeStart) }}</p>
                <p>End: {{ formatDate(booking.timeEnd) }}</p>
              </div>
            </div>
            <button @click="cancelBooking(booking.bookingId)" class="cancel-button">Cancel</button>
          </li>
        </ul>
        <p v-else>No future bookings.</p>
        <div class="pagination" v-if="futureBookings.length">
          <button v-if="futurePageNumber > 1" @click="previousPage('future')" :disabled="futurePageNumber === 1">Previous</button>
          <span class="page-number">Page {{ futurePageNumber }}</span>
          <button v-if="hasMoreFuture" @click="nextPage('future')" :disabled="!hasMoreFuture">Next</button>
        </div>
      </section>

      <section class="bookings-section">
        <h2>Past Bookings</h2>
        <ul v-if="paginatedPastBookings.length">
          <li v-for="booking in paginatedPastBookings" :key="booking.bookingId" @click="viewCampsite(booking.campsiteId)">
            <img v-if="booking.imageUrl" :src="getImageUrl(booking.imageUrl)" alt="Campsite Image" class="booking-image" />
            <div class="booking-info">
              <h3>{{ booking.campsiteName }}</h3>
              <p v-if="!booking.active">CANCELLED</p>
              <p v-else-if="!booking.activeOwner">OWNER CANCELLED</p>
              <p>Start: {{ formatDate(booking.timeStart) }}</p>
              <p>End: {{ formatDate(booking.timeEnd) }}</p>
            </div>
          </li>
        </ul>
        <p v-else>No past bookings.</p>
        <div class="pagination" v-if="pastBookings.length">
          <button v-if="pastPageNumber > 1" @click="previousPage('past')" :disabled="pastPageNumber === 1">Previous</button>
          <span class="page-number">Page {{ pastPageNumber }}</span>
          <button v-if="hasMorePast" @click="nextPage('past')" :disabled="!hasMorePast">Next</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import SecondaryNavbar from '../components/SecondaryNavBar.vue';

export default {
  name: 'MyBookingsPage',
  components: {
    SecondaryNavbar
  },
  data() {
    return {
      currentBookings: [],
      futureBookings: [],
      pastBookings: [],
      currentPageNumber: 1,
      futurePageNumber: 1,
      pastPageNumber: 1,
      pageSize: 4,
      hasMoreCurrent: false,
      hasMoreFuture: false,
      hasMorePast: false
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    paginatedCurrentBookings() {
      return this.currentBookings;
    },
    paginatedFutureBookings() {
      return this.futureBookings;
    },
    paginatedPastBookings() {
      return this.pastBookings;
    }
  },
  methods: {
    getImageUrl(imagePath) {
      return `https://localhost:5151${imagePath}`;
    },
    async fetchBookings(type, pageNumber) {
      try {
        const response = await axios.post('https://localhost:5151/Booking/getBookings', {
          token: localStorage.getItem('token'),
          pageNumber,
          pageSize: this.pageSize
        });

        const { currentBookings, futureBookings, pastBookings, hasMoreCurrent, hasMoreFuture, hasMorePast } = response.data;

        if (type === 'current') {
          this.currentBookings = currentBookings;
          this.hasMoreCurrent = hasMoreCurrent;
        } else if (type === 'future') {
          this.futureBookings = futureBookings;
          this.hasMoreFuture = hasMoreFuture;
        } else if (type === 'past') {
          this.pastBookings = pastBookings;
          this.hasMorePast = hasMorePast;
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    async cancelBooking(bookingId) {
      try {
        const response = await axios.post('https://localhost:5151/Booking/cancelBooking', {
          token: localStorage.getItem('token'),
          bookingId
        });

        alert(response.data.message);
        this.fetchBookings('future', this.futurePageNumber);
      } catch (error) {
        console.error('Error cancelling booking:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    },
    nextPage(type) {
      if (type === 'current') {
        this.currentPageNumber++;
        this.fetchBookings('current', this.currentPageNumber);
      } else if (type === 'future') {
        this.futurePageNumber++;
        this.fetchBookings('future', this.futurePageNumber);
      } else if (type === 'past') {
        this.pastPageNumber++;
        this.fetchBookings('past', this.pastPageNumber);
      }
    },
    previousPage(type) {
      if (type === 'current' && this.currentPageNumber > 1) {
        this.currentPageNumber--;
        this.fetchBookings('current', this.currentPageNumber);
      } else if (type === 'future' && this.futurePageNumber > 1) {
        this.futurePageNumber--;
        this.fetchBookings('future', this.futurePageNumber);
      } else if (type === 'past' && this.pastPageNumber > 1) {
        this.pastPageNumber--;
        this.fetchBookings('past', this.pastPageNumber);
      }
    },
    viewCampsite(campsiteId) {
      this.$router.push({ name: 'CampsiteDetails', params: { campsiteId } });
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.fetchBookings('current', this.currentPageNumber);
      this.fetchBookings('future', this.futurePageNumber);
      this.fetchBookings('past', this.pastPageNumber);
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

.my-bookings-page {
  padding: 20px;
  max-width: 1200px;
  margin: 40px auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-prompt {
  text-align: center;
  color: #666;
}

h1, h2 {
  margin: 20px 0;
  color: #333;
  text-align: center;
}

.bookings-section {
  margin-bottom: 30px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: #f0f0f0;
}

.booking-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 5px;
}

.booking-info {
  flex-grow: 1;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.page-number {
  font-weight: bold;
}

button {
  padding: 10px;
  margin: 0 5px;
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

.cancel-button {
  padding: 5px 10px;
  margin-left: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #c82333;
}
</style>
