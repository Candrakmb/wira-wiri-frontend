<!-- eslint-disable vue/multi-word-component-names -->
<template>
   <v-layout row wrap>
    <v-app-bar :elevation="0">
        <template v-slot:prepend>
            <v-btn icon @click="$router.go(-1)">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
        </template>
        <v-app-bar-title>
                <div v-if="resto && resto.user && idResto.length < 2" class="text-capitalize">
                    {{resto.user.name}}
                </div>
                <div v-if="resto_2 && resto_2.user && idResto.length > 1" class="text-capitalize">
                    2 resto
                </div>

        </v-app-bar-title>
    </v-app-bar>
    <v-main v-if="!isLoading">
        <v-card  class="mx-auto">
            <v-card-item v-if="alamats.length == 0">
                <v-row no-gutters> 
                    <v-col cols="6">
                        <div class="text-subtitle-1 font-weight-bold">
                            Tambahkan Alamat Dulu Ya!
                        </div>
                    </v-col>
                    <v-col class="text-end" cols="6">
                        <v-btn size="small" rounded="5"  variant="outlined" color="deep-purple-darken-3" class="text-capitalize">Tambah Alamat</v-btn>
                    </v-col>
                </v-row>
            </v-card-item>
            <v-card-item v-if="alamats.length != 0 && detailAlamat != null">
                <v-row no-gutters> 
                    <v-col cols="12">
                        <div class="text-caption">
                        Alamat Pengantaran
                        </div>
                    </v-col>
                    <v-col cols="7">
                        <div class="text-subtitle-1">
                        {{detailAlamat.tipe_alamat}}
                        </div>
                        <div class="text-caption">{{detailAlamat.alamat}}</div>
                    </v-col>
                    <v-col class="text-end" cols="5">
                        <v-btn size="small" rounded="5"  variant="outlined" color="deep-purple-darken-3" class="text-capitalize" @click="dialogAlamat=true">Ganti Alamat</v-btn>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-btn :to="`/alamat/${detailAlamat.id}`" size="small" variant="outlined" rounded="5" prepend-icon="mdi-pencil" class="text-lowercase">
                        ubah detail alamat
                    </v-btn>
                </v-card-actions>
            </v-card-item>
        </v-card>
        <v-card class="mx-auto mt-2 mb-3">
            <!-- <template> -->
                <v-card-item v-for="([key, value], index) in Object.entries(cart)" :key="key" class="pb-0">
                    <v-row>
                        <v-col cols="6">
                            <p class="mb-1 font-weight-black text-capitalize text-subtitle-1">
                                {{value.nama}}</p>
                            <div  v-for="custom in value.custom_options" :key="custom">
                                <p  v-for="detail in getMenuDetails(custom)" :key="detail.id" class="m-0"> {{getKategoriDetail(detail.kategori_pilih_menu_id)}} : {{detail.nama_pilihan}}</p>
                            </div>
                            <v-chip v-if="value.catatan != ''">
                            Catatan : {{value.catatan}}
                            </v-chip>
                            <p v-if="value.custom_options.length == 0">{{ formatCurrency(totalCustome(value)) }}</p>
                        </v-col>
                        <v-col class="text-end pb-0" cols="6">
                            <v-avatar rounded="4" size="80" class="elevation-3">
                                <v-img :src="value.img_url"></v-img>
                            </v-avatar>
                        </v-col>
                        <v-col v-if="value.custom_options.length != 0"  cols="12">
                            {{ formatCurrency(totalCustome(value)) }}
                        </v-col>
                        <v-col  cols="6">
                            <div  v-if="value.custom_options.length != 0">
                                <v-btn class="text-capitalize" size="small" rounded="5" variant="outlined" color="deep-purple-darken-3" :to="{ name: 'EditCustom', query: {id: value.id, key: key , type: 'cart'} }">Edit
                                </v-btn>
                            </div>
                            <div v-if="value.custom_options.length == 0">
                                <v-btn @click="openDialogCatatan(value.catatan,key)" class="text-capitalize" size="small" prepend-icon="mdi-book" rounded="5"  variant="outlined" color="deep-purple-darken-3"> Catatan
                                </v-btn>
                            </div>
                        </v-col>
                        <v-col class="text-end mb-2" cols="6">
                            <v-btn @click="minusItem(key,'cart')" icon="mdi-minus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                            </v-btn>
                            <span class="px-3"> {{ value.quantity }}</span>
                            <v-btn  @click="addItemMore(key,'cart')"  icon="mdi-plus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider v-if="index < Object.values(cart).length - 1" class="mt-2 mb-2 border-opacity-50"></v-divider>
                </v-card-item>
                <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
                <v-list-item>
                    <v-row>
                        <v-col cols="8">
                            <p class="mb-0">Ada lagi Pesanannya?</p>
                            <p class="mb-0">masih bisa nambah menu lain,ya</p>
                        </v-col>
                        <v-col class="text-end" cols="4">
                            <v-btn class="text-capitalize mt-3" size="small" rounded="5" variant="outlined" color="deep-purple-darken-3">
                                Tambah
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-list-item>
                <div v-if="!isCartTwoExist()">
                <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
                    <v-list-item>
                        <v-row>
                            <v-col cols="8">
                                <p class="mb-0">mau tambah resto lain?</p>
                                <p class="mb-0">bisa, klik tombol disamping</p>
                            </v-col>
                            <v-col class="text-end" cols="4">
                                <v-btn class="text-capitalize mt-3" @click="addOthersResto" size="small" rounded="5" variant="outlined" color="deep-purple-darken-3">
                                    Tambah
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-list-item>
                </div>
                <div v-if="isCartTwoExist()">
                    <div v-if="Object.values(cart_2).length != 0"> 
                    <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
                    <v-card-item v-for="([key, value], index) in Object.entries(cart_2)" :key="key" class="pb-0">
                    <v-row>
                        <v-col cols="6">
                            <p class="mb-1 font-weight-black text-capitalize text-subtitle-1">
                                {{value.nama}}</p>
                            <div  v-for="custom in value.custom_options" :key="custom">
                                <p  v-for="detail in getMenuDetails_2(custom)" :key="detail.id" class="m-0"> {{getKategoriDetail_2(detail.kategori_pilih_menu_id)}} : {{detail.nama_pilihan}}</p>
                            </div>
                            <v-chip v-if="value.catatan != ''">
                            Catatan : {{value.catatan}}
                            </v-chip>
                            <p v-if="value.custom_options.length == 0">{{ formatCurrency(totalCustome_2(value)) }}</p>
                        </v-col>
                        <v-col class="text-end pb-0" cols="6">
                            <v-avatar rounded="4" size="80" class="elevation-3">
                                <v-img :src="value.img_url"></v-img>
                            </v-avatar>
                        </v-col>
                        <v-col v-if="value.custom_options.length != 0"  cols="12">
                            {{ formatCurrency(totalCustome_2(value)) }}
                        </v-col>
                        <v-col  cols="6">
                            <div  v-if="value.custom_options.length != 0">
                                <v-btn class="text-capitalize" size="small" rounded="5" variant="outlined" color="deep-purple-darken-3" :to="{ name: 'EditCustom', query: {id: value.id, key: key , type: 'cart_2'} }">Edit
                                </v-btn>
                            </div>
                            <div v-if="value.custom_options.length == 0">
                                <v-btn @click="openDialogCatatan(value.catatan,key)" class="text-capitalize" size="small" prepend-icon="mdi-book" rounded="5"  variant="outlined" color="deep-purple-darken-3"> Catatan
                                </v-btn>
                            </div>
                        </v-col>
                        <v-col class="text-end mb-2" cols="6">
                            <v-btn @click="minusItem(key,'cart_2')" icon="mdi-minus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                            </v-btn>
                            <span class="px-3"> {{ value.quantity }}</span>
                            <v-btn  @click="addItemMore(key,'cart_2')"  icon="mdi-plus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider v-if="index < Object.values(cart).length - 1" class="mt-2 mb-2 border-opacity-50"></v-divider>
                </v-card-item>
                <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
                <v-list-item>
                    <v-row>
                        <v-col cols="8">
                            <p class="mb-0">Ada lagi Pesanannya?</p>
                            <p class="mb-0">masih bisa nambah menu lain,ya</p>
                        </v-col>
                        <v-col class="text-end" cols="4">
                            <v-btn class="text-capitalize mt-3" size="small" rounded="5" variant="outlined" color="deep-purple-darken-3">
                                Tambah
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-list-item>
                </div>
            </div>
                <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
                <v-list-item @click="dialog = true">
                    <v-row>
                        <v-col cols="8">
                            <p class="mb-0">
                            <v-icon>
                                mdi-cash-multiple
                            </v-icon>
                            Pilih Pembayaran
                            </p>
                        </v-col>
                        <v-col class="text-end" cols="4">
                            <v-btn append-icon="mdi-chevron-right" class="text-capitalize" size="small" rounded="5" variant="flat">
                                {{ radios }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-list-item>
                <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
            <!-- </template> -->
             <div class="text-body-2 mx-4 font-weight-bold mb-1">
                Ringkasan Pembayaran
             </div>
             <v-card rounded="3" class="mx-4 mb-3" elevation="2">
                <v-card-item>
                    <v-row no-gutters>
                        <v-col cols="6">
                            Harga
                        </v-col>
                        <v-col class="text-end" cols="6">
                            120.0000
                        </v-col>
                        <v-col  cols="6">
                            Biaya Pengiriman
                        </v-col>
                        <v-col class="text-end" cols="6">
                            12000
                        </v-col>
                        <v-col cols="6">
                            Biaya Lainya
                        </v-col>
                        <v-col class="text-end" cols="6">
                            12000
                        </v-col>
                        <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
                        <v-col cols="6">
                            Total Pembayaran
                        </v-col>
                        <v-col class="text-end" cols="6">
                            12000
                        </v-col>
                    </v-row>
                </v-card-item>
             </v-card>
        </v-card>
    </v-main>
   </v-layout>
   <!-- pembayaran -->
   <v-dialog
      v-model="dialog"
      fullscreen
    >
    <v-card>
        <v-toolbar>
          <v-btn
            icon="mdi-close"
            @click="dialog = false"
          ></v-btn>
          <v-toolbar-title>Pilih Pembayaran</v-toolbar-title>
          <v-toolbar-items>
            <v-btn
              text="Save"
              variant="text"
              @click="dialog = false"
            ></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-radio-group v-model="radios">
            <v-radio label="Tunai" value="tunai"></v-radio>
            <v-radio label="online" value="online"></v-radio>
        </v-radio-group>
    </v-card>
    </v-dialog>
    <!-- alamat -->
    <v-dialog
      v-model="dialogAlamat"
      fullscreen
    >
    <v-card>
        <v-toolbar>
          <v-btn
            icon="mdi-close"
            @click="dialogAlamat = false"
          ></v-btn>
          <v-toolbar-title>Pilih Pembayaran</v-toolbar-title>
          <v-toolbar-items>
            <v-btn
              text="Save"
              variant="text"
              @click="dialogAlamat = false"
            ></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-row class="mx-2 mt-2">
            <v-col v-for="alamat in alamats" :key="alamat.id" cols="12">
                <v-card
                class="mx-auto"
                @click="selectAlamat(alamat.id)"
                >
                <v-toolbar flat>
                    <v-toolbar-title class="ms-2"><v-icon>mdi-map-marker</v-icon> {{alamat.tipe_alamat}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>

                <v-card-text class="pt-4">
                {{alamat.alamat}}
                </v-card-text>
                <div class="px-4 mb-2">
                <v-chip-group selected-class="bg-deep-purple-lighten-2">
                    <v-chip>{{alamat.detail_alamat}}</v-chip>
                </v-chip-group>
                </div>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
    </v-dialog>
    <!-- catatan -->
    <v-dialog v-model="dialogCatatan" max-width="500">
            <v-card rounded="lg">
              <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">
                  Catatan
                </div>

                <v-btn
                  icon="mdi-close"
                  variant="text"
                  @click="dialogCatatan = false"
                ></v-btn>
              </v-card-title>

              <v-divider class="mb-4"></v-divider>

              <v-card-text>
                <div class="mb-2">Catatan (optional)</div>

                <v-textarea
                  v-model="addCatatan"
                  class="mb-2"
                  rows="2"
                  variant="outlined"
                ></v-textarea>
              </v-card-text>

              <v-divider class="mt-2"></v-divider>

              <v-card-actions class="my-2 d-flex justify-end">
                <v-btn
                  class="text-none"
                  color="primary"
                  rounded="xl"
                  text="Send"
                  variant="flat"
                  @click="addCartCatatan(selectedKey)"
                ></v-btn>
              </v-card-actions>
            </v-card>
    </v-dialog>
</template>

<script>
import api from '@/api/axios'
export default {
  data() {
    return {
        dialog: false,
        dialogAlamat: false,
        dialogCatatan:false,
        resto: null,
        menus: null,
        resto_2: null,
        menus_2: null,
        addCatatan: null,
        cart: null,
        cart_2: null,
        MenuInCart: null,
        isLoading: true,
        selectedAlamat: null,
        alamats: null,
        detailAlamat: null,
        idResto: [],
        latitude: null,
        longitude: null,
        radios: 'tunai',
        selectedKey: null,
    }
  },
  computed: {
    totalCustome() {
    return (value) => {
        let total = value.harga;
        if (value.custom_options && value.custom_options.length > 0) {
            value.custom_options.forEach(custom => {
                const details = this.getMenuDetails(custom);
                details.forEach(detail => {
                    total += detail.harga;
                });
            });
        }
        total *= value.quantity;
        return total;
        }
    },
    totalCustome_2() {
    return (value) => {
        let total = value.harga;
        if (value.custom_options && value.custom_options.length > 0) {
            value.custom_options.forEach(custom => {
                const details = this.getMenuDetails(custom);
                details.forEach(detail => {
                    total += detail.harga;
                });
            });
        }
        total *= value.quantity;
        return total;
        }
    },
  },
  methods: {
    formatCurrency(amount) {
            // Ubah angka menjadi format mata uang Rupiah
            const formatter = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            });
            return formatter.format(amount);
    },
    openDialogCatatan(catatan,key){
        this.addCatatan = catatan;
        this.selectedKey = key;
        this.dialogCatatan = true;
    },
    addOthersResto(){
        localStorage.setItem('cart_2', JSON.stringify({}));
        this.$router.push('/food');
    },
    addCartCatatan(key) {
        var cart = null;
        if (this.isCartTwoExist()) {
            cart = key in this.cart_2 ? this.cart_2 : this.cart;
        } else {
            cart = this.cart;
        }
    
      if (this.addCatatan != null) {
        cart[key].catatan = this.addCatatan;
            if (this.isCartTwoExist()) {
                if(key in this.cart_2){
                    this.updateLocalStorage_2();
                } else {
                    this.updateLocalStorage();
                }
            } else {
                this.updateLocalStorage();
            }
      }
      this.addCatatan = null;
      this.dialogCatatan = false;
    },
    selectAlamat(item){
        this.selectedAlamat = item;
        console.log(this.selectedAlamat);
        this.dialogAlamat = false; 
        this.getAlamatById();
    },
    async getSelectedAlamat(){
        const formData = {
                latitude: this.latitude, 
                longitude: this.longitude, 
        };
        try {
                const response = await api.post('profil/selected/alamat', formData);
                if(response.data.alamat !=null ){
                    this.selectAlamat(response.data.alamat);
                }
            } catch (error) {
                console.log(error);
        }
    },
    async getAlamatById(){
            try {
                const response = await api.get('profil/detail/alamat/' + this.selectedAlamat);
                this.detailAlamat = response.data.alamat;
                console.log(this.detailAlamat);
            } catch (error) {
                console.log(error);
            }
    },
    getMenuDetails(customId) {
            for (let menu of this.menus) {
                const customOptionsSearch = menu.custom_options;
              
                for (let option of customOptionsSearch) {
                    const detail = option.menu_detail.find(detail => detail.id === customId);
                    if (detail) {
                        return [detail]; 
                    }
                }
            }
            return [];
    },
    getMenuDetails_2(customId){
        for (let menu of this.menus_2) {
                const customOptionsSearch = menu.custom_options;
              
                for (let option of customOptionsSearch) {
                    const detail = option.menu_detail.find(detail => detail.id === customId);
                    if (detail) {
                        return [detail]; 
                    }
                }
            }
            return [];
    },
    getKategoriDetail(id) {
        let nama = null;
        for (let menu of this.menus) {
        const customOptionsSearch = menu.custom_options;
            for (let option of customOptionsSearch) {
                if (option.id == id) {
                nama = option.nama;
                break;
                }
            }
            if (nama !== null) {
                break;
            }
        }
        return nama;
    },
    getKategoriDetail_2(id) {
        let nama = null;
        for (let menu of this.menus_2) {
        const customOptionsSearch = menu.custom_options;
            for (let option of customOptionsSearch) {
                if (option.id == id) {
                nama = option.nama;
                break;
                }
            }
            if (nama !== null) {
                break;
            }
        }
        return nama;
    },
    isCartTwoExist() {
            return localStorage.getItem('cart_2') !== null;
    },
    async listMenu() {
      const formData = {
        latitude: this.latitude,
        longitude: this.longitude,
        search: '',
      };
    
      try {
        // Loop through each idResto in the array
        for (const id of this.idResto) {
          const response = await api.post('/menu/get/' + id, formData);
          // Assuming the response structure is consistent
          // You might need to adjust this based on your API response
          if (response.data.kedai) {
            if(id == this.idResto[0]){
                this.resto = response.data.kedai;
            } else if(id == this.idResto[1] && this.isCartTwoExist()){
                this.resto_2 = response.data.kedai;
          }
            }
          if (response.data.menu) {
            if(id == this.idResto[0]){
                this.menus = response.data.menu;
            } else if(id == this.idResto[1] && this.isCartTwoExist()){
                this.menus_2 = response.data.menu;
            }
          }
        }
        this.isLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async listAlamat(){
      try{
        const response = await api.get('profil/alamat');
        this.alamats = response.data.alamat;
        console.log(this.alamats)
      } catch(error){
        console.log(error)
      }
    },
    addItemMore(key,type) {
        if(type == 'cart_2' && this.isCartTwoExist()){
            const cartKey = key;
            this.cart_2[cartKey].quantity++;
            this.updateLocalStorage_2();
        } else {
            const cartKey = key;
            this.cart[cartKey].quantity++;
            this.updateLocalStorage();
        }
        
    },
    minusItem(key,type) {
        const cartKey = key;
        if(type == 'cart_2' && this.isCartTwoExist){
            if (this.cart_2[cartKey]) {
            this.cart_2[cartKey].quantity--;
            if (this.cart_2[cartKey].quantity <= 0) {
                delete this.cart_2[cartKey];
            }
                this.updateLocalStorage_2();
            }
        } else{
            if (this.cart[cartKey]) {
            this.cart[cartKey].quantity--;
            if (this.cart[cartKey].quantity <= 0) {
                delete this.cart[cartKey];
            }
                this.updateLocalStorage();
            }
        }
    },
    updateLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    updateLocalStorage_2(){
        localStorage.setItem('cart_2', JSON.stringify(this.cart_2));
    },
    loadCartFromLocalStorage() {
        const cart = localStorage.getItem('cart');
        const id_resto = localStorage.getItem('resto_id');
        if(this.isCartTwoExist()){
            const cartTwo = localStorage.getItem('cart_2');
            this.cart_2 = JSON.parse(cartTwo);
        }
        this.cart = JSON.parse(cart);
        this.idResto = JSON.parse(id_resto);
    },
  },
  mounted(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log(this.latitude,this.longitude)
        // Memanggil fungsi untuk mendapatkan list restoran
        this.listMenu();
        this.getSelectedAlamat();
      }, error => {
        console.error('Error getting location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
    this.listAlamat();
    this.loadCartFromLocalStorage();
  }
}
</script>
