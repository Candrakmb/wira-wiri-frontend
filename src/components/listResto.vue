<template>
  <v-infinite-scroll
    :height="infiniteScrollHeight"
    @load="load"
  >
    <!-- Menampilkan daftar restoran -->
    <template v-for="resto in listResto" :key="resto.id">
      <v-container class="pb-0 pt-1" no-gutter>
        <v-row dense>
          <v-col cols="12">
            <v-card variant="text">
              <div class="d-flex flex-no-wrap">
                <v-avatar class="ma-1" rounded="0" size="120">
                  <!-- Gambar restoran -->
                  <v-img :src="resto.img"></v-img>
                </v-avatar>
                <div>
                  <v-card-title class="text-h6 pb-0">
                    {{ resto.user.name }}
                  </v-card-title>
                  <v-card-subtitle>{{ resto.distance }} km</v-card-subtitle>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-divider class="mt-2"></v-divider>
    </template>

    <!-- Pesan jika tidak ada item lagi -->
    <template v-slot:empty>
      <v-alert type="warning">No more items!</v-alert>
    </template>
  </v-infinite-scroll>
</template>

<script>
import api from '@/api/axios.js'; // Import instance Axios yang telah dikonfigurasi

export default {
  data() {
    return {
      infiniteScrollHeight: '0px',
      listResto: [], // Menyimpan list restoran dari server
      latitude: '', // Variabel untuk menyimpan latitude pengguna
      longitude: '', // Variabel untuk menyimpan longitude pengguna
    };
  },
  methods: {
    async load({ done }) {
      try {
        // Panggil metode untuk mendapatkan list restoran
        await this.getListOfResto();
        done('empty'); // Penting: Panggil done() untuk menandakan bahwa operasi loading selesai
      } catch (error) {
        console.error('Error fetching data:', error);
        done('empty'); // Pastikan done() dipanggil, meskipun ada kesalahan
      }
    },
    async getListOfResto() {
      // Panggil API untuk mendapatkan list restoran berdasarkan lokasi
      const formData = {
        latitude: this.latitude, // Gunakan latitude yang sudah didapat
        longitude: this.longitude, // Gunakan longitude yang sudah didapat
        search: '', // Misalnya parameter pencarian, bisa dikosongkan atau diisi sesuai kebutuhan
      };

      try {
        const response = await api.post('/menu/kedai', formData);
        this.listResto = response.data.kedai; // Mengupdate data list restoran dari response server
      } catch (error) {
        console.error('Error fetching restaurant list:', error);
        // Tampilkan pesan kesalahan atau lakukan penanganan kesalahan lainnya
      }
    },
    updateInfiniteScrollHeight() {
      // Menghitung tinggi layar untuk infinite scroll
      const screenHeight = window.innerHeight;
      this.infiniteScrollHeight = `${Math.floor(screenHeight / 100) * 100}px`;
    },
  },
  mounted() {
    // Mendapatkan lokasi pengguna saat komponen dimuat
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        // Memanggil fungsi untuk mendapatkan list restoran
        this.getListOfResto();
      }, error => {
        console.error('Error getting location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    // Update tinggi infinite scroll saat komponen dimuat
    this.updateInfiniteScrollHeight();
    window.addEventListener('resize', this.updateInfiniteScrollHeight);
  },
  beforeDestroy() {
    // Membersihkan event listener saat komponen dihancurkan
    window.removeEventListener('resize', this.updateInfiniteScrollHeight);
  },
};
</script>

<style scoped>
/* Styling khusus untuk komponen ini bisa ditambahkan di sini */
</style>
