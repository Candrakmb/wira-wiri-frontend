<template>
    <v-btn
      class="ms-1 text-capitalize"
      size="small"
      text="Logout"
      variant="flat"
      color="deep-purple-darken-3"
      rounded="3"
      width="100"
      height="30"
      @click="handleLogout"
    ></v-btn>
  </template>
  
  <script>
  import api from '@/api/axios.js'; // Mengimpor instance Axios yang dikonfigurasi
  import { mapActions } from 'vuex';
  
  export default {
    methods: {
      ...mapActions(['logout']),
      async handleLogout() { // Mengganti nama metode di komponen
        try {
          // Menambahkan flag khusus untuk request logout
          const response = await api.post('/logout', {}, { headers: { 'x-skip-refresh': 'true' } });
          
          // Panggil Vuex action logout
          await this.$store.dispatch('logout');
          
          // Navigasi ke halaman login
          this.$router.push('/login'); 
        } catch (error) {
          this.errorMessage = error; // Pesan error default
        }
      }
    }
  };
  </script>
  