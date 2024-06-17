<template>
  <div class="campsite-details">
    <img v-if="campsite.imageUrl && campsite.active && !campsite.terminated" :src="getImageUrl(campsite.imageUrl)" alt="Campsite Image" class="campsite-image" />
    <h1>{{ campsite.name }}</h1>
    <p v-if="campsite.terminated || !campsite.active" class="unavailable">Campsite is not available</p>
    <div v-else>
      <p class="description">{{ campsite.description }}</p>
      <p class="location">{{ campsite.country }}, {{ campsite.town }}, {{ campsite.address }}</p>
      <p class="bookings">Bookings: {{ campsite.numberOfBookings }}</p>

      <div v-if="campsite.features && campsite.features.length" class="features-section">
        <h2>Features</h2>
        <ul>
          <li v-for="feature in campsite.features" :key="feature.featureId">{{ feature.name }}</li>
        </ul>
      </div>

      <div v-if="campsite.terrains && campsite.terrains.length" class="terrains-section">
        <h2>Terrains</h2>
        <ul>
          <li v-for="terrain in campsite.terrains" :key="terrain.terrainId">{{ terrain.name }}</li>
        </ul>
      </div>

      <h2 v-if="isLoggedIn">Book this Campsite</h2>
      <form v-if="isLoggedIn" @submit.prevent="bookCampsite">
        <div>
          <label for="datestart">Start Date:</label>
          <input type="date" v-model="datestart" :min="today" required />
        </div>
        <div>
          <label for="dateend">End Date:</label>
          <input type="date" v-model="dateend" :min="datestart" required />
        </div>
        <button type="submit">Book Campsite</button>
      </form>
      <p v-else>Please log in to book this campsite.</p>

      <h2>Comments</h2>
      <ul v-if="comments.length">
        <li v-for="comment in comments" :key="comment.commentId">
          <p><strong>{{ comment.userName }}</strong>: {{ comment.commentText }} ({{ comment.rating }}/5)</p>
          <p class="comment-date">{{ formatTimestamp(comment.timestamp) }}</p>
        </li>
      </ul>
      <p v-else>No comments yet.</p>

      <h2 v-if="isLoggedIn">Leave a Comment</h2>
      <form v-if="isLoggedIn" @submit.prevent="addComment">
        <div>
          <label for="commentText">Comment:</label>
          <textarea v-model="commentText" required></textarea>
        </div>
        <div>
          <label for="rating">Rating:</label>
          <input type="number" v-model="rating" min="1" max="5" required />
        </div>
        <button type="submit">Submit Comment</button>
      </form>
      <p v-else>Please log in to leave a comment.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'CampsiteDetailsPage',
  data() {
    return {
      campsite: {},
      datestart: '',
      dateend: '',
      today: new Date().toISOString().split('T')[0],
      comments: [],
      commentText: '',
      rating: 5
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  async created() {
    const campsiteId = this.$route.params.campsiteId;
    await this.fetchCampsiteDetails(campsiteId);
    await this.fetchComments(campsiteId);
  },
  methods: {
    getImageUrl(imagePath) {
      return `https://localhost:5151${imagePath}`;
    },
    async fetchCampsiteDetails(campsiteId) {
      try {
        const response = await axios.get(`https://localhost:5151/Campsite/${campsiteId}`);
        this.campsite = response.data;
      } catch (error) {
        console.error('Error fetching campsite details:', error);
      }
    },
    async fetchComments(campsiteId) {
      try {
        const response = await axios.get(`https://localhost:5151/Campsite/${campsiteId}/comments`);
        this.comments = response.data.comments;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async bookCampsite() {
      if (!this.validateDates()) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('https://localhost:5151/Campsite/bookCampsite', {
          token,
          campsiteId: this.campsite.campsiteId,
          dateStart: this.datestart,
          dateEnd: this.dateend
        });

        alert(response.data.message);
        await this.fetchCampsiteDetails(this.campsite.campsiteId);
      } catch (error) {
        console.error('Error booking campsite:', error);
        alert('An error occurred while booking the campsite.');
      }
    },
    async addComment() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('https://localhost:5151/Campsite/addComment', {
          token,
          campsiteId: this.campsite.campsiteId,
          commentText: this.commentText,
          rating: this.rating
        });

        alert(response.data.message);
        await this.fetchComments(this.campsite.campsiteId);
        this.commentText = '';
        this.rating = 5;
      } catch (error) {
        console.error('Error adding comment:', error);
        alert('An error occurred while adding the comment.');
      }
    },
    validateDates() {
      const today = new Date().toISOString().split('T')[0];

      if (this.datestart < today) {
        alert('Start date cannot be in the past.');
        return false;
      }

      if (this.dateend < this.datestart) {
        alert('End date cannot be earlier than start date.');
        return false;
      }

      return true;
    },
    formatTimestamp(timestamp) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Date(timestamp).toLocaleString(undefined, options);
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

.campsite-details {
  padding: 20px;
  max-width: 800px;
  margin: 40px auto;
  font-family: 'Roboto', sans-serif;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.campsite-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}

h1 {
  margin: 20px 0;
  color: #333;
  font-size: 2.5em;
}

p.description {
  margin: 10px 0;
  color: #666;
  line-height: 1.6;
}

p.location, p.bookings, p.unavailable {
  margin: 10px 0;
  color: #888;
}

.features-section, .terrains-section {
  margin-top: 30px;
}

.features-section h2, .terrains-section h2 {
  color: #444;
}

.features-section ul, .terrains-section ul {
  list-style-type: none;
  padding: 0;
}

.features-section ul li, .terrains-section ul li {
  background-color: #f9f9f9;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

form {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

form div {
  margin-bottom: 10px;
}

form label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

form input, form textarea {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  color: #333;
}

form input[type="date"] {
  width: 80%;
}

button {
  padding: 10px 20px;
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

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

ul li p {
  margin: 5px 0;
}

h2 {
  margin-top: 30px;
  color: #444;
}

textarea {
  height: 100px;
  resize: vertical;
}

.comment-author {
  font-weight: bold;
  color: #333;
}

.comment-text {
  margin: 5px 0;
  color: #666;
}

.comment-date {
  font-size: 0.9em;
  color: #999;
}
</style>
