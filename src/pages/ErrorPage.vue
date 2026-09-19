<template>
  <div class="error-page">
    <div class="error-content">
      <h1>404</h1>

      <h2>Page Not Found</h2>

      <p>
        Sorry, the page you're looking for doesn't exist.
      </p>

      <router-link to="/" class="home-button">
        Back to Home
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
  padding: 20px;
}

.error-content {
  max-width: 500px;
}

.error-content h1 {
  font-size: 120px;
  margin: 0;
  font-weight: 900;
  color: #e60000;
}

.error-content h2 {
  font-size: 32px;
  margin: 10px 0;
  color: #111;
}

.error-content p {
  color: #666;
  font-size: 16px;
  margin-bottom: 30px;
}

.home-button {
  display: inline-block;
  padding: 14px 28px;
  background: #111;
  color: white;
  text-decoration: none;
  font-weight: bold;
  border-radius: 4px;
}

.home-button:hover {
  background: #e60000;
}
</style>