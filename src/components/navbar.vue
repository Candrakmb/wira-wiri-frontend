<template>
    <v-layout v-if="isloading" style="height: 70px;" >
      <v-container style="height: 70px;" class="position-fixed bottom-0 w-100 p-0 pb-1 pt-1 ps-5 bg-white">
        <v-row class="d-flex justify-space-between">
          <v-col>
            <v-skeleton-loader type="button"></v-skeleton-loader>
          </v-col>
          <v-col>
            <v-skeleton-loader type="button"></v-skeleton-loader>
          </v-col>
          <v-col>
            <v-skeleton-loader type="button"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>
    </v-layout>
    <v-layout v-if="!isloading" style="height: 70px;" >
      <v-bottom-navigation
        v-if="role == 'user'"
        v-model="value"
        :color="color"
        mode="shift"
        grow
      >
        <v-btn to="/">
            <font-awesome-icon icon="fa-solid fa-house" size="2x"/>
            <span>Home</span>
        </v-btn>
      
        <v-btn to="/food">
            <font-awesome-icon icon="fa-solid fa-utensils" size="2x"/>
  
          <span>Wi-Food</span>
        </v-btn>

        <v-btn to="/order">
            <font-awesome-icon icon="fa-solid fa-clipboard" size="2x"/>
  
          <span>Pesanan</span>
        </v-btn>
      </v-bottom-navigation>
      <v-bottom-navigation
        v-if="role == 'driver'"
        v-model="value"
        :color="color"
        mode="shift"
        grow
      >
        <v-btn to="/driver/home">
            <font-awesome-icon icon="fa-solid fa-house" size="2x"/>
            <span>Home</span>
        </v-btn>
      
        <v-btn to="/driver/orderan">
            <font-awesome-icon icon="fa-solid fa-th-list" size="2x"/>
  
          <span>orderan</span>
        </v-btn>

        <v-btn to="/driver/profil">
            <font-awesome-icon icon="fa-solid fa-clipboard" size="2x"/>
          <span>profil</span>
        </v-btn>
      </v-bottom-navigation>
    </v-layout>
  </template>
<script>
import api from '@/api/axios.js'
export default {
  data: () => ({ 
    value: 1,
    role: null,
    isloading: true,
   }),

  computed: {
    color () {
      switch (this.value) {
        default: return 'deep-purple-darken-3'
      }
    },
  },
  methods: {
    async getUser(){
      try {
        const response = await api.get('/user');
        this.role = response.data.role[0];
        console.log(this.role);
        this.isloading = false;
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.getUser();
  },
}
</script>