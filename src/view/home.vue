<template>
    <div>
      <!-- Header yang sticky -->
      <div class="position-sticky">
        <Header />
      </div>
      
      <!-- Konten Utama -->
        <HomeUser />
      <!-- Navbar di bagian bawah -->
        <Navbar />
    </div>
  </template>
  
  <script>
  import Header from '@/components/header.vue';
  import HomeUser from '@/components/homeUser.vue';
  import Navbar from '@/components/navbar.vue';
  
  export default {
    name: 'App',
    components: {
      Header,
      HomeUser,
      Navbar
    }
  }
  </script>
  
  <style>
  .position-sticky {
    position: -webkit-sticky; /* Untuk Safari */
    position: sticky;
    top: 0;
    z-index: 10;
  }
  </style>
  

