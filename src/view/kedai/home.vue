<!-- eslint-disable vue/multi-word-component-names -->
<script>
import api from '@/api/axios'
import Navbar from '@/components/navbar.vue'
import formatCurrency from '@/mixins/formatCurrency'
import { activatedNotifikasi } from '@/pushNotifikasi';
export default {
  mixins: [formatCurrency],
  data() {
    return {
      StatusKedai: true,
      cardHeight: '100vh',
      isLoading: true,
      orderan: [],
      selectedCard: [],
      dialogMenu: false,
    }
  },
  components: {
    Navbar
  },
  watch: {
     StatusKedai(newValue) {
      if (newValue) {
            this.cardHeight = '150px';
            this.updateStatusKedai(1);
        } else {
            this.cardHeight = '100vh';
            this.updateStatusKedai(0);
        }
    }
  },
  methods: {
       async loadStatusKedai(){  
          const response = await api.get('profil/status');
          if(response.data.status == 0){
            this.StatusKedai = false;
          } else {
            this.StatusKedai = true;
          }
          console.log(response)
          this.loadOrderan();
          this.dataKedai();
         
       },
      async dataKedai(){
        const response = await api.get('user');
        console.log(response);
        if(response.data.success){
          this.listenOrderan(response.data.user.id);
          console.log()
          this.isLoading=false;
        }
      },
      async loadOrderan(){
          const response = await api.get('order/view/kedai');
          if(response.data.success){
            this.orderan = response.data;
          } else {
            console.log(response)
          }
          console.log(response);
      },
      async updateStatusKedai(status) {
            const formData = {
              status: status,
            };
            console.log(formData);
            try {
              const response = await api.post('profil/update/status', formData);
              console.log(response);
            } catch (error) {
              console.error('Error updating status:', error);
            }
      },
      openDialogMenu(id){
        this.selectedCard = id;
        this.dialogMenu = true;
      },
      closeDialogMenu(){
        this.selectedCard = null;
        this.dialogMenu = false;
      },
      listenOrderan(id){
        // eslint-disable-next-line no-undef
        Echo.private("notif_kedai." + id).listen("NotifyKedai", (data) => {
          this.loadOrderan();
      });
    },
  },
  mounted(){
    if(this.StatusKedai){
      this.cardHeight = '150px';
    } else {
      this.cardHeight = '100vh';
    }
    this.loadStatusKedai();
    activatedNotifikasi();
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
              v-model="StatusKedai"
              id="toggle"
              name="toggle"
              type="checkbox"
            />
          </label>
        </v-container>
      </v-card>
      <div v-if="StatusKedai && orderan.order.length == 0 " class="d-flex justify-center mt-15">
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
      <div v-if="StatusKedai && orderan.order.length != 0">
        <v-card v-for="order in orderan.order" :key="order.id" class="rounded-3 mx-2 my-4 elevation-3" @click="openDialogMenu(order.id)">
        <v-card-title>
            Orderan {{ order.invoice_number }}
        </v-card-title>
        <v-card-item class=" mx-3 my-3 px-8 rounded-3 elevation-3">
          <v-row no-gutters>
            <v-col cols="8" class="text-capitalize text-truncate font-weight-bold pt-3" style="max-width: 300px;">
              {{ order.pelanggan.user.name }}
            </v-col>
            <v-col cols="4" class="text-center">
              <v-avatar color="#00A9FF" size="50" >
                        <span class="text-h6">Cj</span>
              </v-avatar>
            </v-col>
          </v-row>
        </v-card-item>
       
      </v-card>
      </div>
    </v-main>
    <v-dialog
      v-model="dialogMenu"
      transition="dialog-bottom-transition"
      fullscreen
      
      >
      <v-card>
        <v-toolbar class="position-sticky top-0 bg-white elevation-3">
          <v-btn
            icon="mdi-close"
            @click="closeDialogMenu"
          ></v-btn>

          <v-toolbar-title>Rincian Pesanan</v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>
        <div v-for="order in orderan.order" :key="order.id">
          <v-card-item v-if="order.id == selectedCard" class="mx-3 my-3 px-8 rounded-3 elevation-3">
            <v-row>
              <v-col cols="12" class="d-flex justify-space-between pb-0"> 
                <p class="mb-1">Driver</p>
                <p class="mb-1 font-weight-bold">{{ order.driver.user.name}}</p>
              </v-col>
              <v-divider class="my-1"></v-divider>
              <v-col cols="12" class="d-flex justify-space-between pt-0">
                <p class="mb-1">pelanggan</p>
                <p class="mb-1 font-weight-bold">{{ order.pelanggan.user.name}}</p>
              </v-col>
            </v-row>
          </v-card-item>
        </div>
        <p class="mb-2 px-3 text-capitalize font-weight-bold">Ringkaan Pesanan</p>
        <div v-for="menu in orderan.selectedMenu" :key="menu.id">
            <v-card-item class="mx-3 my-3 px-8 rounded-3 elevation-3" v-if="selectedCard == menu.order_id">
              <v-row no-gutters>
                <v-col cols="6" class= "text-capitalize font-weight-bold">
                 {{ menu.qty }} X {{menu.menu}}
                </v-col>
                <v-col cols="6" class="text-end">
                  {{formatCurrency(menu.price)}}
                </v-col>
              </v-row>
              <v-col v-if="menu.ekstra.length > 0 || menu.catatan != null" cols="12">
                <v-sheet class="px-3 py-1" color="grey-lighten-3" rounded="1">
                  <div v-if="menu.ekstra.length > 0">
                    <div v-for="ekstra in menu.ekstra" :key="ekstra.id">- {{ekstra.nama_kategori}} : {{ekstra.nama_pilihan}}
                    </div>
                  </div>
                  <div v-if="menu.catatan != null"> 
                    catatan : {{menu.catatan}}
                  </div>
                </v-sheet>
              </v-col>
            </v-card-item>
        </div>
        <v-container class="pb-0 position-sticky bottom-0 bg-white" elevation="3">
          <v-btn 
              class="text-none rounded-3 mb-4"
              color="blue"
              size="x-large"
              variant="flat"
              block
              >
            selesai
          </v-btn>
        </v-container>
      </v-card>
      
    </v-dialog>
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
  content: 'Tutup';
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
  content: 'Buka';
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
