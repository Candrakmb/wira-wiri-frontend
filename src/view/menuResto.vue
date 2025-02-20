<template>
<v-layout class="bg-grey-lighten-3">
    <v-app-bar :elevation="0">
        <template v-slot:prepend>
            <v-btn icon to="/food">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
        </template>
        <v-app-bar-title>
                <div v-if="resto && resto.user" class="text-capitalize">
                    {{resto.user.name}}
                </div>
        </v-app-bar-title>
    </v-app-bar>

    <!-- Konten utama -->
    <v-main color="surface-variant" class="mb-10">
        <div v-if="isLoading">
            <v-skeleton-loader type="card"></v-skeleton-loader>
            <v-skeleton-loader type="card"></v-skeleton-loader>
            <v-skeleton-loader type="card"></v-skeleton-loader>
        </div>
        <template v-else>
            <v-card v-if="resto && resto.user" class="mx-auto" :elevation="0">
                <v-card-title class="text-capitalize">{{resto.user.name}}</v-card-title>
                <v-card-text>
                    <div class="mt-4 mb-0 text-subtitle-1">
                        <v-icon>mdi-map-marker</v-icon> {{ resto.alamat }}
                    </div>
                    <v-chip-group v-model="selection" selected-class="bg-deep-purple-lighten-2">
                        <v-chip>{{ resto.distance }} km</v-chip>
                    </v-chip-group>
                </v-card-text>
            </v-card>
            <v-card class="mt-2 mb-2" :elevation="0">
                <v-card-title>Top Menu
                    <v-divider class="mt-2 mb-2 border-opacity-20"></v-divider>
                </v-card-title>

                <v-row class="px-3" no-gutters>
                    <template v-for="item in menuRandom" :key="item.id">
                        <v-col class="px-2 mb-5" cols="6">
                            <div class="rounded-lg elevation-4">
                                <v-img rounded="4" height="150px" cover :src="item.img_url"></v-img>
                            </div>
                            <p class="mt-2 text-subtitle-1 font-weight-black text-truncate text-capitalize mb-0">{{ item.nama }}
                            </p>
                            <p>{{ item.harga_formatted }}</p>

                            <div v-if="isInCart(item.id)" class="text-center" variant="outlined">
                                <div v-if="!item.has_custom">
                                    <v-btn @click="removeFromCart(item)" icon="mdi-minus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                                    </v-btn>
                                    <span class="px-3"> {{ getCartItem(item.id).quantity }}</span>
                                    <v-btn @click="addToCart(item)" icon="mdi-plus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                                    </v-btn>
                                </div>
                                <div v-else>
                                    <v-btn max-height="30px" @click="showCustomDialog(item); selectedItem = item;" class="rounded-xl mt-2 text-capitalize" variant="outlined" color="deep-purple-darken-3" block>{{ getTotalQuantityById(item.id)}}
                                        item</v-btn>
                                </div>
                            </div>
                            <v-btn v-else @click="addToCart(item)" class="rounded-xl mt-2 text-capitalize" max-height="30px" variant="outlined" color="deep-purple-darken-3" block>
                                Tambah
                            </v-btn>
                        </v-col>
                    </template>
                </v-row>
            </v-card>
            <v-card v-for="(menuItems, kategori) in view_menu" :key="kategori" class="mb-4">
                <v-card-title>{{ kategori }}
                    <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
                </v-card-title>
                <v-card-item  v-for="menu in menuItems" :key="menu.id" >
                    <v-row>
                        <v-col cols="6">
                            <p class="mb-1 font-weight-black text-capitalize text-subtitle-1">
                                {{menu.nama}}</p>
                            <p class="text-warp">{{ menu.deskripsi }}</p>
                        </v-col>
                        <v-col class="text-end pb-0" cols="6">
                            <v-avatar rounded="4" size="100" class="elevation-3">
                                <v-img :src="menu.img_url"></v-img>
                            </v-avatar>
                        </v-col>
                        <v-col class="font-weight-bold" cols="6">
                            {{ menu.harga_formatted }}
                        </v-col>
                        <v-col class="text-end" cols="6">
                            <div v-if="isInCart(menu.id)" class="text-end" variant="outlined">
                                <div v-if="!menu.has_custom" class="text-end">
                                    <v-btn @click="removeFromCart(menu)" icon="mdi-minus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                                    </v-btn>
                                    <span class="px-3"> {{ getCartItem(menu.id).quantity }}</span>
                                    <v-btn @click="addToCart(menu)" icon="mdi-plus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                                    </v-btn>
                                </div>
                                <div v-else>
                                    <v-btn max-height="30px" :width="100" @click="showCustomDialog(menu); selectedmenu = menu;" class="rounded-xl mt-2 text-capitalize" variant="outlined" color="deep-purple-darken-3">{{ getTotalQuantityById(menu.id)}}
                                        item</v-btn>
                                </div>
                            </div>
                            <v-btn v-else @click="addToCart(menu)" class="rounded-xl text-capitalize" :width="100" max-height="30px" variant="outlined" color="deep-purple-darken-3">
                                Tambah
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
                </v-card-item>
            </v-card>
            <div v-if="!isCartEmpty" class="sticky-buttom p-3 bg-white elevation-2">
                <v-row no-gutters>
                    <v-col cols="12" class="text-center mt-2 mb-4">
                        <v-btn to="/chekout" class="rounded-xl mt-1 text-capitalize" variant="flat" color="deep-purple-darken-3" block>Chekout - {{ formatCurrency(total) }}</v-btn>
                    </v-col>
                </v-row>
            </div>
        </template>
    </v-main>
    <!-- Dialog for custom options -->
    <v-dialog v-model="showDialog" fullscreen>
        <v-card>
            <div class="position-sticky">
                <v-toolbar class="bg-white elevation-2">
                    <v-btn icon="mdi-close" @click="showDialog = false"></v-btn>

                    <v-toolbar-title class="text-capitalize font-weight-bold">Custome {{ selectedItem ? selectedItem.nama : '' }}</v-toolbar-title>
                </v-toolbar>
                <v-alert color="warning" v-if="customeWajib" icon="$warning" title="Wajib pilih" text="bertanda wajib harus dipilih"></v-alert>
            </div>

            <v-card-text class="scrollable-content p-0 bg-grey-lighten-4">
                <div v-for="option in selectedItem.custom_options" :key="option" no-gutters class="p-2 mb-2 bg-white" style="height:auto;">
                    <v-row no-gutters>
                        <v-col cols="12">
                            <p class="text-h6 text-capitalize font-weight-bold mb-0">{{ option.nama }}</p>
                        </v-col>
                        <v-col cols="auto">
                            <p class="font-weight-light" v-if="option.opsi == '1'"> wajib | </p>
                            <p class="font-weight-light" v-if="option.opsi == '0'">optional | </p>
                        </v-col>
                        <v-col cols="auto" class="text-start ms-2">
                            <p v-if="option.max_pilih == '1'"> pilih 1</p>
                            <p v-if="option.max_pilih > '1'">max {{option.max_pilih}}</p>
                        </v-col>
                    </v-row>
                    <v-row v-for="listCustome in option.menu_detail" :key="listCustome.id" no-gutters>
                        <v-col cols="6">
                            <v-checkbox v-model="selectedCustom_options" :label="listCustome.nama_pilihan" :disabled="disableGroups(option) && !selectedCustom_options.includes(listCustome.id)" :value="listCustome.id"></v-checkbox>
                        </v-col>
                        <v-col cols="6" class="text-end mt-3">
                            <p>{{listCustome.harga_formatted}}</p>
                        </v-col>
                        <v-divider class="border-opacity-50"></v-divider>
                    </v-row>

                </div>
                <div style="height:300px">
                    <v-row no-gutters class="p-2 mt-2 bg-white">
                        <v-col cols="12">
                            <p class="text-h6 text-capitalize font-weight-bold mb-0">Catatan</p>
                        </v-col>
                        <v-col cols="auto">
                            <p class="font-weight-light">optional</p>
                        </v-col>
                        <v-col cols="10" class="text-start ms-2">
                            <v-textarea v-model="catatan" label="Catatan"></v-textarea>
                        </v-col>
                    </v-row>
                </div>

            </v-card-text>

            <div class="sticky-buttom p-3 bg-white elevation-2">

                <v-row no-gutters>
                    <!-- <v-col cols="6">Jumlah pesanan</v-col>
                        <v-col cols="6" class="text-end">test</v-col> -->
                    <v-col cols="12" class="text-center mt-2 mb-4">
                        <v-btn @click="addItemToCart(selectedItem)" class="rounded-xl mt-1 text-capitalize" variant="flat" color="deep-purple-darken-3" block>Tambah pesanan - {{ formatCurrency(totalCustome(selectedCustom_options, selectedItem.harga, 1)) }}</v-btn>
                        <!-- <v-btn variant="flat" @click="addItemToCart(selectedItem)">Tambah</v-btn> -->
                    </v-col>
                </v-row>
            </div>
        </v-card>
    </v-dialog>
    <!-- Dialog list custom  -->
    <v-dialog v-model="custemDialog" max-width="500px">
        <v-card>
            <v-card-title>
                {{ selectedItem ? selectedItem . nama : '' }}
            </v-card-title>
            <v-card-text>
                <template v-if="resto.id === idResto[0]">
                    <div v-for="listCart in cart" :key="listCart.id">
                    <div v-if="listCart.id == selectedItem.id">
                        <v-row>
                            <v-col cols="12" class="pb-0">
                                <p class="mb-0">
                                    custom:
                                    <span v-for="custom in listCart.custom_options" :key="custom">
                                        <span v-for="detail in getMenuDetails(custom)" :key="detail.id">
                                            {{ detail.nama_pilihan }} ,
                                        </span>
                                    </span>

                                </p>
                                <p class="mb-0">
                                    Total Harga: {{ formatCurrency(totalCustome(listCart.custom_options,selectedItem.harga, listCart.quantity )) }}
                                </p>
                            </v-col>
                            <v-col cols="12" class="text-end">
                                <v-btn class="rounded-xl mx-2 text-capitalize" max-height="30px" variant="outlined" @click="openCustomDialog(selectedItem)" color="deep-purple-darken-3">Ubah
                                </v-btn>
                                <v-btn @click="removeFromCart(listCart)" icon="mdi-minus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                                </v-btn>
                                <span class="px-3"> {{ listCart . quantity }}</span>
                                <v-btn @click="addItemToCart(listCart)" icon="mdi-plus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </div>
                </template>
                <template v-else-if="resto.id === idResto[1] && isCartTwoExist()">
                    <div v-for="listCart in cart_2" :key="listCart.id">
                    <div v-if="listCart.id == selectedItem.id">
                        <v-row>
                            <v-col cols="12" class="pb-0">
                                <p class="mb-0">
                                    custom:
                                    <span v-for="custom in listCart.custom_options" :key="custom">
                                        <span v-for="detail in getMenuDetails(custom)" :key="detail.id">
                                            {{ detail.nama_pilihan }} ,
                                        </span>
                                  </span>

                                </p>
                                <p class="mb-0">
                                    Total Harga: {{ formatCurrency(totalCustome(listCart.custom_options,selectedItem.harga, listCart.quantity )) }}
                                </p>
                            </v-col>
                            <v-col cols="12" class="text-end">
                                <!-- <v-btn class="rounded-xl mx-2 text-capitalize" max-height="30px" variant="outlined" @click="openCustomDialog(selectedItem)" color="deep-purple-darken-3">Ubah
                                </v-btn> -->
                                <v-btn @click="removeFromCart(listCart)" icon="mdi-minus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                                </v-btn>
                                <span class="px-3"> {{ listCart . quantity }}</span>
                                <v-btn @click="addItemToCart(listCart)" icon="mdi-plus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </div>
                </template>
                
            </v-card-text>
            <v-card-actions>
                <v-btn class="rounded-xl mt-2 text-capitalize" variant="elevated" color="deep-purple-darken-3" @click="addToCartNewCustome(selectedItem)" block>Tambah custom lain</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="changeResto" max-width="500px">
        <v-card>
            <v-row no-gutters class="text-center mt-3 mb-2 p-1">
                <v-col cols="12" class="text-center mt-3">
                    <v-icon icon="mdi-alert-circle" size="x-large"></v-icon>
                </v-col>
                <v-col cols="12" class="text-center mb-1">
                    <v-card-title>
                        Mau ganti pesan dari resto ini aja?
                    </v-card-title>
                    <p>bisa kok, tapi,menu yang kamu pilih dari resto sebelumnya kami hapus, ya.</p>
                </v-col>
                <v-col cols="6">
                    <v-btn @click="changeResto = false" variant="outlined" color="deep-purple-darken-3">gak jadi</v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn @click="acceptChangeResto(selectedItem)" variant="flat" color="deep-purple-darken-3">iya ganti
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>

</v-layout>
</template>

<script>
import api from '@/api/axios.js';
import formatCurrency from '@/mixins/formatCurrency';

export default {
    mixins: [formatCurrency],
    data() {
        return {
            latitude: '',
            longitude: '',
            showSearch: false,
            customeWajib: false,
            searchQuery: '',
            isHeartClicked: false,
            kategori: ['makanan', 'minuman', 'combo'],
            cart: {}, // Cart data
            cart_2:{},
            resto: null,
            idResto: [],
            menus: null,
            view_menu : null,
            menuRandom: null,
            showDialog: false,
            custemDialog: false,
            changeResto: false,
            selectedItem: null,
            isLoading: true,
            selectedCustom_options: [],
            catatan: '',
        };
    },
    computed: {
        heartClass() {
            return {
                'heart-full': this.isHeartClicked,
                'heart-outline': !this.isHeartClicked,
            };
        },
        heartIcon() {
            return this.isHeartClicked ? 'mdi-heart' : 'mdi-heart-outline';
        },
        totalCustome() {
            return (customOptions, selectedItemHarga, qty) => {
                let total = selectedItemHarga;
                customOptions.forEach(custom => {
                    const details = this.getMenuDetails(custom);
                    details.forEach(detail => {
                        total += detail.harga;
                    });
                });
                total *= qty;
                return total;
            }
        },
        isCartEmpty() {
            if(this.isCartTwoExist() && this.idResto[1] === this.resto.id){
                return Object.keys(this.cart_2).length === 0;
            }else if(this.idResto[0] === this.resto.id){
                return Object.keys(this.cart).length === 0;
            }else{
                return true;
            }
        },
        total() {
            let total = 0;
            let cartItems = null;
            if(this.isCartTwoExist() && this.idResto[1] === this.resto.id){
                cartItems = Object.values(this.cart_2);
            }else if(this.idResto[0] === this.resto.id){
                cartItems = Object.values(this.cart);
            }
            cartItems.forEach(item => {
                if (item.custom_options && item.custom_options.length > 0) {
                    total += this.totalCustome(item.custom_options, item.harga, item.quantity);
                } else {
                    total += item.harga * item.quantity;
                }
            });
            return total;
        }
    },
    methods: {
        disableGroups(option) {
            const custom_options = option.menu_detail.map((menu_detail) => menu_detail.id);
            const selected = this.selectedCustom_options.filter((menu_detailId) => {
                return custom_options.includes(menu_detailId);
            });
            return selected.length >= option.max_pilih;
        },
        async listMenu() {
            const formData = {
                latitude: this.latitude, // Gunakan latitude yang sudah didapat
                longitude: this.longitude, // Gunakan longitude yang sudah didapat
                search: '', // Misalnya parameter pencarian, bisa dikosongkan atau diisi sesuai kebutuhan
            };

            try {
                const response = await api.post('/menu/get/' + this.$route.params.id, formData);
                this.resto = response.data.kedai;
                this.menus = response.data.menu;
                this.view_menu = response.data.viewMenu;
                this.menuRandom = response.data.menu_random;
                console.log(this.menuRandom)
                this.isLoading = false;
            } catch (error) {
                console.log(error);
            }
        },
        getMenuDetails(customId) {
            for (let menu of this.menus) {
                const customOptionsSearch = menu.custom_options;
                // Loop melalui custom_options dalam menu
                for (let option of customOptionsSearch) {
                    const detail = option.menu_detail.find(detail => detail.id === customId);
                    if (detail) {
                        return [detail]; // Kembalikan menu_detail yang ditemukan
                    }
                }
            }
            return [];
        },
        getTotalQuantityById(itemId) {
            if(this.isCartTwoExist() && this.idResto[1] === this.resto.id){
                return Object.values(this.cart_2).filter(cartItem => cartItem.id === itemId).reduce((total, cartItem) => total + cartItem.quantity, 0);
            } else if(this.idResto[0] === this.resto.id){
                return Object.values(this.cart)
                .filter(cartItem => cartItem.id === itemId)
                .reduce((total, cartItem) => total + cartItem.quantity, 0);
            }
        },
        isInCart(itemId) {
            let isExist = false;
            if( this.idResto[1] === this.resto.id && Object.keys(this.cart_2).length !== 0){
                isExist =  Object.values(this.cart_2).some(cartItem => cartItem.id === itemId);
                console.log('isExist', isExist);
            }else if(this.idResto[0] === this.resto.id && Object.keys(this.cart).length !== 0){
                isExist = Object.values(this.cart).some(cartItem => cartItem.id === itemId);
                console.log('isExist cart', isExist);
            }
            
            return isExist;
        },
        isCartTwoExist() {
            return localStorage.getItem('cart_2') !== null;
        },
        getCartItem(itemId) {
            let getItem = null;
            console.log('cart 2 kosong', Object.keys(this.cart_2).length !== 0 )
            if(this.idResto[1] === this.resto.id){
                getItem = Object.values(this.cart_2).find(cartItem => cartItem.id === itemId);
            }else if(this.idResto[0] === this.resto.id){
                getItem = Object.values(this.cart).find(cartItem => cartItem.id === itemId);
            }
            console.log('cartItem', getItem);
            return getItem;
        },
        getCartKey(itemId) {
            let cartKey = null;
            if(this.idResto[1] === this.resto.id){
                cartKey = Object.keys(this.cart_2).find(key => this.cart[key].id === itemId)
            }else if(this.idResto[0] === this.resto.id){
                cartKey = Object.keys(this.cart).find(key => this.cart[key].id === itemId)
            }
            console.log('cartkey', cartKey )
            return cartKey;
        },
        toggleSearch() {
            this.showSearch = !this.showSearch;
        },
        setIdResto(){
            if(this.idResto.length !== 0 && this.idResto.includes(this.resto.id)){
                //buat untuk tidak melakukan apapun
                return;
            }else{
                this.idResto.push(this.resto.id);
                localStorage.setItem('resto_id', JSON.stringify(this.idResto));
            }
        },
        removeIdResto(){
            if(this.idResto.length > 1 && this.isCartTwoExist()){
                this.idResto.pop();
                localStorage.setItem('resto_id', JSON.stringify(this.idResto));
            } else {
                this.idResto = [];
                localStorage.setItem('resto_id', JSON.stringify(this.idResto));
            }
        },
        openCustomDialog(item) {
            this.selectedItem = item;
            this.selectedCustom_options = [];
            this.showDialog = true;
        },
        showCustomDialog(item) {
            this.selectedItem = item;
            this.custemDialog = true;
        },
        addToCartNewCustome(item) {
            this.openCustomDialog(item);
            this.custemDialog = false;
        },
        acceptChangeResto(item) {
            if(this.isCartTwoExist() && Object.keys(this.cart_2).length !== 0 && this.idResto.length > 1){
                this.cart_2 = {};
                this.updateLocalStorage_2();
            } else if(!this.isCartTwoExist() && Object.keys(this.cart).length !== 0){
                this.cart = {};
                this.updateLocalStorage();
            }
            this.removeIdResto();
            this.setIdResto();
            if (item.has_custom) {
                this.addItemToCart(item);
            } else {
                this.addToCart(item);
            }
            this.changeResto = false;
        },
        addToCart(item) {
            // If cart is empty and no resto ID is set, add item and set resto ID
            if (Object.keys(this.cart).length === 0 && this.idResto.length === 0) {
                    if (item.has_custom && !this.isInCart(item.id)) {
                    this.openCustomDialog(item);
                    } else {
                    this.setIdResto();
                    this.addItemToCart(item);
                    }
            } else if (this.isCartTwoExist() && Object.keys(this.cart_2).length === 0 && this.idResto.length !== 0){
                    if (item.has_custom && !this.isInCart(item.id)) {
                        this.openCustomDialog(item);
                    } else {
                        this.setIdResto();
                        this.addItemToCart(item);
                    }
            }else {
                if (this.idResto.length > 0 && this.idResto.includes(this.resto.id)) {
                    if (item.has_custom && !this.isInCart(item.id)) {
                        this.openCustomDialog(item);
                    } else {
                        this.addItemToCart(item);
                    }
                } else {
                    if (item.has_custom && !this.isInCart(item.id)) {
                        this.openCustomDialog(item);
                    } else {
                        this.changeResto = true;
                        this.selectedItem = item;
                    }
                }
            }
        },
        
        addItemToCart(item) {
          let custom_optionsKey = '';
        
          if (item.has_custom) {
            // If it's the first item in the cart and no resto ID is set, set it
            if (Object.keys(this.cart).length === 0 && this.idResto.length === 0) {
                this.setIdResto();
            } else if (this.isCartTwoExist() && Object.keys(this.cart_2).length === 0 && this.idResto.length !== 0 &&  this.idResto.length < 2 ){
                this.setIdResto();
            }
            console.log('cek itemtocart', this.idResto.length > 0 && this.idResto.includes(this.resto.id))
            // buatkan cek apakah resto.id terdapat di idResto
            if(this.idResto.length > 0 && this.idResto.includes(this.resto.id))
            {
               // Check if there are mandatory custom options
                let menuDetailWithOpsi1 = item.custom_options.find(item => item.opsi === 1);
                if (menuDetailWithOpsi1 !== undefined) {
                let menuDetailIds = menuDetailWithOpsi1.menu_detail.map(detail => detail.id);
                let exists = menuDetailIds.some(id => this.selectedCustom_options.includes(id));
            
                if (exists) {
                    // Generate custom options key
                    custom_optionsKey = item.has_custom ? this.selectedCustom_options.slice().sort().join(',') : '';
                    const cartKey = `${item.id}-${custom_optionsKey}`;
            
                    // Add item to cart
                    this.addItemToCartHelper(item, cartKey);
                } else {
                    this.customeWajib = true;
                }
                } else {
                // Generate custom options key
                custom_optionsKey = item.has_custom ? this.selectedCustom_options.slice().sort().join(',') : '';
                const cartKey = `${item.id}-${custom_optionsKey}`;
            
                // Add item to cart
                this.addItemToCartHelper(item, cartKey);
                }
            }
            else{
                this.changeResto = true;
                this.selectedItem = item;
                this.showDialog = false;
            }
          } else {
            console.log('apakah id > dari 2', this.idResto.length < 2)
            // Generate custom options key
            custom_optionsKey = item.has_custom ? this.selectedCustom_options.slice().sort().join(',') : '';
            const cartKey = `${item.id}-${custom_optionsKey}`;
        
            // Add item to cart
            this.addItemToCartHelper(item, cartKey);
          }
        },
        
        // Helper function to add item to cart
        addItemToCartHelper(item, cartKey) {
          const itemToAdd = {
            ...item,
            custom_options: item.has_custom ? this.selectedCustom_options.slice().sort() : [],
            catatan: this.catatan
          };

          if(this.isCartTwoExist() && this.idResto[1] === this.resto.id){
                if(!this.cart_2[cartKey]){
                    this.cart_2[cartKey] = {
                        ...itemToAdd,
                        quantity: 1
                    };
                }else{
                    this.cart_2[cartKey].quantity++;
                }
                this.updateLocalStorage_2();
          }else if(this.idResto[0] === this.resto.id){
                if (!this.cart[cartKey]) {
                this.cart[cartKey] = {
                ...itemToAdd,
                quantity: 1
                    };
                } else {
                    this.cart[cartKey].quantity++;
                }
                this.updateLocalStorage();
          }
          this.showDialog = false;
          this.customeWajib = false;
          this.resetCustom_options();
        },
        removeFromCart(item){
            const custom_optionsKey = item.has_custom? item.custom_options.slice().sort().join(','): '';
            const cartKey = `${item.id}-${custom_optionsKey}`;

            if(this.isCartTwoExist() && this.idResto[1] === this.resto.id){
                if(this.cart_2[cartKey]){
                        this.cart_2[cartKey].quantity--;
                        if(this.cart_2[cartKey].quantity === 0){
                            delete this.cart_2[cartKey];
                            if(!this.isInCart(item.id) && item.has_custom){
                                this.custemDialog = false;
                            }
                        }
                        this.updateLocalStorage_2();
                    }
                    if(Object.keys(this.cart_2).length === 0 && this.idResto.length !== 0){
                        this.removeIdResto();
                    }
            }else if(this.idResto[0] === this.resto.id){
                if(this.cart[cartKey]){
                        this.cart[cartKey].quantity--;
                        if(this.cart[cartKey].quantity === 0){
                            delete this.cart[cartKey];
                            if(!this.isInCart(item.id) && item.has_custom){
                                this.custemDialog = false;
                            }
                        }
                        this.updateLocalStorage();
                    }
                    if(Object.keys(this.cart).length === 0 && this.idResto.length !== 0){
                        this.removeIdResto();
                    }
            }
               
        },
        updateLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        updateLocalStorage_2() {
            localStorage.setItem('cart_2', JSON.stringify(this.cart_2));
        },
        loadCartFromLocalStorage() {
            const cart = localStorage.getItem('cart');
            const id_resto = localStorage.getItem('resto_id');
            if(this.isCartTwoExist()){
                const cartTwo = localStorage.getItem('cart_2');
                this.cart_2 = JSON.parse(cartTwo);
            }
            console.log('tes data',)
            if (cart) {
                this.cart = JSON.parse(cart);
                this.idResto = JSON.parse(id_resto);
            }
        },
        resetCustom_options() {
            this.selectedCustom_options = [];
            this.catatan = '';
        },
    },
    mounted() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;

                // Memanggil fungsi untuk mendapatkan list restoran
                this.listMenu();
            }, error => {
                console.error('Error getting location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }

        this.loadCartFromLocalStorage();
    },
};
</script>

<style scoped>
.scrollable-content {
    height: auto;
    /* Adjust height as needed */
    overflow-y: auto;
}

.text-warp {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-height: 1em;
    max-height: 3.5em;
}

.dashed-divider {
    border-top: 1px dashed #000;
    /* Ganti dengan warna dan lebar garis sesuai kebutuhan Anda */
}

.heart-full {
    color: red;
    transition: color 0.3s ease-in-out, transform 0.3s ease-in-out;
    transform: scale(1.2);
}

.heart-outline {
    color: black;
    transition: color 0.3s ease-in-out, transform 0.3s ease-in-out;
    transform: scale(1);
}

.position-sticky {
    position: -webkit-sticky;
    /* Untuk Safari */
    position: sticky;
    top: 0;
    z-index: 10;
}

.sticky-buttom {
    bottom: 0px;
    z-index: 1004;
    transform: translateY(0px);
    position: fixed;
    height: 80px;
    left: 0px;
    width: calc(100% + 0px);
}
</style>
