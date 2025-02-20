<!-- eslint-disable vue/multi-word-component-names -->
 <template>
    <v-layout>
        <v-main v-if="!isLoading">
            <v-container class="bg-white position-sticky top-0" style="max-height: 60px; z-index: 1000;">
                <v-row no-gutters>
                    <v-col cols="4">
                            <a href="/driver/orderan">
                                <v-icon>mdi-arrow-left</v-icon>
                            </a>  
                    </v-col>
                    <v-col cols="8">
                        <p class="font-weight-bold">Rincian Pesanan</p>
                    </v-col>
                </v-row>
            </v-container>
            <!-- card status and maps -->
            <v-card class="mx-4 my-3 rounded-3 p-3 elevation-3">
                <v-row class="text-center">
                    <v-col cols="8" class="text-capitalize font-weight-bold pt-4"> 
                        {{ header_proses }}
                    </v-col>
                    <v-col cols="4"> 
                        <v-btn
                        prepend-icon="mdi-google-maps"
                        @click="openDialogMaps()"
                        :disabled="isDisabled"
                        >
                        <template v-slot:prepend>
                            <v-icon color="blue"></v-icon>
                        </template>
                            Maps
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
            <!-- card profil pelanggan -->
            <v-card class="mx-4 my-3 rounded-3 p-3 elevation-3">
                <v-row no-gutters>
                    <v-col cols="8" class="text-capitalize font-weight-bold ps-2">
                        {{pelanggan.user.name}}
                    </v-col>
                    <v-col cols="4" class="text-end">
                                <a target="_blank" :href="'https://wa.me/'">
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
                    <v-col cols="8" class="px-2 py-3">
                        <v-icon>mdi-wallet-outline</v-icon>
                        {{pembayaran}}
                    </v-col>
                    <v-col cols="4" class="text-end px-2">
                        <v-avatar
                            color="grey"
                            rounded="1"
                            size="60"
                            >
                        <v-img :src="pelanggan.img_url" cover></v-img>
                        </v-avatar>
                    </v-col>
                </v-row>
            </v-card>
            <!-- card alamat kedai dan pelanggan -->
            <v-card class="mx-4 my-3 rounded-3 p-3 elevation-3">
                <v-timeline truncate-line="both" side="end"  density="compact">
                    <v-timeline-item
                    v-for="kedai in kedais" :key="kedai.kedai.id"
                    dot-color="blue" 
                    icon="mdi-silverware-fork-knife" 
                    fill-dot
                    >
                        <v-container class="px-0 py-0">
                            <p class="mb-0 text-capitalize font-weight-bold">{{ kedai.kedai.user.name}}</p>
                            <v-row>
                                <v-col cols="10">
                                    <p ref="textToCopy" class="mb-1 text-caption">{{kedai.kedai.alamat}}</p>
                                </v-col>
                                <!-- <v-col cols="2">
                                    <v-btn @click="copyText">Copy Text</v-btn>
                                </v-col> -->
                            </v-row>   
                        </v-container>
                    </v-timeline-item>
                    <v-timeline-item
                    class="px-0" 
                    dot-color="blue" 
                    icon="mdi-map-marker" 
                    fill-dot
                    >
                    <v-container class="px-0 py-0">
                        <p class="mb-0 text-capitalize font-weight-bold">{{ tujuan.alamat_pelanggan.tipe_alamat}}</p>
                        <p class="mb-1 text-caption" style="max-width: 200px;">{{ tujuan.alamat_pelanggan.alamat }}, <span class="text-no-wrap bg-secondary"> detail alamat : {{ tujuan.alamat_pelanggan.detail_alamat }}</span> </p>
                    </v-container>
                    </v-timeline-item>
                </v-timeline>
            </v-card>
            <!-- card rincian order kedai 1 -->
             <v-card class="mx-4 my-3 bg-grey-lighten-3 rounded-3 elevation-3">
                <v-expansion-panels v-model="kedaiOne" class="elevation-3" rounded="3">
                    <v-expansion-panel >
                        <v-expansion-panel-title collapse-icon="mdi-minus" expand-icon="mdi-plus" class="text-capitalize font-weight-bold">
                         pesanan di {{ kedais[0].kedai.user.name }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="pt-0">
                            <v-row v-for="menu in menu_order" :key="menu.id" no-gutters>
                                <v-row v-if="menu.kedai_id == kedais[0].kedai.id" no-gutters>
                                <v-col cols="10" class="text-subtitle-1">
                                    {{ menu.menu}}
                                </v-col>
                                <v-col cols="2" class=" text-subtitle-1 text-end">
                                    {{ menu.qty}}
                                </v-col>
                                <v-col cols="12" class=" text-subtitle-1 text-medium-emphasis">
                                    {{ formatCurrency(menu.price) }}
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
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
             </v-card>
              <!-- card rincian order kedai 2 -->
              <v-card v-if="kedais.length > 1" class="mx-4 my-3 rounded-3  bg-grey-lighten-3 elevation-3">
                <v-expansion-panels rounded="3" v-model="kedaiTwo">
                    <v-expansion-panel>
                        <v-expansion-panel-title collapse-icon="mdi-minus" expand-icon="mdi-plus" class="text-capitalize font-weight-bold">
                         pesanan di {{ kedais[1].kedai.user.name }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="pt-0">
                            <v-row v-for="menu in menu_order" :key="menu.id" no-gutters>
                                <v-row v-if="menu.kedai_id == kedais[1].kedai.id" no-gutters>
                                <v-col cols="10" class="text-subtitle-1">
                                    {{ menu.menu}}
                                </v-col>
                                <v-col cols="2" class=" text-subtitle-1 text-end">
                                    {{ menu.qty}}
                                </v-col>
                                <v-col cols="12" class=" text-subtitle-1 text-medium-emphasis">
                                    {{ formatCurrency(menu.price) }}
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
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
             </v-card>
             <!-- total pesanan -->
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
         <v-container class="text-center px-6 position-sticky bottom-0 bg-white">
            <v-btn class="rounded-4 bg-blue text-capitalize elevation-3" block @click= "changeStatus(nextStatus)">
                {{ buttonStatus }}
            </v-btn>
         </v-container>  
        </v-main>
        <v-dialog
        v-model="dialogMaps"
        transition="dialog-bottom-transition"
        fullscreen
        >   
            <v-card>
             <!-- Floating Close Button -->
            <v-btn
            icon
            class="close-button"
            @click="dialogMaps = false"
            >
            <v-icon>mdi-close</v-icon>
            </v-btn>

            <!-- Map Container -->
            <div id="map" style="height:100vh; z-index:-1;">
            <!-- Peta akan diinisialisasi di sini -->
            </div>
            <v-card class=" mb-2 rounded-3 p-3 elevation-3" style="z-index: 1000; bottom: 80px; position: absolute; width:90%; right:20px">
                <v-row no-gutters>
                    <v-col cols="2">
                        <v-icon size="50" color="blue">
                            mdi-map-marker
                        </v-icon>
                    </v-col>
                    <v-col cols="10">
                        <p ref="alamat">{{displayAlamatInMap}}</p>
                    </v-col>
                    <!-- <v-col cols="4" class="text-center">
                        <v-btn class="mx-auto" icon= "mdi-content-copy" color="blue" @click="copyURL">
                        </v-btn>
                    </v-col> -->
                </v-row>
            </v-card>
            </v-card>
             <v-container v-if="order.status_order !== 7" class="text-center px-6 position-sticky bottom-0 bg-white">
                <v-btn class="rounded-4 bg-blue text-capitalize elevation-3" block @click="changeStatus(nextStatus)">
                    {{ buttonStatus }}
                </v-btn>
            </v-container>  
        </v-dialog>
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
                            <v-col cols="2" class="pt-2 p-0">
                                <v-avatar
                                size="30"
                                >
                                    <v-img :src="pelanggan.img_url" cover></v-img>
                                </v-avatar>
                            </v-col>
                            <v-col cols="10" class="pt-3 p-0">
                                <span class="font-weight-bold text-capitalize">{{pelanggan.user.name}}</span>
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
import Openrouteservice from 'openrouteservice-js';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import ChatPage from '@/components/chat.vue';
import Swal from 'sweetalert2';
 export default{
  mixins: [formatCurrency],
  data () {
    return {
        kedaiOne: [0],
        kedaiTwo:[0],
        buttonStatus: null,
        dialogMaps: false,
        dialogChat: false,
        beforeStatus: null,
        nextStatus: null,
        kedais: [],
        map: null,
        marker: null,
        marker_kedai: null,
        marker_driver: null,
        isLoading: true,
        order: null,
        pelanggan: null,
        driver: null,
        tujuan: null,
        menu_order: null,
        header_proses: null,
        pembayaran:null,
        displayAlamatInMap:null,
        orsClient: null,
        geojsonLayer: null,
        distance: 0,
        realtimePosisiDriver: {
            latitude: null,
            longitude: null
        },
        dataChat: null
    }
  },
  components: {
    ChatPage
  },
  computed: {
    isDisabled() {
            if(!this.isLoading){
                if(this.order.status_order == 5 || this.order.status_order == 7){
                    return true;
                } else {
                    return false;
                }
            }
            return false;
      },
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
              console.log(this.driver)
            }
            const data_lokasi = response.data.order_destination;
            data_lokasi.forEach(lokasi => {
                if(lokasi.tipe_destination == 0){
                  this.tujuan = lokasi;
                }else{
                  this.kedais.push(lokasi);
                }
            })
            this.menu_order = response.data.order_detail;
            console.log(response.data);
            this.isLoading = false;
            this.prosesOrder(this.order.status_order);
            this.statusButton(this.order.status_order);
            if(this.order.metode_pembayaran == 0){
                this.pembayaran = "pembayaran tunai"
            } else {
                this.pembayaran = "pembayaran non tunai"
            }
            console.log(this.kedais)
        } catch (eror){
            console.log(eror);
            this.isLoading = false;
        }
    },
    statusButton(status) {
    const kedaiCount = this.kedais.length;
    
        if (status === 1) {
            this.buttonStatus = kedaiCount === 1 ? 'Menuju Resto' : 'Menuju Resto pertama';
            this.nextStatus = kedaiCount === 1 ? 2 : 3;
        } else if ((kedaiCount === 1 && status === 2) || (kedaiCount > 1 && status === 3)) {
            this.buttonStatus = 'Sampai di Resto';
            this.nextStatus = 5;
        } else if (kedaiCount > 1 && status === 5 && this.beforeStatus == null) {
            this.buttonStatus = 'Menuju Resto kedua';
            this.nextStatus = 4;
        } else if (kedaiCount > 1 && status === 4) {
            this.buttonStatus = 'Sampai di Resto';
            this.beforeStatus = 4;
            this.nextStatus = 5;
        } else if (status === 5) {
            if (kedaiCount === 1 || (kedaiCount > 1 && this.beforeStatus === 4)) {
            this.buttonStatus = 'Antar Makan';
            this.nextStatus = 6;
            }
        } else if (status === 6) {
            this.buttonStatus = 'Selesai';
            this.nextStatus = 7;
        } else if (status === 7){
            this.buttonStatus = 'selesai';
            this.nextStatus = null;
        }   
    },
    
    async updateStatusOrder(status){
        if (status == 7) {
        // Menampilkan konfirmasi dengan SweetAlert
            const result = await Swal.fire({
                title: 'selsaikan pesanan ini?',
                text: 'Apakah Anda yakin menyelesaikan pesanan ini?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, selesaikan',
                cancelButtonText: 'Belum',
            });

            // Cek jika pengguna memilih untuk melanjutkan atau tidak
            if (!result.isConfirmed) {
                return; // Jika batal, hentikan eksekusi
            }
        }

        const formData = {
            status_order: status,
            invoice_number: this.$route.params.id, 
        };

        try {
            const response = await api.post('order/update/status', formData);
            console.log(response);
            this.order.status_order = status;
        } catch (error) {
            console.log(error);
        }
    },
    openChat(){
        this.dialogChat = true;
        this.dataChat = {
                invoice_number: this.$route.params.id,
                order_status: this.order.status_order,
                reciver_id: this.pelanggan.user_id,
                sender_id: this.driver.user_id,
        }
    },
    changeStatus(status) {
        this.statusButton(status);
        this.updateStatusOrder(status);
        this.prosesOrder(status);
        this.dialogMaps = false;
    },
    
    copyURL() {
      const storage = document.createElement('textarea');
      storage.value = this.$refs.alamat.innerHTML;
      this.$refs.reference.appendChild(storage);
      storage.select();
      storage.setSelectionRange(0, 99999);
      document.execCommand('copy');
      this.$refs.reference.removeChild(storage);
    },
    prosesOrder(status){
        if (status == 1){
            this.header_proses =  "Berhasil mendapatkan orderan";
         } else if (status == 2) {
            this.header_proses =  "menuju resto";
         } else if (status == 3) {
            this.header_proses = "menuju resto pertama";
         } else if (status == 4) {
            this.header_proses = "menuju resto kedua";
         } else if (status == 5) {
          this.header_proses = "Sampai diresto";
         } else if (status == 6) {
            this.header_proses = "mengantar pesanan";
         } else if (status == 7){
            this.header_proses = "Pesanan sampai";
         } else if (status == 8){
            this.header_proses = "Pesanan dibatalkan";
         }
    },
    openDialogMaps(){
        this.dialogMaps = true;
        this.$nextTick(() => {
            this.initializeMap();
        });
    },
    destroyMap() {
        if (this.map) {
            this.map.remove();  // Menghapus peta dan semua layernya
            this.map = null;
            this.marker_kedai = null;
            this.geojsonLayer = null;
            this.marker_driver = null;
            console.log('jalana gak')
        }
    },
    initializeMap() {
        const driverIcon = L.icon({
                iconUrl: '/marker_delivery.png', // Ganti dengan path gambar custom
                iconSize: [40, 40], // Ukuran ikon (width, height)
                iconAnchor: [20, 20], // Titik anchor (tengah bawah ikon)
                popupAnchor: [0, -40] // Posisi popup
             });
        if (this.map) {
            this.destroyMap();  // Hapus peta sebelumnya jika ada
        }

        const { latitude, longitude, alamat } = this.tujuan.alamat_pelanggan;

        // Inisialisasi peta dengan Google Tile
        this.map = L.map('map', { zoomControl: false }).setView([latitude, longitude], 15);
        L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 19,
            attribution: '',
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(this.map);

        // Memperbarui marker sesuai dengan kedai dan status order
        const updateMarker = (kedaiIndex) => {
            if (this.marker_kedai) this.map.removeLayer(this.marker_kedai);
            const { latitude, longitude, alamat } = this.kedais[kedaiIndex].kedai;
            this.marker_kedai = L.marker([latitude, longitude]).addTo(this.map);
            this.displayAlamatInMap = alamat;
        };

        const status = this.order.status_order;
        if (this.kedais.length > 1 && (status === 3 || status === 4)) {
            updateMarker(status === 3 ? 0 : 1);
        } else if (this.kedais.length === 1 && status === 2) {
            updateMarker(0);
        }

        if (status === 6) {
            if (this.marker_kedai) this.map.removeLayer(this.marker_kedai);
            this.marker = L.marker([latitude, longitude]).addTo(this.map);
            this.displayAlamatInMap = alamat; 
        }
        // Melacak posisi driver jika tersedia
        if (navigator.geolocation) {
            
            navigator.geolocation.watchPosition(
                this.updatePosition,
                this.handleError,
                { enableHighAccuracy: true, maximumAge: 0 }
            );
            if(this.realtimePosisiDriver.latitude !== null && this.realtimePosisiDriver.longitude !== null){
                if(this.realtimePosisiDriver.latitude == this.driver.latitude && this.realtimePosisiDriver.longitude == this.driver.longitude){
                    if (this.marker_driver) {
                        this.map.removeLayer(this.marker_driver);
                    }
                    this.marker_driver = L.marker([this.driver.latitude, this.driver.longitude] , {
                            icon: driverIcon
                    }).addTo(this.map);
                    this.initializeRouting();
                }
            }
        } else if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
        }
    },

    initializeRouting() {
        if (!this.orsClient) {
            const apiKey = import.meta.env.VITE_OPENROUTE_KEY;
            this.orsClient = new Openrouteservice.Directions({ api_key: apiKey });
        }

        const startCoords = [this.driver.longitude, this.driver.latitude];
        let endCoords='';
        if(this.order.status_order == 6){
             endCoords = [this.marker.getLatLng().lng, this.marker.getLatLng().lat];
             console.log(endCoords);
        } else {
             endCoords = [this.marker_kedai.getLatLng().lng, this.marker_kedai.getLatLng().lat];
        }
        
        if (this.geojsonLayer) {
            this.map.removeLayer(this.geojsonLayer);
        }

        this.orsClient.calculate({
            coordinates: [startCoords, endCoords],
            profile: 'driving-car',
            format: 'geojson'
        })
        .then(response => {
            this.geojsonLayer = L.geoJSON(response, {
                style: () => ({ color: 'blue', weight: 7 })
            }).addTo(this.map);
            this.map.fitBounds(this.geojsonLayer.getBounds(),{
                  animate: true,
              });

            // Mendapatkan jarak dari API
            const distanceInMeters = response.features[0].properties.segments[0].distance;
            this.distance = distanceInMeters;
            console.log('distance', this.distance);
        })
        .catch(err => {
            console.error('Error routing:', err);
        });
    },
    updatePosition(position) {
        const driverIcon = L.icon({
                iconUrl: '/marker_delivery.png', // Ganti dengan path gambar custom
                iconSize: [40, 40], // Ukuran ikon (width, height)
                iconAnchor: [20, 20], // Titik anchor (tengah bawah ikon)
                popupAnchor: [0, -40] // Posisi popup
             });
        const { latitude, longitude } = position.coords;
        this.realtimePosisiDriver.latitude = latitude;
        this.realtimePosisiDriver.longitude = longitude;
        if (this.driver) {
            if(this.driver.latitude !== latitude && this.driver.longitude !== longitude){
                this.driver.latitude = latitude;
                this.driver.longitude = longitude;
                const formData = {
                    latitude,
                    longitude,
                    invoice_number: this.order.invoice_number
                };
                this.updatePositionOrder(formData);
            }
            if (this.marker_driver) {
                this.map.removeLayer(this.marker_driver);
            }
            this.marker_driver = L.marker([latitude, longitude] , {
                icon: driverIcon
            }).addTo(this.map);
            this.initializeRouting();
        }

        console.log(latitude, longitude);
    },
    async updatePositionOrder(data){
        const response = await api.post('order/posisi/driver', data);
        console.log(response);
    },
    handleError(error) {
        console.error(`Geolocation error: ${error.message}`);
    },
  },
  mounted() {
    this.orderData();
  }

 }
 </script>

 <style scoped>
    main{
        background-color: #EEEEEE;
    }
    .close-button {
        position: absolute;
        top: 16px;
        left: 16px;
        z-index: 1000; 
        border-radius: 50%; /* Membuat button menjadi bulat */
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Memberikan sedikit bayangan untuk efek floating */
    }
    .leaflet-control-container .leaflet-routing-container-hide {
        display: none;
    }

</style>