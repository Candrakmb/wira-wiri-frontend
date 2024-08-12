<script setup>
import EditProfil from "@/components/editProfil.vue"
</script>
<template>
    <v-card
        class="mx-auto"
        elevation="0"
    >
   
    <v-card-actions v-if="!loading">
      <v-list-item class="w-100">
        <template v-slot:prepend>
          <v-avatar
            color="grey-darken-3"
            image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-avatar>
        </template>

        <v-list-item-title class="font-weight-bold text-capitals">{{ this.user.name }}</v-list-item-title>

        <v-list-item-subtitle>{{ this.user.email }}</v-list-item-subtitle>
        <v-list-item-subtitle>{{ this.pelanggan.no_whatsapp}}</v-list-item-subtitle>
        <template v-slot:append>
          <div class="justify-self-end">
            <v-icon class="me-1" icon="mdi-pencil" @click="edit = true"></v-icon>
          </div>
        </template>
      </v-list-item>
    </v-card-actions>
  </v-card>
  <v-card
    class="mx-auto"
    elevation="0"
    title = "akun"
  >
  <v-list >
    <v-list-item
        append-icon="mdi-chevron-right"
        prepend-icon="mdi-list-box"
        title="Pesanan"
      ></v-list-item>
    <v-divider inset></v-divider>
    <a href="/alamat">
        <v-list-item
        append-icon="mdi-chevron-right"
        prepend-icon="mdi-map-marker"
        title="Alamat"
      ></v-list-item>
    </a>
    <v-divider inset></v-divider>
    <v-list-item
        append-icon="mdi-chevron-right"
        prepend-icon="mdi-logout"
        title="Keluar"
        @click="handleLogout"
      ></v-list-item>
    <v-divider inset></v-divider>
  </v-list>
  </v-card>
    <v-dialog
      v-model="edit"
      fullscreen
      >
        <v-card
        >
        <v-toolbar flat>
            <v-toolbar-title>User Profile</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="edit = false">
            <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <EditProfil/>
        </v-card>
    </v-dialog>
</template>
<script>
import api from '@/api/axios.js';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      user :'',
      pelanggan: '',
      role : '',
      loading : true,
      edit : false
    };
  },
  methods: {
    async getUser() {
      try {
        const response = await api.get('user');
        this.user = response.data.user;
        this.pelanggan = response.data.user.pelanggan[0];
        this.role = response.data.role;
        console.log(this.pelanggan);
        this.loading = false;
      } catch (error) {
        console.error('Error fetching restaurant list:', error);
      }
    },
    ...mapActions(['logout']),
      async handleLogout() { 
        try {
          await api.post('/logout', {}, { headers: { 'x-skip-refresh': 'true' } });
          await this.$store.dispatch('logout');
          this.$router.push('/login'); 
        } catch (error) {
          this.errorMessage = error; 
        }
      }
  },
  mounted() {
    this.getUser();
  },
  
};

</script>