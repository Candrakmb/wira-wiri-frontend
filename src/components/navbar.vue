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
      <v-card v-if="role == 'user' && orderRunning != null" class="floating-card" elevation="4"
      prepend-icon="mdi-silverware-fork-knife"
      rel="noopener"
      :subtitle="caption_proses"
      :title="header_proses"
      >
      <template v-slot:append>
        <v-btn :to="'/transaksi/' + orderRunning.invoice_number" rounded="xl" variant="elevated" color="deep-purple-darken-3">
          Pantau
        </v-btn>
      </template>
      </v-card>
        <v-bottom-navigation
        v-model="value"
        v-if="role == 'user'"
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
            <font-awesome-icon icon="fa-solid fa-user" size="2x"/>
          <span>profil</span>
        </v-btn>
      </v-bottom-navigation>
      <v-bottom-navigation
        v-if="role == 'kedai'"
        v-model="value"
        :color="color"
        mode="shift"
        grow
      >
        <v-btn to="/kedai/home">
            <font-awesome-icon icon="fa-solid fa-house" size="2x"/>
            <span>Home</span>
        </v-btn>
      
        <v-btn to="/kedai/menu">
            <font-awesome-icon icon="fa-solid fa-th-list" size="2x"/>
  
          <span>menu</span>
        </v-btn>

        <v-btn to="/kedai/profil">
            <font-awesome-icon icon="fa-solid fa-user" size="2x"/>
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
    orderRunning: null,
    header_proses: null,
    caption_proses: null,
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
        if(this.role == 'user' ){
          this.getOrderRunning();
        } else {
          this.isloading = false;
        }
        console.log(this.role);
      } catch (error) {
        console.log(error);
      }
    },
    async getOrderRunning(){
      try{
        const response = await api.get('order/view/progress');
        if(response.data.success){
            this.orderRunning = response.data.order;
            this.prosesOrder(this.orderRunning.status_order);
            this.listenStatusOrder(this.orderRunning.id);
        } else {
          this.orderRunning = null;
        }
        this.isloading = false;
      } catch(error) {
        console.log(error);
        this.isloading = false;
      }
    },
    prosesOrder($status){
         if($status == 0){
            this.header_proses = "Pesananmu Sedang Diproses";
            this.caption_proses = "masih diproses pesanan mu";
         } else if ($status == 1){
            this.header_proses =  "Berhasil mendapatkan driver";
            this.caption_proses = "yey!, sudah dapat driver nih";
         } else if ($status == 2) {
            this.header_proses =  "Driver menuju resto nih";
            this.caption_proses = "driver menuju resto buat memesan pesananmu";
         } else if ($status == 3) {
            this.header_proses = "Driver menuju resto nih";
            this.caption_proses = "driver menuju ke resto pertama";
         } else if ($status == 4) {
            this.header_proses = "Driver menuju resto nih";
            this.caption_proses = "driver menuju ke resto kedua";
         } else if ($status == 5) {
          this.header_proses = "Driver Sampai diresto";
          this.caption_proses = "driver memesan dan pesananmu sedang dimasak";
         } else if ($status == 6) {
            this.header_proses = "Driver mengantar pesananmu";
            this.caption_proses = "tunggu ya, driver mengantar pesananmu sekarang";
         } else if ($status == 7){
            this.header_proses = "Pesanan sampai";
            this.caption_proses = "pesanan sudah sampai, selamat menikmati makanannya";
         } else if ($status == 8){
            this.header_proses = "Pesanan dibatalkan";
            this.caption_proses = "yah pesanan dibatalkan, maaf";
         }
         console.log(this.header_proses, this.caption_proses);
    },
    listenStatusOrder(id){
        Echo.private("orders." + id).listen("StatusOrder", (data) => {
          if(data.order.status_order >= 1 && data.order.status_order <= 6){
            this.orderRunning = data.order;
            this.prosesOrder(data.order.status_order);
          }
      });
    },
  },
  mounted() {
    this.getUser();
  },
}
</script>

<style scoped>
.card_order {
  width: 100%;
  position: sticky;
  bottom: 0;
  margin-bottom: 300px;
  z-index: 99999;
  background: white;
}
.floating-card {
    bottom: 55px;
    border-radius: 10px 10px 0 0;
    z-index: 1004;
    transform: translateY(0px);
    position: fixed;
    left: 0px;
    width: calc(100% + 0px);
}
</style>