<!-- eslint-disable vue/multi-word-component-names -->
<script>
import Navbar from '@/components/navbar.vue'
import api from '@/api/axios.js'
import formatCurrency from '@/mixins/formatCurrency';
import createUpdate from '@/components/kedaiComponents/createUpdateMenu.vue';
import Swal from 'sweetalert2';

export default {
  mixins: [formatCurrency],
  watch: {
  },
  data() {
    return {
        menus: null,
        isLoading: true,
        user: null,
        resto: null,
        dialogCreate: false,
        tipe: null,
        data: null,
        
    }
  },
  components: {
    Navbar,
    createUpdate
  },
  methods: {
    async updateMenu(id){
        const response = await api.get('/menu/update/' + id);
        if(response.data.success){
            this.data = response.data.menu;
            this.tipe = 'update';
            this.openDialogCreate(this.tipe);
        }else{
            console.log(response.data);
        }
        
    },
    async getUser(){
        const response = await api.get('/user');
        this.user = response.data.user;
        console.log(this.user.kedai[0].id);
        this.getMenu(this.user.kedai[0].id);
    },
    async getMenu(id){
        const response = await api.get('/menu/kategori_menu/' + id);
        this.menus = response.data.menu;
        this.resto = response.data.kedai;
        console.log(this.menus);
        this.isLoading = false;
    },
    openDialogCreate(tipe){
        this.tipe =  tipe;
        this.dialogCreate = true;
    },
    async deleteMenu(id) {
        const result = await Swal.fire({
            title: "apakah anda yakin?",
            text: "menu yang sudah dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!"
        });

        if (result.isConfirmed) {
            try {
                const response = await api.delete('/menu/deleteform/' + id);
                if (response.data.success) {
                    await this.getMenu(this.user.kedai[0].id);
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: response.data.message,
                    });
                }
            } catch (error) {
                Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error,
                });
            }
        }
    },
  },
  mounted() {
    this.getUser();
  },
}
</script>

<template>
    <v-layout v-if="!isLoading">
        <v-app-bar :elevation="3">
        <v-app-bar-title>
            <div class="text-capitalize text-center">
                    Menu
            </div>
        </v-app-bar-title>
    </v-app-bar>
        <v-main color="surface-variant">
            <v-card v-if="resto && resto.user" class="mx-auto px-3 py-5" :elevation="0">
                <v-btn
                color="blue text-none"
                rounded="5"
                @click="openDialogCreate('create')"
                block>
                    Tambah Menu
                </v-btn>
            </v-card>
            <v-card v-for="(menuItems, kategori) in menus" :key="kategori">
                <v-card-title>{{ kategori }}
                    <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
                </v-card-title>
                <v-card-item v-for="menu in menuItems" :key="menu.id">
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
                        <v-col class="text-end pe-4" cols="6">
                            <v-btn class="me-2" color="blue" size="40" @click="updateMenu(menu.id)" rounded>
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn color="red" size="40" @click="deleteMenu(menu.id)" rounded>
                                <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider class="mt-2 mb-2 border-opacity-50"></v-divider>
                </v-card-item>
            </v-card>
        </v-main>
        <v-dialog
            v-model="dialogCreate"
            transition="dialog-bottom-transition"
            fullscreen
        >
        <v-card>
        <v-toolbar class="posi">
          <v-btn
            icon="mdi-close"
            @click="dialogCreate = false"
          ></v-btn>

          <v-toolbar-title>Menambahkan Menu</v-toolbar-title>

        </v-toolbar>
        <v-container>
            <createUpdate :tipe="tipe" :data="data" />
        </v-container>
        
        </v-card>
        </v-dialog>
    </v-layout>
  <Navbar />
</template>

<style>
/* .swal2-container {
  z-index: 100000;
} */
</style>