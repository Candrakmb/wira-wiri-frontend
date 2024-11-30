<!-- eslint-disable vue/multi-word-component-names -->
<script>
import api from '@/api/axios'
import Navbar from '@/components/navbar.vue'
import formatCurrency from '@/mixins/formatCurrency'
export default {
  mixins: [formatCurrency],
  data() {
    return {
      statusDriver: true,
      cardHeight: '100vh',
      isLoading: true,
      orderan: null,
      endTime: null, // Waktu akhir pesanan
      interval: null, // Untuk menyimpan interval
      progress: 0, // Nilai progress bar
      minutesRemaining: 0, // Waktu tersisa dalam menit
      totalTime: 0 // Total waktu dari waktu mulai hingga selesai
    }
  },
  components: {
    Navbar
  },
  watch: {
     statusDriver(newValue) {
      if (newValue) {
            this.cardHeight = '150px';
            this.updateStatusDriver(1);
        } else {
            this.cardHeight = '100vh';
            this.updateStatusDriver(0);
        }
    }
  },
  methods: {
       async loadStatusDriver(){  
          const response = await api.get('profil/status');
          if(response.data.status == 0){
            this.statusDriver = false;
          } else {
            this.statusDriver = true;
          }
          console.log(response)
          this.loadNotifOrderan();
          this.dataDriver();
          this.isLoading=false;
       },
       async updateStatusDriver(status) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async position => {
            const formData = {
              status: status,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            console.log(formData);
            try {
              await api.post('profil/update/status', formData);
            } catch (error) {
              console.error('Error updating status:', error);
            }
          }, error => {
            console.error('Geolocation error:', error);
            alert('Unable to retrieve your location.');
          });
        } else {
          alert('Geolocation is not supported by this browser.');
        }
      },
      async dataDriver(){
        const response = await api.get('user');
        if(response.data.success){
          this.listenOrderan(response.data.user.id);
        }
      },
      async loadNotifOrderan(){
          const response = await api.get('queue');
          if(response.data.orderan != null){
            this.orderan = response.data.orderan.order;
            this.startCountdown(response.data.orderan.end_queue);
            console.log(response.data.orderan.end_queue);
          } else {
            this.orderan = null;
          }
      },
      listenOrderan(id){
        // eslint-disable-next-line no-undef
        Echo.private("notif_driver." + id).listen("NotifyDriver", (data) => {
          this.loadNotifOrderan();
      });
    },
    startCountdown(endTime) {
      // Konversi string endTime menjadi Date object
      this.endTime = new Date(endTime.replace(' ', 'T')).getTime();
      
      // Hitung total waktu dalam detik
      this.totalTime = Math.floor((this.endTime - Date.now()) / 1000); // Total waktu dalam detik
      this.updateProgress(); // Inisialisasi progress

      // Update progress bar setiap detik
      this.interval = setInterval(() => {
        this.updateProgress();
      }, 1000);
    },
    updateProgress() {
      const currentTime = Date.now();
      const timeRemaining = Math.floor((this.endTime - currentTime) / 1000); // Hitung waktu tersisa dalam detik

      if (timeRemaining > 0) {
        this.secondsRemaining = timeRemaining; // Waktu tersisa dalam detik
        this.progress = ((this.totalTime - this.secondsRemaining) / this.totalTime) * 100; // Hitung progress
      } else {
        this.secondsRemaining = 0;
        this.progress = 100;
        clearInterval(this.interval); // Hentikan interval ketika waktu habis
        this.orderan = null;
      }
    },
    async AcceptOrder(){
       const formData = {
          'invoice_number': this.orderan.invoice_number
       }

       const response = await api.post('order/update/driver', formData)
       if(response.data.success){
        this.$router.push('/driver/transaksi/'+ this.orderan.invoice_number);
        console.log(response);
       } else {
        console.log(response);
       } 
    },
  },
  mounted(){
    if(this.statusDriver){
      this.cardHeight = '150px';
    } else {
      this.cardHeight = '100vh';
    }
    this.loadStatusDriver();
  }
}
</script>

<template>
  <v-layout v-if="!isLoading">
    <v-main class="position-fixed w-100">
      <v-card class="rounded-0 position-sticky top-0 text-center my-0" color="#00A9FF"  :height="cardHeight">
        <v-container>
          <label for="toggle" class="toggle-label text-start mt-2">
            <input
              class="circle"
              v-model="statusDriver"
              id="toggle"
              name="toggle"
              type="checkbox"
            />
          </label>
        </v-container>
      </v-card>
      <div v-if="statusDriver && orderan == null" class="d-flex justify-center mt-15">
        <v-empty-state
          image="https://vuetifyjs.b-cdn.net/docs/images/components/v-empty-state/astro-dog.svg"
          size="200"
          text-width="250"
        >
          <template v-slot:media>
            <v-img class="mb-8"></v-img>
          </template>

          <template v-slot:title>
            <div class="text-h6 text-high-emphasis">Belum Ada Orderan Masuk</div>
          </template>

          <template v-slot:text>
            <div class="text-body-1">Cek secara berkala, usahakan tetep menyala</div>
          </template>
        </v-empty-state>
      </div>
      <v-card v-if="statusDriver && orderan != null"  class="rounded-3 mx-2 my-4 elevation-3">
        <v-progress-linear color="#00A9FF" :model-value="progress"></v-progress-linear>
        <v-card-title>
            Orderan {{ orderan.invoice_number }}
            <p class="text-caption">Siapkan uang lebih dari {{ formatCurrency(orderan.subtotal) }}</p>
        </v-card-title>
        <v-card-item class=" mx-3 my-3 px-8 rounded-3 elevation-3">
          <v-row no-gutters>
            <v-col cols="8" class="text-capitalize text-truncate font-weight-bold pt-3" style="max-width: 300px;">
              {{ orderan.pelanggan.user.name }}
            </v-col>
            <v-col cols="4" class="text-center">
              <v-avatar color="#00A9FF" size="50" >
                        <span class="text-h6">Cj</span>
                </v-avatar>
            </v-col>
            <v-divider class="mt-1"></v-divider>
            <v-col cols="6">
              Harga
            </v-col>
            <v-col cols="6" class="text-end">
              {{ formatCurrency(orderan.subtotal) }}
            </v-col>
            <v-col cols="6">
              ongkir dan lainnya
            </v-col>
            <v-col cols="6" class="text-end">
              {{ formatCurrency(orderan.ongkir) }}
            </v-col>
            <v-divider class="mt-2"></v-divider>
            <v-col cols="6" class="font-weight-bold">
              Total
            </v-col>
            <v-col cols="6" class="text-end font-weight-bold">
              {{ formatCurrency(orderan.total_pay) }}
            </v-col>
          </v-row>
        </v-card-item>
        <v-card-actions>
          <v-row>
            <v-col cols="6">
              <v-btn
              class="text-none rounded-3 mb-4"
              color="#00A9FF"
              size="x-large"
              variant="flat"
              block
              @click="AcceptOrder"
            >
              Terima
            </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
              class="text-none rounded-3 mb-4"
              color="red"
              size="x-large"
              variant="flat"
              block
              @click="orderan = null"
            >
              Tolak
            </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-main>
  </v-layout>
  <Navbar />
</template>

<style scoped>
.toggle-label {
  width: 100px;
  height: 50px;
  cursor: pointer;
  display: inline-block;
  padding: 5px;
  background: #272727;
  border-radius: 50px;
  box-shadow: 0px 0px 16px -8px #fefefe;
  user-select: none;
}

.toggle-label::before,
.toggle-label::after {
  content: 'offline';
  overflow: hidden;
  font-size: 40px;
  text-transform: uppercase;
  position: absolute;
  left: 50%;
  top: 70%;
  transition: 200ms;
  transform: translate(-50%, -50%);
  z-index: -10;
  font-family: sans-serif;
  font-weight: 300;
  color: transparent;
  -webkit-text-stroke-color: #ffffff;
  -webkit-text-stroke-width: 1px;
  transition: 700ms;
}

.toggle-label::after {
  content: 'Online';
  transform: translate(0, 10%);
  left: -100%;
  transform: translate(0, -50%);
}

.toggle-label .circle {
  appearance: none;
  position: relative;
  width: 40px;
  height: 40px;
  background: #5e5e5e;
  border-radius: 50%;
  transition: all 0.5s cubic-bezier(1, 0, 0, 1);
  left: 0;
}

.toggle-label .circle:checked {
  background: #f43f5e;
  left: calc(100% - 40px);
}

.toggle-label .circle::before,
.toggle-label .circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  margin-left: 10px;
  border-left-color: #fefefe;
  z-index: 3;
  transition: 200ms;
}

.toggle-label:has(.circle:checked)::before {
  left: 100%;
  transform: translate(0, -50%);
}
.toggle-label:has(.circle:checked)::after {
  left: 50%;
  transform: translate(-50%, -50%);
}
.toggle-label .circle::after {
  border: none;
  margin-left: -5px;
  height: 18px;
  width: 3px;
  background-color: #fefefe;
  transition-delay: 150ms;
}

.toggle-label .circle::before {
  transition-delay: 50ms;
}

.toggle-label .circle:checked::before {
  opacity: 0;
}

.toggle-label .circle:checked::after {
  width: 20px;
  height: 20px;
  margin-left: 0px;
  border-radius: 5px;
}
</style>
