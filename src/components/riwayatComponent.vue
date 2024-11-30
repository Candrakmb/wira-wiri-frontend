<script>
import api from '@/api/axios.js'
import formatCurrency from '@/mixins/formatCurrency'

export default {
    mixins: [formatCurrency],
    data() {
        return {
            tab: null,
            dataAktifitas: null,
            isLoading: true,
            rincianAktifitas: false,
            selectedDataAktifitas: {
                order: null,
                destination_kedai: [],
                destination_pelanggan: null,
                menu: []
            },
            role: null,
        }
    },
    methods: {
        async getDataAktifitas(){
            try{
            const response = await api.get('riwayat')
            if(response.data.success){
                console.log(response.data.data);
                this.dataAktifitas = response.data.data;
                this.getUser();
            }
            } catch (error){
                console.log(error);
                this.isLoading = false;
            }
        },
        async getUser(){
            try{
            const response = await api.get('user')
            if(response.data.success){
                console.log(response.data);
                this.role = response.data.role[0];
                this.isLoading = false;
            }
            } catch (error){
                console.log(error);
                this.isLoading = false;
            }
        },   
        getStatusOrder(status){
            if(status == 0){
                return  "Pesananmu Sedang Diproses";
            } else if (status == 1){
                return   "Berhasil mendapatkan driver";
            } else if (status == 2) {
                return   "Driver menuju resto nih";
            } else if (status == 3) {
                return  "Driver menuju resto nih";
            } else if (status == 4) {
                return  "Driver menuju resto nih";
            } else if (status == 5) {
                return  "Driver Sampai diresto";
            } else if (status == 6) {
                return  "Driver mengantar pesananmu";
            } else if (status == 7){
                return  "Pesanan sampai";
            } else if (status == 8){
                return  "Pesanan dibatalkan";
            }
        },
        titleRiwayat(order_id){
            let listTitle = [];
            for(let title of this.dataAktifitas.destination){
                if(title.tipe_destination == 1 && title.order_id == order_id){
                    listTitle.push(title.kedai.user.name);
                }
            }
            return listTitle.length > 1 ? listTitle.join(' & ') : listTitle[0] || '';
        },
        listMenu(invoice){
            let listMenu = [];
            for(let menu of this.dataAktifitas.menu){
                if(menu.invoice_number == invoice){
                    listMenu.push(menu.menu);
                }
            }
            return listMenu.length > 1 ? listMenu.join(',') : listMenu[0] || '';
        },
        openDialog(order){
            this.selectedDataAktifitas = {
                order: null,
                destination_kedai: [],
                destination_pelanggan: null,
                menu: []
            }

            this.selectedDataAktifitas.order = order;
            // Ambil menu berdasarkan invoice_number
            this.selectedDataAktifitas.menu = this.dataAktifitas.menu.filter(menu => 
                menu.invoice_number === order.invoice_number
            );

            // Ambil destination berdasarkan order_id
            this.selectedDataAktifitas.destination_kedai = this.dataAktifitas.destination.filter(destination => 
                destination.order_id === order.id && destination.tipe_destination === 1
            );
            this.selectedDataAktifitas.destination_pelanggan = this.dataAktifitas.destination.filter(destination => 
                destination.order_id === order.id && destination.tipe_destination === 0
            );
            this.rincianAktifitas = true;
            console.log(this.selectedDataAktifitas)
        },

    },
    mounted() {
        this.getDataAktifitas();
    },
}
</script>
<template>
    <v-layout v-if="!isLoading">
        <v-app-bar>
            <template v-if="role == 'driver'" v-slot:prepend>
                <v-btn to="/driver/profil" icon="mdi-arrow-left">
                </v-btn>
                
            </template>
            <v-app-bar-title>Aktifitas</v-app-bar-title>
        </v-app-bar>
        <v-main>
            
                <v-tabs
                    v-model="tab"
                    grow
                >
                <v-tab value="riwayat">Riwayat</v-tab>
                <v-tab value="proses">Proses</v-tab>
                <v-tab value="batal">Batal</v-tab>
                </v-tabs>
                
                <v-tabs-window  v-model="tab">
                        <v-tabs-window-item class="px-2 py-3"  value="riwayat">
                            <v-card v-for="order in dataAktifitas.order" :key="order.id"  class="p-2 rounded-3 mb-2 mt-2">
                                <v-row @click="openDialog(order)">
                                    <v-col class="text-start text-caption" cols="12">
                                        {{ order.order_time }}
                                    </v-col>
                                    <v-col class="text-end pt-0" cols="4">
                                        <v-avatar rounded="4" size="100" class="elevation-3">
                                            <v-img lazy-src="https://picsum.photos/id/11/100/60" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
                                                <template v-slot:placeholder>
                                                    <div class="d-flex align-center justify-center fill-height">
                                                        <v-progress-circular
                                                        color="grey-lighten-4"
                                                        indeterminate
                                                        ></v-progress-circular>
                                                    </div>
                                                </template>
                                            </v-img>
                                        </v-avatar>
                                    </v-col>
                                    <v-col class="text-start pt-0" cols="4">
                                        <p class="text-capitalize font-weight-medium text-truncate">{{ titleRiwayat(order.id) }}</p>
                                        <p class="text-caption font-weight-bold text-truncate"><v-icon color="green">mdi-check-circle</v-icon> {{ getStatusOrder(order.status_order) }}</p>
                                        <p class="text-caption text-truncate">{{ listMenu(order.invoice_number) }}</p>
                                    </v-col>
                                    <v-col class="text-center pt-0 px-0 text-truncate" cols="4">
                                        {{ formatCurrency(order.total_pay) }}
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-tabs-window-item>

                        <v-tabs-window-item class="px-2 py-3" value="proses">
                            <div v-for="order in dataAktifitas.order" :key="order.id">
                                <v-card v-if="order.status_order < 7" class="p-2 rounded-3 mb-2 mt-2" >
                                    <v-row>
                                    <v-col class="text-start text-caption" cols="12">
                                        {{ order.order_time }}
                                    </v-col>
                                    <v-col class="text-end pt-0" cols="4">
                                        <v-avatar rounded="4" size="100" class="elevation-3">
                                            <v-img lazy-src="https://picsum.photos/id/11/100/60" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
                                                <template v-slot:placeholder>
                                                    <div class="d-flex align-center justify-center fill-height">
                                                        <v-progress-circular
                                                        color="grey-lighten-4"
                                                        indeterminate
                                                        ></v-progress-circular>
                                                    </div>
                                                </template>
                                            </v-img>
                                        </v-avatar>
                                    </v-col>
                                    <v-col class="text-start pt-0" cols="4">
                                        <p class="text-capitalize font-weight-medium text-truncate">{{ titleRiwayat(order.id) }}</p>
                                        <p class="text-caption font-weight-bold text-truncate"><v-icon color="green">mdi-check-circle</v-icon> {{ getStatusOrder(order.status_order) }}</p>
                                        <p class="text-caption text-truncate">{{ listMenu(order.invoice_number) }}</p>
                                    </v-col>
                                    <v-col class="text-center pt-0 px-0 text-truncate" cols="4">
                                        {{ formatCurrency(order.total_pay) }}
                                    </v-col>
                                </v-row>
                            </v-card>
                            </div>
                        </v-tabs-window-item>

                        <v-tabs-window-item class="px-2 py-3" value="batal">
                            <div v-for="order in dataAktifitas.order" :key="order.id">
                                <v-card v-if="order.status_order == 8" class="p-2 rounded-3 mb-2 mt-2">
                                    <v-row>
                                    <v-col class="text-start text-caption" cols="12">
                                        {{ order.order_time }}
                                    </v-col>
                                    <v-col class="text-end pt-0" cols="4">
                                        <v-avatar rounded="4" size="100" class="elevation-3">
                                            <v-img lazy-src="https://picsum.photos/id/11/100/60" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
                                                <template v-slot:placeholder>
                                                    <div class="d-flex align-center justify-center fill-height">
                                                        <v-progress-circular
                                                        color="grey-lighten-4"
                                                        indeterminate
                                                        ></v-progress-circular>
                                                    </div>
                                                </template>
                                            </v-img>
                                        </v-avatar>
                                    </v-col>
                                    <v-col class="text-start pt-0" cols="4">
                                        <p class="text-capitalize font-weight-medium text-truncate">{{ titleRiwayat(order.id) }}</p>
                                        <p class="text-caption font-weight-bold text-truncate"><v-icon color="green">mdi-check-circle</v-icon> {{ getStatusOrder(order.status_order) }}</p>
                                        <p class="text-caption text-truncate">{{ listMenu(order.invoice_number) }}</p>
                                    </v-col>
                                    <v-col class="text-center pt-0 px-0 text-truncate" cols="4">
                                        {{ formatCurrency(order.total_pay) }}
                                    </v-col>
                                </v-row>
                            </v-card>
                            </div>
                        </v-tabs-window-item>
                </v-tabs-window>
        </v-main>
        <v-dialog
            v-model="rincianAktifitas"
            fullscreen  
            transition="dialog-transition"
        >
        <v-card>
            <v-toolbar>
            <v-btn
                icon="mdi-close"
                @click="rincianAktifitas = false"
            ></v-btn>

            <v-toolbar-title>Ringkasan Transaksi</v-toolbar-title>

            <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-item class="p-1">
                <div class="d-flex justify-space-between px-5 font-weight-">
                    <p class="mb-0 font-weight-bold text-h6 text-blue" >wi-food</p>
                    <p class="d-flex align-center mb-0 text-caption">{{ selectedDataAktifitas.order.order_time  }}</p>
                </div>
                <div class="d-flex justify-space-between px-5 font-weight-">
                    <p class="mb-0 font-weight-bold text-body-2">{{ getStatusOrder(selectedDataAktifitas.order.status_order) }}</p>
                    <p class="mb-0 text-caption">Transaksi {{ selectedDataAktifitas.order.invoice_number  }}</p>
                </div>
            </v-card-item>
            <v-divider class="my-1"></v-divider>
            <v-card-item class="p-1">
            <v-card
                    class="mx-auto"
                    :subtitle="role == 'user' ? selectedDataAktifitas.order.driver.no_plat : 'Pelanggan'"
                    :title="role == 'user' ? selectedDataAktifitas.order.driver.user.name : selectedDataAktifitas.order.pelanggan.user.name"
                    elevation="0"
                >
                    <template v-slot:prepend>
                        <v-avatar size="50" class="elevation-3 me-2">
                            <v-img
                                lazy-src="https://picsum.photos/id/11/100/60"
                                :src="role == 'user' ? selectedDataAktifitas.order.driver.img_url : selectedDataAktifitas.order.pelanggan.img_url"
                            >
                                <template v-slot:placeholder>
                                    <div class="d-flex align-center justify-center fill-height">
                                        <v-progress-circular
                                            color="grey-lighten-4"
                                            indeterminate
                                        ></v-progress-circular>
                                    </div>
                                </template>
                            </v-img>
                        </v-avatar>
                    </template>
                </v-card>
            </v-card-item>
            <v-divider class="my-1"></v-divider>
            <v-card-item class="p-1">
                <p class="mb-0 ps-4 font-weight-">Detail Perjalanan</p>
                <v-card class=" px-4 py-3" elevation="0">
                    
                    <v-timeline truncate-line="both" side="end"  density="compact">
                        <v-timeline-item
                        v-for="kedai in selectedDataAktifitas.destination_kedai" :key="kedai.id"
                        dot-color="blue" 
                        icon="mdi-silverware-fork-knife" 
                        fill-dot
                        >
                        <v-container class="px-0 py-0">
                            <p class="mb-0 text-capitalize font-weight-bold">{{kedai.kedai.user.name}}</p>
                            <p class="mb-1 text-caption d-inline-block text-truncate">{{kedai.kedai.alamat}}</p>
                        </v-container>
                        </v-timeline-item>
                        <v-timeline-item
                        class="px-0" 
                        dot-color="blue" 
                        icon="mdi-map-marker" 
                        fill-dot
                        >
                        <v-container class="px-0 py-0">
                            <p class="mb-0 text-capitalize font-weight-bold"> Tujuan </p>
                            <p class="mb-1 text-caption " style="max-width: 300px;">{{ selectedDataAktifitas.destination_pelanggan[0].alamat_pelanggan.alamat }}</p>
                        </v-container>
                        </v-timeline-item>
                    </v-timeline>
                    </v-card>
            </v-card-item>
            <v-divider class="my-1"></v-divider>
            <v-card-item class="p-1 font-weight-">
                <p class="mb-3 ps-4 font-weight-">Detail Pesanan</p>
                <div v-for="menu in selectedDataAktifitas.menu" :key="menu.id" class="d-flex justify-space-between px-5 font-weight-medium">
                    <p class="mb-2">{{ menu.qty }} {{ menu.menu }}</p>
                    <p class="mb-2">{{  formatCurrency(menu.price * menu.qty) }}</p>
                </div>
            </v-card-item>
            <v-divider class="my-1"></v-divider>
            <v-card-item class="p-1 font-weight-">
                <p class="mb-3 ps-4 font-weight-">Detail Pembayaran</p>
                <div class="d-flex justify-space-between px-5 font-weight-medium">
                    <p class="mb-2">biaya makanan</p>
                    <p class="mb-2">{{ formatCurrency(selectedDataAktifitas.order.subtotal) }}</p>
                </div>
                <div class="d-flex justify-space-between px-5 font-weight-medium">
                    <p class="mb-2">Biaya Lainya</p>
                    <p class="mb-2">{{ formatCurrency(selectedDataAktifitas.order.ongkir) }}</p>
                </div>
                <div class="d-flex justify-space-between px-5 font-weight-medium">
                    <p class="mb-2">Total</p>
                    <p class="mb-2">{{ formatCurrency(selectedDataAktifitas.order.total_pay) }}</p>
                </div>
            </v-card-item>
            <v-divider class="my-1"></v-divider>
        </v-card>
        
        </v-dialog>
    </v-layout>
</template>