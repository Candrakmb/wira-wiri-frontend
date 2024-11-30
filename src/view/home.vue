<script setup>
import Header from '@/components/header.vue';
import HomeUser from '@/components/homeUser.vue';
import Navbar from '@/components/navbar.vue';
import { reactive, onMounted } from 'vue';
import api from '@/api/axios.js'; 
import { activatedNotifikasi, activatedLocation } from '@/pushNotifikasi';
// import logout from '@/components/logout.vue';


// State untuk menyimpan data pengguna
const userData = reactive({
  user: null,
  loading: false,
  error: null,
});

// Fungsi untuk memanggil API dan mendapatkan data pengguna
const getUser = async () => {
  userData.loading = true;
    api.get('/user').then(res => {
      if (!res.data.success) {
      console.log(res.data);
      this.$store.commit('setToken', res.data.token);
      userData.user = res.data;
    } else {
      console.log(res.data);
      userData.user = res.data;
    }
    }).catch(err => {
      console.log(err);
    })
  
};
   

// Memanggil fungsi getUser saat komponen dimuat
onMounted(() => {
  getUser();
  activatedNotifikasi();
  activatedLocation();
});
</script>

<template>
    <div>
      <!-- Header yang sticky -->
      <div class="position-sticky">
        <Header />
        <!-- <logout /> -->
      </div>
      
      <!-- Konten Utama -->
        <HomeUser />
      <!-- Navbar di bagian bawah -->
        <Navbar />
         <!-- <HomeDriver /> -->
    </div>
  </template>

  <script>
    // import { mapGetters } from 'vuex';
    export default {
      // computed:{
      //     ...mapGetters(['user'])
      // }
    }
  </script>

  <style scoped>
  .position-sticky {
    position: -webkit-sticky; /* Untuk Safari */
    position: sticky;
    top: 0;
    z-index: 10;
  }
  </style>
  

