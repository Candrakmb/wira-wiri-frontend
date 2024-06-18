<script setup>
import Header from '@/components/header.vue';
import HomeUser from '@/components/homeUser.vue';
import Navbar from '@/components/navbar.vue';
import { reactive, onMounted } from 'vue';
import api from '@/api/axios.js'; // Import instance Axios yang telah dikonfigurasi

// State untuk menyimpan data pengguna
const userData = reactive({
  user: null,
  loading: false,
  error: null,
});

// Fungsi untuk memanggil API dan mendapatkan data pengguna
const getUser = async () => {
  userData.loading = true;
  try {
    // Menggunakan Axios untuk memanggil endpoint API yang sesuai
    const response = await api.get('/user');
    userData.user = response.data; // Mengisi data pengguna dari respons API
    console.log(response.data);
  } catch (error) {
    userData.error = error.message; // Menangani kesalahan jika ada
  } finally {
    userData.loading = false; // Menghentikan indikator loading setelah selesai
  }
};

// Memanggil fungsi getUser saat komponen dimuat
onMounted(() => {
  getUser();
});
</script>

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
         <!-- <HomeDriver /> -->
    </div>
  </template>
  <style scoped>
  .position-sticky {
    position: -webkit-sticky; /* Untuk Safari */
    position: sticky;
    top: 0;
    z-index: 10;
  }
  </style>
  

