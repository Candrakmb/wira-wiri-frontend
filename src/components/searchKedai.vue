<template>
    <v-layout>
      <!-- App Bar -->
      <v-app-bar :elevation="0">
        <template v-slot:prepend>
          <v-btn icon="mdi-arrow-left" @click="$router.go(-1)"></v-btn>
        </template>
  
        <!-- Input Search -->
        <v-text-field
          v-model="searchQuery"
          class="mt-6 me-2"
          density="comfortable"
          placeholder="Search resto"
          prepend-inner-icon="mdi-magnify"
          style="max-width: 300px;"
          theme="light"
          variant="solo"
          rounded
        ></v-text-field>
      </v-app-bar>
  
      <v-main v-if="!isLoading">
        <v-container>
            <v-alert v-if="filteredResto.length === 0" type="warning" class="mt-4">
                resto tidak ditemukan, maaf ya
            </v-alert>

          <v-row v-else>
            <v-col v-for="resto in filteredResto" :key="resto.id" cols="12" class="pb-0 pt-1" md="6" lg="4">
                <router-link :to="{ name: 'Menu', params: { id: resto.id } }">
                        <v-card class="resto-card" variant="text">
                            <div class="d-flex flex-no-wrap">
                                <v-avatar class="ma-1" rounded="4" elevation="4" size="100">
                                    <v-img :src="resto.img_url"></v-img>
                                </v-avatar>
                                <div>
                                    <v-card-title class="text-h6 pb-0">
                                        {{ resto.user.name }}
                                    </v-card-title>
                                    <v-card-subtitle>{{ resto.distance }} km</v-card-subtitle>
                                </div>
                            </div>
                        </v-card>
            </router-link>
            <v-divider class="mb-0 mt-2"></v-divider>
            </v-col>
           
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </template>
  
  <script>
  import api from '@/api/axios';
  
  export default {
    data() {
      return {
        searchQuery: "",
        restoList: [],
        latitude: null,
        longitude: null,
        isLoading: true,
      };
    },
    computed: {
      filteredResto() {
        return this.restoList.filter((resto) =>
          resto.user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
    },
    methods: {
        async getDataKedai(){
            try{
                const formData = {
                    latitude: this.latitude, 
                    longitude: this.longitude, 
                    search: '',
                };

                const response = await api.post('/menu/kedai', formData); 
                this.restoList = response.data.kedai;
                console.log(this.restoList);
                this.isLoading = false;
            } catch(error){
                console.log(error);
            }
        }
    },
    mounted() {
      try {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                
                this.getDataKedai();
            }, error => {
                console.error('Error getting location:', error);
            });
            } else {
            console.error('Geolocation is not supported by this browser.');
        }
        
      } catch (error) {
        console.error("Gagal mengambil data resto:", error);
      }
    },
  };
  </script>
  