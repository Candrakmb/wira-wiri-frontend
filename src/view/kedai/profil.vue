<!-- eslint-disable vue/multi-word-component-names -->
<script>
import Navbar from '@/components/navbar.vue'
import api from '@/api/axios.js'
import { mapActions } from 'vuex'
import { unSubscribe } from '@/pushNotifikasi'

export default {
  data() {
    return {
        dataUser : null,
        isLoading: true,
    }
  },
  components: {
    Navbar
  },
  methods: {
    ...mapActions(['logout']),
    async dataProfil() {
      const response = await api.get('/user')
        console.log(response.data)
      if (response.data.success) {
        this.dataUser = response.data.user
      } else {
        console.log(response.data)
      }
      this.isLoading = false;
    },
    async handleLogout() {
      // Mengganti nama metode di komponen
      try {
        await unSubscribe()
        console.log('Unsubscribe berhasil')
        // Menambahkan flag khusus untuk request logout
        const response = await api.post('/logout', {}, { headers: { 'x-skip-refresh': 'true' } })
        console.log(response.data)
        // Panggil Vuex action logout
        await this.$store.dispatch('logout')

        // Navigasi ke halaman login
        this.$router.push('/login')
      } catch (error) {
        this.errorMessage = error // Pesan error default
      }
    }
  },
  mounted() {
    this.dataProfil()
  }
}
</script>
<template>
  <v-layout v-if="!isLoading">
    <v-app-bar class="d-flex align-center justify-center">
      <p class="mx-auto mt-3 text-h5 font-weight-bold">Profil</p>
    </v-app-bar>
    <v-main>
      <v-card class="mt-4 elevation-0">
        <v-row>
          <v-col cols="12" class="text-center mb-2">
            <v-fab
              class="ms-15 mt-5"
              icon="mdi-pencil"
              location="bottom center"
              size="small"
              to="/edit/profil"
              absolute
              offset
            ></v-fab>
            <v-avatar color="#00A9FF" size="100">
              <v-img :src="dataUser.kedai[0].img_url" cover></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="12">
            <v-container class="px-11 py-1">
              <v-row no-gutters>
                <v-col cols="12"> Nama </v-col>
                <v-col
                  class="text-h6 font-weight-bold d-inline-block text-truncate text-capitalize"
                  cols="12"
                  style="max-width: 300px"
                >
                    {{ dataUser.name }}
                </v-col>
              </v-row>
              <v-divider class="my-1"></v-divider>
            </v-container>
            <v-container class="px-11 py-1">
              <v-row no-gutters>
                <v-col cols="12"> Email </v-col>
                <v-col
                  class="text-h6 font-weight-bold d-inline-block text-truncate"
                  cols="12"
                  style="max-width: 300px"
                >
                  {{ dataUser.email }}
                </v-col>
              </v-row>
              <v-divider class="my-1"></v-divider>
            </v-container>
            <v-container class="px-11 py-1">
              <v-row no-gutters>
                <v-col cols="12"> Whatsapp </v-col>
                <v-col
                  class="text-h6 font-weight-bold d-inline-block text-truncate"
                  cols="12"
                  style="max-width: 300px"
                >
                 {{ dataUser.kedai[0].no_whatsapp  }}
                </v-col>
              </v-row>
              <v-divider class="my-1"></v-divider>
            </v-container>
            <v-container class="px-11 py-1">
              <v-row no-gutters>
                <v-col cols="12"> Alamat </v-col>
                <v-col
                  class="text-h6 font-weight-bold d-inline-block text-truncate"
                  cols="12"
                  style="max-width: 300px"
                >
                {{ dataUser.kedai[0].alamat  }}
                </v-col>
              </v-row>
              <v-divider class="my-1"></v-divider>
            </v-container>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="elevation-0 px-9 my-4">
        <v-card-actions>
          <v-row>
            <v-col cols="12">
              <v-btn
                append-icon="mdi-chevron-right"
                color="#00A9FF"
                text="Keluar"
                variant="outlined"
                block
                @click="handleLogout"
              ></v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-main>
  </v-layout>
  <Navbar />
</template>
