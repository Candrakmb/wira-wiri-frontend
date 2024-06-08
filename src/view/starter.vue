<template>
    <v-container class="text-center mt-2">
      <v-row justify="center">
        <v-col cols="2 p-0">
            <v-img :width="50"  :src="'./icons/icon-512x512.png'"
            ></v-img>
        </v-col>
        <v-col cols="5 p-0 mt-4">
            <p class="text-deep-purple-darken-3 font-weight-bold">Wira Wiri Indonesia</p>
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <v-carousel
            :height="carouselHeight"
            cycle
            :show-arrows="false"
            hide-delimiters
          >
            <v-carousel-item
              v-for="(slide, i) in slides"
              :key="i"
            >
              <v-sheet height="100%">
                <div class="row fill-height justify-center align-center">
                <div cols="12">
                    <v-img
                    :width="'100%'" 
                    :src="slide"
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
                </div>
                <div cols="12 mt-0">
                    <p class="text-h6 font-weight-bold">
                     {{ title[i] }}
                    </p>
                    <p class="text-disabled">
                    {{ deskripsi[i] }}
                    </p>
                </div>
                
                </div>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-col>
        <v-col cols="12 ">
          <RouterLink to="/signup">
            <v-btn color="deep-purple-darken-3" variant="elevated" rounded="lg" size="x-large" block>Get Started</v-btn>
          </RouterLink>
        </v-col>
        <v-col cols="12 " md="4" sm="6">
          <RouterLink to="/login">
            <v-btn color="deep-purple-darken-3" variant="tonal" rounded="lg" size="x-large" block>Sign In</v-btn>
          </RouterLink>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import addressImg from '@/assets/starter_img/adress.png';
  import otwImg from '@/assets/starter_img/otw.png';
  import orderImg from '@/assets/starter_img/order.png';
  
  // Define slides
  const slides = ref([
    orderImg,
    otwImg,
    addressImg,
   
  ]);

  const title = ([
    'Pesan Mudah',
    'OTW Cepat',
    'Sampai cepat'
  ]);

  const deskripsi = ([
    'pesan dari rumah pilihan menu lengkap dan  pesan lebih dari satu tempat',
    'diantar driver wira wiri indonesia pastinya cepat',
    'sampai tujuan sesuai lokasi yang tertera'
  ]);
  
  // Define carousel height
  const carouselHeight = ref('700px');
  
  // Update carousel height based on window size
  const updateCarouselHeight = () => {
    if (window.innerWidth < 400) {
      carouselHeight.value = '400px';
    } else {
      carouselHeight.value = '600px';
    }
  };
  
  // Add event listener to update height on window resize
  onMounted(() => {
    updateCarouselHeight();
    window.addEventListener('resize', updateCarouselHeight);
  });
  </script>
  
  