<template>
  <v-sheet border="md" class="pa-6 mx-auto" height="100vh" v-if="!isLoading">
    <h4 class="text-h6 font-weight-bold mb-4">Pembayaran {{ order.invoice_number }}</h4>

    <v-row no-gutters>
        <v-col cols="7">
        <p>
            harga 
        </p>
        </v-col>
        <v-col cols="1">
            :
        </v-col>
        <v-col cols="4" class="text-end">
        <p>
            {{ formatCurrency(order.subtotal) }}
        </p>
        </v-col>
        <v-col cols="7">
        <p>
            biaya penanganan dan pengiriman 
        </p>
        </v-col>
        <v-col cols="1">
            :
        </v-col>
        <v-col cols="4" class="text-end">
        <p>
            {{ formatCurrency(order.ongkir) }}
        </p>
        </v-col>
        <v-divider></v-divider>
        <v-col cols="7">
        <p>
            total 
        </p>
        </v-col>
        <v-col cols="1">
            :
        </v-col>
        <v-col cols="4" class="text-end">
        <p>
            {{ formatCurrency(order.total_pay) }}
        </p>
        </v-col>
    </v-row>

   <v-btn
      class="text-none text-white mb-4"
      color="deep-purple-darken-3"
      size="x-large"
      variant="flat"
      @click="payMidtrans(order.snap_token)"
      block
    >
      Bayar
    </v-btn>
  </v-sheet>
</template>
<script>
import api from '@/api/axios'
export default {
  data() {
    return {
        order: null,
        isLoading: true,
    }
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
    async orderData(){
        this.isLoading = true;
        try {
            const response = await api.get('order/' + this.$route.params.id);
            this.order = response.data.order;
            console.log(response);
            this.payMidtrans(response.data.order.snap_token);
            this.isLoading = false;
        } catch (eror){
            console.log(eror);
            this.isLoading = false;
        }
    },
    payMidtrans(snap_token){
        console.log(snap_token);
        window.snap.pay(snap_token);
    }
  },
  mounted() {
    this.orderData();

    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    const scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;

    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
  },
  unmounted() {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const scriptTag = document.querySelector(`script[src="${midtransScriptUrl}"]`);

    if (scriptTag) {
      document.body.removeChild(scriptTag);
    }
  }

}
</script>
