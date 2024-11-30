<!-- eslint-disable vue/multi-word-component-names -->
<script>
import { ref, watch } from 'vue';
import Navbar from '@/components/navbar.vue';
import { VDateInput } from 'vuetify/labs/VDateInput'
import { activatedNotifikasi, activatedLocation } from '@/pushNotifikasi';
import api from '@/api/axios.js';
import formatCurrency from '@/mixins/formatCurrency';
  
export default {

  mixins: [formatCurrency],
  data () {
    return {
      search: '',
      isLoading: true,
      dataOrder: null,
      startDate: null,
      endDate: null,
      rangeDate: null,
        headers: [
          {
            align: 'start',
            key: 'invoice_number',
            sortable: false,
            title: 'Invoice',
          },
          { key: 'nama_pelangggan', title: 'Pelanggan' },
          { key: 'metode_pembayaran', title: 'Pembayaran' },
          { key: 'ongkir', title: 'Ongkir' },
          { key: 'total', title: 'Total' },
        ],
        dataTableOrder: [],
        
    }
  },
  components: {
    Navbar,
    VDateInput,
  },
  watch: {
    rangeDate(newValue) {
      const start = newValue[0];
      const end = newValue[newValue.length-1];

        // Mengubah format tanggal ke 'D MMMM YYYY' (contoh: 25 November 2024)
        this.startDate = start.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        this.endDate = end.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      // Panggil API setiap kali rangeDate berubah
      this.getDataIncome(newValue[0], newValue[newValue.length-1]);
    },
  },
  methods: {
    async getDataIncome(startDate,endDate){
      console.log(startDate,endDate)
      try{
        const response = await api.get('/income', {
          params: {
            startDate: startDate,
            endDate: endDate
          }
        })
        console.log(response.data);
        this.isLoading = false;
        if(response.data.success){
          this.dataOrder = response.data;
          if(!startDate || !endDate){
            const start = new Date(response.data.startDate);
            const end = new Date(response.data.endDate);

            // Mengubah format tanggal ke 'D MMMM YYYY' (contoh: 25 November 2024)
            this.startDate = start.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            this.endDate = end.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
          }

            for(let order of this.dataOrder.order){
              const pembayaran = order.metode_pembayaran == 0 ? 'Tunai' : 'Non-tunai';
              this.dataTableOrder.push({
                invoice_number: order.invoice_number,
                nama_pelangggan: order.pelanggan.user.name,
                metode_pembayaran: pembayaran,
                ongkir: this.formatCurrency(order.ongkir),
                total: this.formatCurrency(order.total_pay)
              })
            }
          
          console.log(response.data);
        } else {
          console.log(response.data);
        }
      } catch (error){
        console.log(error)
      }
    }
  },

  mounted(){
    this.getDataIncome();
    activatedNotifikasi();
    activatedLocation();
  }
};
</script>
<template>
     <v-layout v-if="!isLoading">
        <v-app-bar class="d-flex align-center justify-center">
            <p class="mx-auto mt-3 text-h5 font-weight-bold">Home</p>
        </v-app-bar>


        <v-main>
            <v-card class="mx-4 mt-2" title="">
                <v-card-item align="center">
                        <div class="d-flex justify-center">
                            <v-date-input
                            v-model="rangeDate"
                            label="Select range"
                            max-width="368"
                            multiple="range"
                            ></v-date-input>
                        </div>
                </v-card-item>
            </v-card>
            <v-card
                class="mx-4 my-3"
            >
            <v-card-item title="Pendapatan">
            <template v-slot:subtitle>
                <v-icon
                class="me-1 pb-1"
                color="warning"
                icon="mdi-information-outline"
                size="18"
                ></v-icon>
                Pendapatan selama sebulan
            </template>
            </v-card-item>

            <v-card-text class="py-0">
            <v-row align="center" no-gutters>
                <v-col
                class="text-h4"
                cols="12"
                >
                {{ formatCurrency(dataOrder.total_pendapatan) }}
                </v-col>
            </v-row>
            </v-card-text>

            <div class="d-flex py-3">
            <v-list-item
                density="compact"
                prepend-icon="mdi-calendar-month"
            >
                <v-list-item-subtitle>{{startDate }} - {{endDate}}</v-list-item-subtitle>
            </v-list-item>
            </div>
        </v-card>
        <v-card
                class="mx-4"
            >
            <v-card-item title="Setor">
            <template v-slot:subtitle>
                <v-icon
                class="me-1 pb-1"
                color="warning"
                icon="mdi-information-outline"
                size="18"
                ></v-icon>
                Jumlah Uang Yang harus disetor ke admin
            </template>
            </v-card-item>

            <v-card-text class="py-0">
            <v-row align="center" no-gutters>
                <v-col
                class="text-h4"
                cols="12"
                >
                {{ formatCurrency(dataOrder.total_setor) }}
                </v-col>
            </v-row>
            </v-card-text>

            <div class="d-flex py-3">
            <v-list-item
                density="compact"
                prepend-icon="mdi-calendar-month"
            >
                <v-list-item-subtitle>{{startDate }} - {{endDate}}</v-list-item-subtitle>
            </v-list-item>
            </div>
        </v-card>
        
          <v-card
            class="mx-4 my-3" title="Rincian orderan"
            flat
          >
            <template v-slot:text>
              <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
              ></v-text-field>
            </template>

            <v-data-table
              :headers="headers"
              :items="dataTableOrder"
              :search="search"
            ></v-data-table>
          </v-card>
        </v-main>
    </v-layout>
    <Navbar />
</template>

