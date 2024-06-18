<template>
    <v-layout class="bg-grey-lighten-3">
        <v-app-bar :elevation="0">
            <template v-slot:prepend>
                <v-btn icon>
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </template>
            <v-app-bar-title>
                <template v-if="showSearch">
                    <v-text-field v-model="searchQuery" label="Search" single-line hide-details
                        @keyup.enter="performSearch"></v-text-field>
                </template>
                <template v-else>
                    <div class="text-capitalize">
                        nama retoran
                    </div>
                </template>
            </v-app-bar-title>
            <v-btn icon @click="toggleSearch">
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon @click="toggleHeart">
                <v-icon :class="heartClass">{{ heartIcon }}</v-icon>
            </v-btn>
        </v-app-bar>

        <!-- Konten utama -->
        <v-main color="surface-variant">
            <v-card class="mx-auto" :elevation="0">
                <v-card-item>
                    <v-card-title>Cafe Badilico</v-card-title>
                </v-card-item>

                <v-card-text>
                    <v-row align="center" class="mx-0">
                        <v-rating :model-value="4.5" color="amber" density="compact" size="small" half-increments
                            readonly></v-rating>

                        <div class="text-grey ms-4">
                            4.5 (413)
                        </div>
                    </v-row>

                    <div class="mt-4 mb-0 text-subtitle-1">
                        <v-icon>mdi-map-marker</v-icon> Italian, Cafe
                    </div>
                    <v-chip-group v-model="selection" selected-class="bg-deep-purple-lighten-2">
                        <v-chip>4 km</v-chip>
                    </v-chip-group>
                </v-card-text>
            </v-card>
            <v-card class="mt-2 mb-2" :elevation="0">
                <v-card-title>Top Menu
                    <v-divider class="mt-2 mb-2 border-opacity-20"></v-divider>
                </v-card-title>

                <v-row class="px-3" no-gutters>
                    <template v-for="item in items" :key="item.id">
                        <v-col class="px-2 mb-5" cols="6">
                            <div class="rounded-lg">
                                <v-img rounded="4" max-height="500px" cover
                                    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-img>
                            </div>
                            <p class="mt-2 text-subtitle-1 font-weight-black text-capitalize mb-0">{{ item . name }}
                            </p>
                            <p>{{ item . price }}</p>

                            <div v-if="isInCart(item.id)" class="text-center" variant="outlined">
                                <div v-if="!item.hasCustom">
                                    <v-btn @click="removeFromCart(item)" icon="mdi-minus" size="x-small"
                                        variant="outlined" color="deep-purple-darken-3">
                                    </v-btn>
                                    <span class="px-3"> {{ getCartItem(item.id).quantity }}</span>
                                    <v-btn @click="addToCart(item)" icon="mdi-plus" size="x-small" variant="outlined"
                                        color="deep-purple-darken-3">
                                    </v-btn>
                                </div>
                                <div v-else>
                                    <v-btn max-height="30px" @click="showCustomDialog(item); selectedItem = item;"
                                        class="rounded-xl mt-2 text-capitalize" variant="outlined"
                                        color="deep-purple-darken-3" block>{{ getTotalQuantityById(item.id)}}
                                        item</v-btn>
                                </div>
                            </div>
                            <v-btn v-else @click="addToCart(item)" class="rounded-xl mt-2 text-capitalize"
                                max-height="30px" variant="outlined" color="deep-purple-darken-3" block>
                                Tambah
                            </v-btn>
                        </v-col>
                    </template>
                </v-row>
            </v-card>
            <v-card>
                <v-card-title>Makanan
                    <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
                </v-card-title>
                <v-card-item>
                    <v-row>
                        <v-col cols="6">
                            <p class="mb-1 font-weight-black text-capitalize text-subtitle-1">
                                nama makanan</p>
                            <p class="text-warp">deskripsi makakanan adawd dawda qwqqwqqw ygkhkkhk kh </p>
                        </v-col>
                        <v-col class="text-end pb-0" cols="6">
                            <v-avatar rounded="4" size="100">
                                <v-img src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"></v-img>
                            </v-avatar>
                        </v-col>
                        <v-col class="font-weight-bold" cols="6">
                            Rp12.000
                        </v-col>
                        <v-col class="text-end" cols="6">
                            <v-btn class="rounded-xl text-capitalize" :width="100" max-height="30px"
                                variant="outlined" color="deep-purple-darken-3">
                                Tambah
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
                </v-card-item>
            </v-card>
        </v-main>
        <!-- Dialog for custom options -->
        <v-dialog v-model="showDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    Pilih Custom untuk {{ selectedItem ? selectedItem . name : '' }}
                </v-card-title>
                <v-card-text>
                    <v-checkbox v-for="option in selectedItem.customOptions" :key="option"
                        v-model="selectedCustomOptions" :label="option" :value="option">
                    </v-checkbox>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="showDialog = false">Batal</v-btn>
                    <v-btn text @click="addItemToCart(selectedItem)">Tambah</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Dialog tampilkan   -->
        <v-dialog v-model="custemDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    {{ selectedItem ? selectedItem . name : '' }}
                </v-card-title>
                <v-card-text>

                    <div v-for="listCart in cart" :key="listCart">
                        <div v-if="listCart.id == selectedItem.id">
                            <v-row>
                                <v-col cols="12" class="pb-0">
                                    <p class="mb-0">custom : <span v-for="custom in listCart.customOptions"
                                            :key="custom">{{ custom }}, </span> </p>
                                </v-col>
                                <v-col cols="12" class="text-end">
                                    <v-btn  class="rounded-xl mx-2 text-capitalize"
                                        max-height="30px" variant="outlined" color="deep-purple-darken-3">Ubah
                                    </v-btn>
                                    <v-btn @click="removeFromCart(listCart)" icon="mdi-minus" size="x-small"
                                        variant="outlined" color="deep-purple-darken-3">
                                    </v-btn>
                                    <span class="px-3"> {{ listCart . quantity }}</span>
                                    <v-btn @click="addItemToCart(listCart)" icon="mdi-plus" size="x-small"
                                        variant="outlined" color="deep-purple-darken-3">
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </div>

                </v-card-text>
                <v-card-actions>
                    <v-btn class="rounded-xl mt-2 text-capitalize" variant="elevated" color="deep-purple-darken-3"
                        @click="addToCartNewCustome(selectedItem)" block>test</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {
        data() {
            return {
                showSearch: false,
                searchQuery: '',
                isHeartClicked: false,
                kategori: ['makanan', 'minuman', 'combo'],
                cart: {}, // Cart data
                items: [{
                        id: 0,
                        name: 'nama makanan 1',
                        price: 12000,
                        hasCustom: true,
                        customOptions: ['Option A', 'Option B']
                    },
                    {
                        id: 1,
                        name: 'nama makanan 2',
                        price: 15000,
                        hasCustom: false,
                        customOptions: []
                    },
                    {
                        id: 2,
                        name: 'nama makanan 3',
                        price: 18000,
                        hasCustom: true,
                        customOptions: ['Option C', 'Option D']
                    },
                    {
                        id: 3,
                        name: 'nama makanan 4',
                        price: 20000,
                        hasCustom: false,
                        customOptions: []
                    },
                ], // Example items
                showDialog: false,
                custemDialog: false,
                selectedItem: null,
                selectedCustomOptions: [],

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
        },
        methods: {
            getTotalQuantityById(itemId) {
            return Object.values(this.cart)
                .filter(cartItem => cartItem.id === itemId)
                .reduce((total, cartItem) => total + cartItem.quantity, 0);
            },
            isInCart(itemId) {
                const exists = Object.values(this.cart).some(cartItem => cartItem.id === itemId);
                return exists;
            },
            getCartItem(itemId) {
                return Object.values(this.cart).find(cartItem => cartItem.id === itemId);
            },
            getCartKey(itemId) {
            return Object.keys(this.cart).find(key => this.cart[key].id === itemId);
            },
            toggleSearch() {
                this.showSearch = !this.showSearch;
            },
            performSearch() {
                // Tambahkan logika pencarian di sini
                console.log('Performing search with query:', this.searchQuery);
            },
            toggleHeart() {
                this.isHeartClicked = !this.isHeartClicked;
            },
            openCustomDialog(item) {
                this.selectedItem = item;
                this.selectedCustomOptions = [];
                this.showDialog = true;
            },
            showCustomDialog(item) {
                this.selectedItem = item;
                this.custemDialog = true;
            },
            addToCartNewCustome(item){
                this.openCustomDialog(item);
                this.custemDialog = false;
            },
            addToCart(item) {
                if (item.hasCustom && !this.isInCart(item.id)) {
                    this.openCustomDialog(item);
                } else {
                    this.addItemToCart(item);
                }
            },
            addItemToCart(item) {
                // console.log(item.customOptions);
                var customOptionsKey ='';
                if(this.selectedCustomOptions != ''){
                     customOptionsKey = item.hasCustom ? this.selectedCustomOptions.join(',') : '';
                }else if(this.selectedCustomOptions == '' && this.isInCart(item.id)){
                     customOptionsKey = item.hasCustom ? item.customOptions.join(',') : '';
                }
                const cartKey = `${item.id}-${customOptionsKey}`;
                // console.log(customOptionsKey);
                const itemToAdd = {
                    ...item,
                    customOptions: item.hasCustom ? this.selectedCustomOptions : []
                };

                if (!this.cart[cartKey]) {
                    this.cart[cartKey] = {
                        ...itemToAdd,
                        quantity: 1
                    };
                } else {
                    this.cart[cartKey].quantity++;
                }
                this.updateLocalStorage();
                this.showDialog = false;
                this.resetCustomOptions();
            },
            removeFromCart(item) {
                const customOptionsKey = item.hasCustom ? item.customOptions.join(',') : '';
                const cartKey = `${item.id}-${customOptionsKey}`;
                console.log(cartKey)

                if (this.cart[cartKey]) {
                    this.cart[cartKey].quantity--;
                    if (this.cart[cartKey].quantity <= 0) {
                        delete this.cart[cartKey];
                    }
                    this.updateLocalStorage();
                }
            },
            updateLocalStorage() {
                localStorage.setItem('cart', JSON.stringify(this.cart));
            },
            loadCartFromLocalStorage() {
                const cart = localStorage.getItem('cart');
                if (cart) {
                    this.cart = JSON.parse(cart);
                }
            },
            resetCustomOptions() {
                this.selectedCustomOptions = [];
            },
        },
        mounted() {
            this.loadCartFromLocalStorage();
        },
    };
</script>


<style scoped>
    .text-warp {
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-height: 1em;
        max-height: 3.5em;
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
</style>
