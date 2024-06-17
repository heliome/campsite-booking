<template>
  <div class="home">
    <div class="home-container">
      <h1>Welcome to Campsite Booking System</h1>
      <p>Experience nature like never before. Book your perfect campsite today!</p>
      <div class="company-info">
        <h2>About Us</h2>
        <p>We are dedicated to providing the best camping experiences. Whether you are looking for a remote getaway or a family-friendly camping site, we have something for everyone.</p>
        <h2>What We Offer</h2>
        <ul>
          <li>Wide selection of campsites</li>
          <li>Easy and secure booking process</li>
          <li>Customer support available 24/7</li>
          <li>Detailed campsite information and reviews</li>
          <li>Special discounts and offers</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(to right, #4e54c8, #8f94fb);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.home-container {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
}

h1 {
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  color: #555;
}

.company-info {
  margin-top: 2rem;
  text-align: left;
}

h2 {
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

li::before {
  content: '✔️';
  margin-right: 0.5rem;
  color: #4e54c8;
}
</style>
