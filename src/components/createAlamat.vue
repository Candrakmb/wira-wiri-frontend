<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar :elevation="2" >
        <template v-slot:prepend>
          <v-btn @click="$router.go(-1)">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>

        <v-app-bar-title>Tambah Alamat</v-app-bar-title>
      </v-app-bar>
      <v-main >
        <v-container class="p-0" max-height="500">
          <div id="map" ></div>
        </v-container>
        <v-card
  >
  
    <v-form
        v-model="form"
        @submit.prevent="onSubmit"
    >
    
    <v-card-text>
      <v-row dense>
        <v-col
          cols="12"
          md="4"
          sm="6"
          v-if = "success"
        >
        <v-alert
        color="success"
        icon="$success"
        title="update berhasil"
        ></v-alert> 
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="6"
        >
            <v-textarea
            v-model="address"
            :rules="[required]"
            :readonly="loading"
            prepend-inner-icon="mdi-map-marker"
            variant="solo"
          ></v-textarea>
        </v-col>

        <v-col
          cols="12"
          md="4"
          sm="6"
        >
          <v-text-field
            v-model="detail_alamat"
            :rules="[required]"
            label="Tambah patokan"
            prepend-inner-icon="mdi-flag-triangle"
            variant="solo"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
          sm="6"
        >
          <div class="text-subtitle-1 text-medium-emphasis">Nama Alamat</div>
          <v-text-field
            density="compact"
            v-model="tipe_alamat"
            :rules="[required]"
            placeholder="cth: rumah/kos"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>


    <v-card-actions>
      <v-btn
        :disabled="!form"
        :loading="loading"
        color="deep-purple-darken-3"
        text="Save"
        variant="flat"
        type="submit"
        block
      ></v-btn>
     
    </v-card-actions>
    </v-form>
  </v-card>
      </v-main>
      
    </v-app>
  </v-responsive>
  
  
</template>
<script>
import api from '@/api/axios.js';
import L from 'leaflet';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      form: true,
      loading: false,
      loadingData: false,
      map: null,
      latitude: null, 
      longitude: null,
      tipe_alamat: null,
      marker: null,
      address: null,
      detail_alamat: null,
      alamat_by_id: null
    };
  },
  methods: {
    async onSubmit() {
      if (!this.form) return;
      let formData = {
        alamat: this.address,
        tipe_alamat: this.tipe_alamat,
        detail_alamat: this.detail_alamat,
        latitude: this.latitude,
        longitude: this.longitude
      };

      if (this.$route.params.type !== 'create') {
        formData.id = this.$route.params.type;
      }
     
      this.loading = true;
      try {
        let response;
        let text;
        if (this.$route.params.type == 'create') {
          response = await api.post('profil/create/alamat', formData);
          text = "Alamat berhasil diubah"
        } else {
          response = await api.post('profil/update/alamat', formData);
          text = "Alamat berhasil diubah"
        }
        console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: text,
        }).then(() => {
          this.loading = false;
          this.$router.go(-1);
        });
      } catch (error) {
        console.error('Error updating profile', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error,
        }).then(() => {
          this.loading = false;
        });
      }
    },
    async getAlamat(id) {
      this.loadingData = true;
      try {
        const response = await api.get(`profil/detail/alamat/${id}`);
        console.log(response.data);
        this.alamat_by_id = response.data.alamat;
        this.latitude = this.alamat_by_id.latitude;
        this.longitude = this.alamat_by_id.longitude;
        this.address = this.alamat_by_id.alamat;
        this.detail_alamat = this.alamat_by_id.detail_alamat;
        this.tipe_alamat = this.alamat_by_id.tipe_alamat;
        this.loadingData = false;
        this.initializeMap();
      } catch (error) {
        console.error('Error updating profile', error);
      }
    },
    initializeMap() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          if (this.$route.params.type == 'create') {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
          }
          console.log(this.detail_alamat)
          this.map = L.map('map', { zoomControl: false }).setView([this.latitude, this.longitude], 19);
          L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 19,
            attribution: '',
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
          }).addTo(this.map);
          this.marker = L.marker([this.latitude, this.longitude]).addTo(this.map);
          this.marker.on('moveend', this.updateLatLng);
          this.map.on('moveend', this.updateLatLng);
          
          if (this.$route.params.type == 'create') {
            this.updateLatLng();
          }
        }, error => {
          console.error('Error getting location:', error);
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    },
    updateMarkerPosition() {
      const center = this.map.getCenter();
      this.marker.setLatLng(center, { animate: true, duration: 1 });
    },
    updateLatLng() {
      const latlng = this.marker.getLatLng();
      this.latitude = latlng.lat;
      this.longitude = latlng.lng;
      this.getAddress(this.latitude, this.longitude);
    },
    async getAddress(lat, lng) {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
          params: {
            lat: lat,
            lon: lng,
            format: 'json',
          },
        });
        //cara mendapatkan desa saja

        const city = response.data.address.state;
        console.log(city);
        this.address = response.data.display_name;
      } catch (error) {
        console.error('Error getting address:', error);
      }
    },
    required(v) {
      return !!v || 'Wajib diisi ya';
    },
  },
  async mounted() {
    if (this.$route.params.type != 'create') {
      await this.getAlamat(this.$route.params.type);
    } else {
      this.initializeMap();
    }
  },
};


</script>

<style scoped>
    #map {
        height: 400px;
    }
</style>