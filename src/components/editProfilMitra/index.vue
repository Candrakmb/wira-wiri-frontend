<!-- eslint-disable vue/multi-word-component-names -->
<script>
import api from '@/api/axios.js'
import L from 'leaflet';
import axios from 'axios';
import Swal from 'sweetalert2';
import { VDateInput } from 'vuetify/labs/VDateInput'


export default {
  components: {
    VDateInput,
  },
  data() {
    return {
        user: null,
        role: null,
        isLoading : true,
        dialogKedai: false,
        isButtonActive: false,
        requiredRule: [ (value) => !!value || 'Wajib Diisi.' ],
        imageRule: [(value) => {
                    return !value || !value.length || value[0].size < 2000000 || 'Gambar melebihi batas maksimum 2 mb!'
                    }],
        emailRule: [
          value => !!value || 'E-mail is required.',
          value => /.+@.+\..+/.test(value) || 'E-mail must be valid.'
        ],
        whatsappRule:[
          value => !!value || 'Nomer WhatsApp is required.',
          value => /^\+62\d{8,12}$/.test(value) || 'Nomor telepon harus valid dan dalam format +628XXXXXXXXX.'
        ],
        FormData : {
            profil:[],
            name: '',
            email: '',
            no_whatsapp: '',
            alamat: '',
            no_plat: '',
            latitude: '',
            longitude: '',
            jenis_kelamin: '',
            tanggal_lahir: null,
        },
        imageUrl: '',
        updateLokasi : {
            alamat: '',
            latitude: '',
            longitude: '',
        },
        map: null,
        marker: null,
        btnLoading: false,
    }
  },
  methods: {
    async userData(){
        const response = await api.get('user');
        if (response.data.success) {
            this.user = response.data.user;
            this.role = response.data.role[0];
            console.log(response.data)
            this.FormData.name = this.user.name;
            this.FormData.email = this.user.email;
            if( this.role == 'driver'){
                this.FormData.no_whatsapp = this.user.driver[0].no_whatsapp;
                this.FormData.alamat = this.user.driver[0].alamat;
                this.FormData.no_plat = this.user.driver[0].no_plat;
                this.FormData.jenis_kelamin = this.user.driver[0].jenis_kelamin;
                this.imageUrl = this.user.driver[0].img_url;
                this.FormData.tanggal_lahir = new Date(this.user.driver[0].tanggal_lahir);
            } else {
                this.FormData.no_whatsapp = this.user.kedai[0].no_whatsapp;
                this.FormData.alamat = this.user.kedai[0].alamat;
                this.FormData.latitude = this.user.kedai[0].latitude;
                this.FormData.longitude = this.user.kedai[0].longitude;
                this.imageUrl = this.user.kedai[0].img_url;
            }
        }
        this.isLoading = false;
    },
    createImage(file) {
      if (!(file instanceof Blob || file instanceof File)) {
        console.error('Parameter is not a Blob or File');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target.result; // Menyimpan URL gambar setelah file dibaca
      };
      reader.readAsDataURL(file); // Membaca file sebagai URL Data
    },
    onFileChange(event) {
      const file = event.target.files[0]; // Mendapatkan file dari event input

      if (!file) {
        return; // Jika tidak ada file yang dipilih
      }

      this.createImage(file); // Mengirim file untuk diproses
    },
    openDialogKedai(){
        this.dialogKedai = true;
        this.updateLokasi.alamat = this.user.kedai[0].alamat;
        this.updateLokasi.latitude = this.user.kedai[0].latitude;
        this.updateLokasi.longitude = this.user.kedai[0].longitude;
        console.log(this.updateLokasi)
        this.$nextTick(() => {
                this.initializeMap();
        });
    },
    initializeMap() {
    console.log(this.updateLokasi.latitude, this.updateLokasi.longitude);
    this.map = L.map('map', { zoomControl: false }).setView([this.updateLokasi.latitude, this.updateLokasi.longitude], 19);
    
    L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 19,
        attribution: '',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(this.map);
    
    // Inisialisasi marker di pusat awal peta
    this.marker = L.marker([this.updateLokasi.latitude, this.updateLokasi.longitude]).addTo(this.map);
    
    // Event listener ketika peta digeser, perbarui posisi marker
    this.map.on('move', this.updateMarkerPosition);
    this.map.on('moveend', this.updateLatLng.bind(this));
},

updateMarkerPosition() {
    // Set marker sesuai dengan posisi pusat peta saat ini
    const center = this.map.getCenter();
    this.marker.setLatLng(center);
},
updateLatLng() {
    const latlng = this.marker.getLatLng();
    this.updateLokasi.latitude = latlng.lat;
    this.updateLokasi.longitude = latlng.lng;
    this.getAddress(this.updateLokasi.latitude, this.updateLokasi.longitude);
},
async getAddress(lat, lng) {
      console.log(lat, lng);
      try {
          const apiKey = import.meta.env.VITE_OPENROUTE_KEY;
          const response = await axios.get(`https://api.openrouteservice.org/geocode/reverse`, {
              params: {
                  api_key: apiKey, 
                  'point.lon': lng, // Format lon diikuti nilai
                  'point.lat': lat, // Format lat diikuti nilai
                  format: 'json'
              },
              headers: {
                  'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8' 
              }
          });

          // ORS menyediakan address lebih lengkap, sesuaikan bagian ini sesuai kebutuhan
          const address = response.data.features[0].properties.label;
          console.log(address);
          this.updateLokasi.alamat = address;
      } catch (error) {
          console.error('Error getting address:', error);
      }
  },
  setUpdateLokasi(){
    this.FormData.alamat = this.updateLokasi.alamat;
    this.FormData.latitude = this.updateLokasi.latitude;
    this.FormData.longitude = this.updateLokasi.longitude;
    this.dialogKedai = false;
  },
  async submitUpdateProfil(){
    const { valid } = await this.$refs.form.validate()
    if (valid) {
        if (this.FormData.tanggal_lahir) {
            const tanggal = new Date(this.FormData.tanggal_lahir);
            this.FormData.tanggal_lahir = tanggal.toISOString().split('T')[0];
        }
        const formData = this.FormData;
        this.btnLoading = true;
        try{
            const response = await api.post('profil/update', formData ,{
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if(response.data.success){
              this.btnLoading = false;
              await Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Update Profil Berhasil",
                  showConfirmButton: false,
                  timer: 1500
              });
              if(this.role == 'driver'){
                  this.$router.push('/driver/profil');
              } else {
                  this.$router.push('/kedai/profil');
              }
            } else {
                this.btnLoading = false;
                console.log(response.data)
            }
        } catch (error){
            console.error('Error updating profile', error);
            this.btnLoading = false;
        }
      console.log(formData);
    }
  }

  },
  mounted() {
    this.userData();
  },
}
</script>

<template>
    <v-layout v-if="!isLoading">
        <v-app-bar :elevation="2">
            <template v-slot:prepend>
                <v-btn @click="$router.go(-1)">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </template>
            <v-app-bar-title>Edit Profil</v-app-bar-title>
        </v-app-bar>
        <v-main>
            <v-form ref="form">
                <v-row class="p-3">
                    <v-col cols="12" class="text-center mb-3">
                        <h4>Preview</h4>
                        <v-avatar
                            color="grey"
                            size="100"
                        >
                            <v-img :src="imageUrl" cover></v-img>
                        </v-avatar>
                    </v-col>
                    <v-col cols="12">
                        <v-file-input
                            v-model="FormData.profil"
                            :rules="imageRule"
                            accept="image/png, image/jpeg, image/bmp"
                            label="Profil"
                            placeholder="Pilih gambar menu"
                            prepend-icon="mdi-camera"
                            density="compact"
                            variant="outlined"
                            @change="onFileChange"
                            rounded
                            show-size
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                        v-model="FormData.name" 
                        :rules="requiredRule"
                        density="compact"
                        label="Nama"
                        variant="outlined"
                        placeholder="contoh: rujak"
                        rounded
                        clearable
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                        v-model="FormData.email" 
                        :rules="emailRule"
                        density="compact"
                        label="Email"
                        variant="outlined"
                        placeholder="contoh: rujak"
                        rounded
                        clearable
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                        v-model="FormData.no_whatsapp" 
                        :rules="whatsappRule"
                        density="compact"
                        label="Whatsapp"
                        variant="outlined"
                        placeholder="+62"
                        rounded
                        clearable
                        ></v-text-field>
                    </v-col>
                    <v-col v-if="role == 'driver'"  cols="12">
                        <v-text-field
                        v-model="FormData.alamat" 
                        :rules="requiredRule"
                        density="compact"
                        label="Alamat"
                        variant="outlined"
                        placeholder="contoh: rujak"
                        rounded
                        clearable
                        ></v-text-field>
                    </v-col>
                     <v-col v-if="role == 'driver'"  cols="12">
                        <v-date-input
                        v-model="FormData.tanggal_lahir" 
                        :rules="requiredRule"
                        prepend-icon=""
                        density="compact"
                        label="Tanggal_lahir"
                        variant="outlined"
                        placeholder="contoh: rujak"
                        rounded
                        clearable
                        ></v-date-input>
                    </v-col>
                     <v-col v-if="role == 'driver'"  cols="12">
                        <v-select
                        v-model="FormData.jenis_kelamin"
                        :rules="requiredRule"
                        label="Jenis Kelamin"
                        density="compact"
                        variant="outlined"
                        placeholder="contoh: rujak"
                        rounded
                        clearable
                        :items="['laki-laki', 'perempuan',]"
                        ></v-select>
                    </v-col>
                    <v-col v-if="role == 'driver'"  cols="12">
                        <v-text-field
                        v-model="FormData.no_plat" 
                        :rules="requiredRule"
                        density="compact"
                        label="Plat nomer"
                        variant="outlined"
                        placeholder="contoh: rujak"
                        rounded
                        clearable
                        ></v-text-field>
                    </v-col>
                   
                    <v-col v-if="role == 'kedai'" class="px-3" cols="12">
                        <v-card   rounded="3">
                            <v-card-title>
                                Alamat
                            </v-card-title>
                            <v-card-text class="d-flex justify-content-between">
                                <p class="d-flex align-items-center mb-0 pe-1"> {{ FormData.alamat }}</p>
                                <v-btn @click="openDialogKedai" rounded color="blue">
                                    Ubah
                                </v-btn>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-container class="w-100 px-5 position-sticky bottom-0 bg-white">
                    <v-btn color="blue" rounded @click="submitUpdateProfil" class="text-none" block>
                        Simpan
                    </v-btn>
                </v-container>
        </v-form>
        </v-main>
        <v-dialog
            v-model="dialogKedai"
            transition="dialog-bottom-transition"
            fullscreen
        >
        <v-card>
            <v-toolbar class="position-sticky top-0 bg-white" elevation="3">
                <v-btn
                icon="mdi-close"
                @click="dialogKedai = false"
                ></v-btn>

                <v-toolbar-title>Ubah lokasi</v-toolbar-title>
            </v-toolbar>
            <v-container class="p-0" max-height="500">
                <div id="map"></div>
            </v-container>
            <v-container class="mt-4">
                <v-textarea
                    v-model="updateLokasi.alamat" 
                    density="compact"
                    label="Lokasi"
                    variant="outlined"
                    placeholder="contoh: rujak"
                    rounded
                    auto-grow
                    filled
                    clearable
                    rows="1"
                    max-rows="5"
                ></v-textarea>
            </v-container>
        </v-card>
        <v-container class="w-100 px-5 position-sticky bottom-0 bg-white elevation-3">
                    <v-btn :loading="btnLoading" @click="setUpdateLokasi" color="blue" rounded class="text-none" block>
                        Simpan
                    </v-btn>
        </v-container>
        </v-dialog>
    </v-layout>
  
</template>

<style scoped>
/* From Uiverse.io by alexruix */ 
.select-group {
 position: relative;
}

.select-custom {
 width: 100%;
 height: 40px;
 border: solid 1.5px #9e9e9e;
 border-radius: 1rem;
 background: none;
 padding: 0 1rem;
 font-size: 1rem;
 color: #000000;
 transition: border 150ms cubic-bezier(0.4,0,0.2,1);
}

.user-label {
 position: absolute;
 left: 15px;
 color: #e8e8e8;
 pointer-events: none;
 transform: translateY(1rem);
 transition: 150ms cubic-bezier(0.4,0,0.2,1);
}

.select-custom:focus, 
select:valid {
  outline: none;
  border: 1.5px solid #000000;
}

.select-custom:focus ~ label, 
select:valid ~ label {
  transform: translateY(-50%) scale(0.8);
  background-color: #ffffff;
  padding: 0 .2em;
  color: #000000;
}
#map {
  height: 300px;
}
</style>
