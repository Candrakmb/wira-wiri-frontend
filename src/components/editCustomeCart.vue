<template>
    <v-card v-if="!isLoading">
            <div class="position-sticky">
                <v-toolbar class="bg-white elevation-2">
                    <v-btn icon="mdi-arrow-left" @click="$router.go(-1)"></v-btn>

                    <v-toolbar-title class="text-capitalize font-weight-bold">Custome {{ menu ? menu.nama : '' }}</v-toolbar-title>
                </v-toolbar>
                <v-alert color="warning" v-if="customeWajib" icon="$warning" title="Wajib pilih" text="bertanda wajib harus dipilih"></v-alert>
            </div>

            <v-card-text class="scrollable-content p-0 bg-grey-lighten-4">
                <div v-for="option in menu.custom_options" :key="option" no-gutters class="p-2 mb-2 bg-white" style="height:auto;">
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
                <div style="height:350px">
                    <v-row no-gutters class="p-2 mt-2 bg-white">
                        <v-col cols="12">
                            <p class="text-h6 text-capitalize font-weight-bold mb-0">Catatan</p>
                        </v-col>
                        <v-col cols="12">
                            <p class="font-weight-light">optional</p>
                        </v-col>
                        <v-col cols="12" class="text-start px-2">
                            <v-textarea v-model="catatan" label="Catatan"></v-textarea>
                        </v-col>
                    </v-row>
                </div>

            </v-card-text>

            <div class="sticky-buttom p-3 bg-white elevation-2">

                <v-row no-gutters>
                    <v-col cols="6">Jumlah pesanan</v-col>
                    <v-col cols="6" class="text-end">
                        <v-btn @click="decreaseQuantity" :disabled="quantityNew === 1" icon="mdi-minus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                        </v-btn>
                        <span class="px-3">{{ quantityNew }}</span>
                        <v-btn @click="increaseQuantity" icon="mdi-plus" size="x-small" variant="outlined" color="deep-purple-darken-3">
                        </v-btn>
                    </v-col>
                    <v-col cols="12" class="text-center mt-2 mb-4">
                        <v-btn :disabled="disabledBtnUpdate()" @click="updateCustom(key)" class="rounded-xl mt-1 text-capitalize" variant="flat" color="deep-purple-darken-3" block>Update Custom - {{ formatCurrency(totalCustome(selectedCustom_options, menu.harga, quantityNew)) }}</v-btn>
                        <!-- <v-btn variant="flat" @click="addItemToCart(menu)">Tambah</v-btn> -->
                    </v-col>
                </v-row>
            </div>
        </v-card>
</template>

<script>
import api from '@/api/axios';

export default {
  data() {
    return {
        menu: null,
        isLoading: true,
        selectedCustom_options: [],
        cart: {},
        cart_2: {},
        selectedCart: null,
        catatan: null,
        quantityNew: null,
    }
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    key() {
      return this.$route.query.key;
    },
    type() {
      return this.$route.query.type;
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
  },
  methods: {
    decreaseQuantity() {
    if (this.quantityNew > 1) {
      this.quantityNew--;
    }
    },
    increaseQuantity() {
        this.quantityNew++;
    },
    formatCurrency(amount) {
            // Ubah angka menjadi format mata uang Rupiah
            const formatter = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            });
            return formatter.format(amount);
    },
    disableGroups(option) {
            const custom_options = option.menu_detail.map((menu_detail) => menu_detail.id);
            const selected = this.selectedCustom_options.filter((menu_detailId) => {
                return custom_options.includes(menu_detailId);
            });
            return selected.length >= option.max_pilih;
    },
    disabledBtnUpdate() {
        let cart_custom = this.selectedCart.custom_options;
        let selected = this.selectedCustom_options;
        let quantityEqual = this.quantityNew == this.selectedCart.quantity;
        let cekCatatan;
        if(this.selectedCart.catatan == ''){
            cekCatatan = this.catatan == '';
        }else{
            cekCatatan = this.catatan === this.selectedCart.catatan;
        }
       
        console.log(cekCatatan);
        // Mengurutkan kedua array sebelum membandingkannya
        let sortedCartCustom = cart_custom.slice().sort();
        let sortedSelected = selected.slice().sort();

        // Memeriksa apakah kedua array yang diurutkan adalah sama
        let areArraysEqual = sortedCartCustom.length === sortedSelected.length &&
                            sortedCartCustom.every((value, index) => value === sortedSelected[index]);
                            
        if (quantityEqual && areArraysEqual && cekCatatan) {
        console.log('Condition 1: Quantity and options are equal');
            return true;
        } else {
            return false;
        }
    },
    getMenuDetails(customId) {
        const customOptionsSearch = this.menu.custom_options;
                // Loop melalui custom_options dalam menu
        for (let option of customOptionsSearch) {
            const detail = option.menu_detail.find(detail => detail.id === customId);
                if (detail) {
                        return [detail]; // Kembalikan menu_detail yang ditemukan
                    }
                }
            return [];
    },
    async Menu() {
            try {
                const response = await api.get('menu/update/' + this.id);
                this.menu = response.data.menu;
                console.log(this.menu);
                let cartCustom = null;
                if(this.type == 'cart'){
                     cartCustom = this.cart[this.key];
                } else if (this.type == 'cart_2') {
                    cartCustom = this.cart_2[this.key];
                }
                this.selectedCart = cartCustom;
                for (let custom of cartCustom.custom_options) {
                    this.selectedCustom_options.push(custom);
                }
                this.catatan = this.selectedCart.catatan
                this.quantityNew = this.selectedCart.quantity
                this.isLoading = false;
            } catch (error) {
                console.log(error);
            }
    },
    updateCustom(key) {
      const cart = this.type === 'cart' ? this.cart : this.cart_2;
      const updateLocalStorage = this.type === 'cart' ? this.updateLocalStorage : this.updateLocalStorage_2;
    
      delete cart[key];
    
      if (!cart[key]) {
        const custom_optionsKey = this.selectedCustom_options.slice().sort().join(',');
        const cartKey = `${this.menu.id}-${custom_optionsKey}`;
        const itemToAdd = {
          ...this.menu,
          custom_options: this.selectedCustom_options.slice().sort(),
          catatan: this.catatan,
          quantity: this.quantityNew
        };
    
        if (!cart[cartKey]) {
          cart[cartKey] = itemToAdd;
        } else {
          cart[cartKey].quantity += this.quantityNew;
          if (this.catatan !== '') {
            cart[cartKey].catatan = this.catatan;
          }
        }
        updateLocalStorage();
      } else {
        console.error(`Failed to delete item with key: ${key}`);
      }
      this.$router.push('/chekout');
    },
    
    updateLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    updateLocalStorage_2() {
        localStorage.setItem('cart_2', JSON.stringify(this.cart_2));
    },  
    loadCartFromLocalStorage() {
            if(this.type == 'cart'){
                const cart = localStorage.getItem('cart');
                this.cart = JSON.parse(cart);
            }else if(this.type == 'cart_2'){
                const cart_2 = localStorage.getItem('cart_2');
                this.cart_2 = JSON.parse(cart_2);
            }
    },
    },
    
  mounted(){
    this.Menu();
    this.loadCartFromLocalStorage();
  }
}
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
    height: 110px;
    left: 0px;
    width: calc(100% + 0px);
}
</style>