<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-undef -->
<template>
  <v-layout  class="rounded rounded-md bg-grey-lighten-3">
    <v-app-bar title="Rincian Pesananmu" elevation="0">
      <template v-slot:prepend>
          <v-btn  @click="$router.push('/')" icon="mdi-arrow-left"></v-btn>
      </template>
      
    </v-app-bar>
    
    <v-main   class="mx-auto" height="100vh">
      <div v-if="!isLoading && order.status_order == 6" class="w-100" style="position: sticky; top: 64px; z-index: 1000">
        <div id="map"></div>
      </div>
          

      <v-sheet
          v-if="!isLoading"
          class="pb-3 buttom-0"
          color="grey-lighten-3"
      >
        <!-- card status order -->
        <v-card class="text-center py-3" rounded="0">
          <v-card-title class="pb-0">{{header_proses}}</v-card-title>
          <v-card-subtitle>{{ caption_proses }}</v-card-subtitle>
        </v-card>
       
        <!-- card driver -->
        <v-card v-if="driver != null" class="mx-4 my-4 px-4 py-2" rounded="3">
          <v-row align="center" justify="center" dense>
            <v-col cols="6" class="text-capitalize font-weight-bold">
                {{driver.user.name}}
            </v-col>
            <v-col cols="6" class="text-end">
              <a target="_blank" :href="'https://wa.me/' + driver.no_whatsapp">
              <v-btn
                class="ma-1"
                color="blue"
                icon="mdi-phone"
                size="x-small"
              ></v-btn></a>
              <v-btn
                class="ma-1"
                color="blue"
                icon="mdi-chat"
                size="x-small"
                @click="openChat()"
              ></v-btn> 
            </v-col>
            <v-divider class="my-1"></v-divider>
            <v-col cols="8" >
                <p class="font-weight-bold mb-1">{{driver.   no_plat}}</p>
                <p class="text-caption mb-1">chat driver bila perlu</p>
                
            </v-col>
            <v-col cols="4" class="text-end">
              <v-avatar
                color="grey"
                rounded="1"
                size="60"
                >
              <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover></v-img>
              </v-avatar>
            </v-col>
          </v-row>
        </v-card>
         <!-- card resto & tujuan -->
         <v-card class="mx-4 my-4 px-4 py-3" rounded="3">
          <v-timeline truncate-line="both" side="end"  density="compact">
            <v-timeline-item
              v-for="kedais in kedai" :key="kedais.id"
              dot-color="blue" 
              icon="mdi-silverware-fork-knife" 
              fill-dot
              >
              <v-container class="px-0 py-0">
                <p class="mb-0 text-capitalize font-weight-bold">{{ kedais.kedai.user.name }}</p>
                <p class="mb-1 text-caption d-inline-block text-truncate">{{ kedais.kedai.alamat}}</p>
              </v-container>
            </v-timeline-item>
            <v-timeline-item
              class="px-0" 
              dot-color="blue" 
              icon="mdi-map-marker" 
              fill-dot
              >
              <v-container class="px-0 py-0">
                <p class="mb-0 text-capitalize font-weight-bold">{{ tujuan.alamat_pelanggan.tipe_alamat }}</p>
                <p class="mb-1 text-caption d-inline-block text-truncate" style="max-width: 200px;">{{ tujuan.alamat_pelanggan.alamat }}</p>
              </v-container>
            </v-timeline-item>
          </v-timeline>
        </v-card>
        <!-- card rincian order -->
         <v-card class="mx-4 my-4 px-4 py-2" rounded="3">
            <v-card-title class="px-0">Pesanan</v-card-title>
            <v-card-text class="px-0">
              <v-row v-for="menu in menu_order" :key="menu.id" class="mb-2" no-gutters>
                <v-col cols="10" class="text-subtitle-1 text-capitalize">
                  {{menu.menu}}
                </v-col>
                <v-col cols="2" class="text-subtitle-1 text-end">
                  {{ menu.qty }}
                </v-col>
                <v-col v-if="menu.ekstra.length > 0 || menu.catatan != null" cols="12">
                  <v-sheet class="px-3 py-1" color="grey-lighten-3" rounded="1">
                    <div v-if="menu.ekstra.length > 0">
                      <div v-for="ekstra in menu.ekstra" :key="ekstra.id">
                        - {{ekstra.nama_kategori}} : {{ekstra.nama_pilihan}}
                      </div>
                    </div>
                    <div v-if="menu.catatan != null"> 
                      catatan : {{menu.catatan}}
                    </div>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-card-text>
         </v-card>
         <!-- card ringkasan pemayaran  -->
         <v-card class="mx-4 my-4 px-4 py-2" rounded="3">
            <v-card-title class="px-0">Ringkasan Pembayaran</v-card-title>
            <v-card-text class="px-0 py-1 text-subtitle-1 font-weight-regular">
              <v-row no-gutters>
                <v-col cols="8">
                  <p>Harga</p>
                </v-col>
                <v-col class="text-end" cols="4" >
                  {{formatCurrency(order.subtotal)}}
                </v-col> 
                <v-col cols="8">
                  <p>pengiriman dan lainnya</p>
                </v-col>
                <v-col class="text-end" cols="4" >
                  {{formatCurrency(order.ongkir)}}
                </v-col> 
                <v-divider class="mt-1"></v-divider>
                <v-col cols="6">
                  <p class="font-weight-bold">Total</p>
                </v-col>
                <v-col class="text-end font-weight-bold" cols="6" >
                  {{formatCurrency(order.total_pay)}}
                </v-col>
              </v-row>
            </v-card-text>
         </v-card>  
      </v-sheet>
    </v-main>
    <!-- chat pop up -->
    <v-dialog
        v-model="dialogChat"
        transition="dialog-bottom-transition"
        fullscreen
        >
        <v-container class="bg-white position-sticky top-0" style="max-height: 60px; z-index: 1000;">
            <v-row no-gutters>
                <v-col cols="2">
                        <v-icon @click="dialogChat = false" >mdi-arrow-left</v-icon>
                </v-col>
                    <v-col cols="10">
                        <v-row>
                            <v-col cols="2" class="pt-1 p-0">
                                <v-avatar color="#00A9FF" size="40" >
                                    <span class="text-h6">ck</span>
                                </v-avatar>
                            </v-col>
                            <v-col cols="10" class="pt-3 p-0">
                                <span class="font-weight-bold text-capitalize">{{driver.user.name}}</span>
                            </v-col>
                        </v-row>
                    </v-col>
                    </v-row>
        </v-container>
        <ChatPage :data="dataChat" />
      </v-dialog>
  </v-layout>
</template>

<script>
import api from '@/api/axios'
import formatCurrency from '@/mixins/formatCurrency'
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import ChatPage from '@/components/chat.vue'
  export default{
  mixins: [formatCurrency],
  data () {
    return {
      order: null,
      pelanggan: null,
      driver: null,
      kedai: [],
      tujuan: null,
      isLoading: true,
      menu_order: null,
      header_proses: null,
      caption_proses: null,
      map: null,
      marker: null,
      marker_driver: null,
      dataChat: null,
      dialogChat: false
    }
  },
  components: {
    ChatPage
  },
  methods: {
    async orderData(){
        this.isLoading = true;
        try {
            const response = await api.get('order/' + this.$route.params.id);
            this.order = response.data.order;
            this.pelanggan = response.data.pelanggan;
            if(response.data.driver !== null){
              this.driver = response.data.driver
              this.listenPositionDriver(this.driver.id);
            }
            const data_lokasi = response.data.order_destination;
            data_lokasi.forEach(lokasi => {
                if(lokasi.tipe_destination == 0){
                  this.tujuan = lokasi;
                }else{
                  this.kedai.push(lokasi);
                }
            })
            this.menu_order = response.data.order_detail;
            console.log(response.data);
            this.isLoading = false;
            this.prosesOrder(this.order.status_order);
            this.listenStatusOrder(this.order.id);
        } catch (eror){
            console.log(eror);
            this.isLoading = false;
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
            this.$nextTick(() => {
                this.initializeMap();
            });
            this.header_proses = "Driver mengantar pesananmu";
            this.caption_proses = "tunggu ya, driver mengantar pesananmu sekarang";
         } else if ($status == 7){
            this.header_proses = "Pesanan sampai";
            this.caption_proses = "pesanan sudah sampai, selamat menikmati makanannya";
         } else if ($status == 8){
            this.header_proses = "Pesanan dibatalkan";
            this.caption_proses = "yah pesanan dibatalkan, maaf";
         }
    },
    openChat(){
        this.dialogChat = true;
        this.dataChat = {
                invoice_number: this.$route.params.id,
                order_status: this.order.status_order,
                reciver_id: this.driver.user_id,
                sender_id: this.pelanggan.user_id,
        }
    },
    initializeMap() {
            console.log(this.driver);
            const latitude = this.tujuan.alamat_pelanggan.latitude;
            const longitude = this.tujuan.alamat_pelanggan.longitude;
            this.map = L.map('map', { zoomControl: false }).setView([latitude, longitude], 15);
            L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 19,
                attribution: '',
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            }).addTo(this.map);
            this.marker = L.marker([latitude, longitude]).addTo(this.map);
            if (this.driver) {
              this.marker_driver = L.marker([this.driver.latitude, this.driver.longitude]).addTo(this.map);
              const bounds = L.latLngBounds([
                  [this.marker.getLatLng().lat, this.marker.getLatLng().lng],
                  [this.driver.latitude, this.driver.longitude]
              ]);
              this.routingMap();
              this.map.fitBounds(bounds, { animate: true });
            }
    },
    listenStatusOrder(id){
        Echo.private("orders." + id).listen("StatusOrder", (data) => {
          this.order = data.order;
          this.prosesOrder(data.order.status_order);
          if (data.order.status_order == 1 && data.order.driver_id != null) {
            this.driver = data.order.driver;
          }
      });
    },
    updateMarkerDriver() {
      if (this.marker_driver) {
        this.marker_driver.setLatLng([this.driver.latitude, this.driver.longitude]);
        const bounds = L.latLngBounds([
            [this.marker.getLatLng().lat, this.marker.getLatLng().lng],
            [this.driver.latitude, this.driver.longitude]
        ]);
          this.routingMap();
          this.map.fitBounds(bounds, { animate: true });
        } else {
            console.warn('Marker driver tidak ditemukan.');
        }
    },
    listenPositionDriver(id){
        Echo.private("driver." + id).listen("PosisiDriver", (data) => {
          this.driver = data.driver;
          this.updateMarkerDriver();
        });
    },
    routingMap() {
    if (!this.marker || !this.driver) {
        console.error("Marker or driver information is missing.");
        return;
    }
    // Inisialisasi kontrol routing
          const routingControl = L.Routing.control({
              waypoints: [
                  L.latLng(this.marker.getLatLng().lat, this.marker.getLatLng().lng),
                  L.latLng(this.driver.latitude, this.driver.longitude)
              ],
              router: new L.Routing.OSRMv1({
                  serviceUrl: 'https://router.project-osrm.org/route/v1'
              }),
              createMarker: function() { return null; }, // Menyembunyikan marker
              lineOptions: {
                  styles: [{ color: 'blue', opacity: 1, weight: 5 }]
              },
              addWaypoints: false,
              routeWhileDragging: false,
              show: false,
              collapsible: false,
              formatter: new L.Routing.Formatter({
                  units: 'metric',
                  roundingSensitivity: 1
              })
          }).addTo(this.map);

          // Menghapus elemen container Leaflet Routing Machine setelah di-render
          const routingContainer = document.querySelector('.leaflet-routing-container');
          if (routingContainer) {
              routingContainer.style.display = 'none'; // Menyembunyikan elemen
          }
      },
  },
   mounted() {
    this.orderData();
  },
  }
</script>

<style scoped>
    #map {
        height: 400px;
    }
</style>