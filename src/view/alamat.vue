<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="position-sticky">
      <v-card class="mx-auto" height="50px">
        <v-row>
            <v-col cols="6">
                <v-btn
                    class="mt-2 text-capitalize"
                    prepend-icon="mdi-arrow-left"
                    variant="text"
                    to ="/profil"
                >
                    Alamat
                </v-btn>
            </v-col>
            <v-col class="text-end" cols="6">
                <v-btn
                    class="mt-2 text-capitalize"
                    variant="text"
                    color="deep-purple-darken-3"
                    to="/alamat/create"
                >
                    Tambah baru
                </v-btn>
            </v-col>
        </v-row>
      </v-card>
  </div>
  <v-row v-if="alamatsNull" class="mx-2 mt-2">
    <v-col cols="12" class="text-center">Alamat masih kosong</v-col>
  </v-row>
  <v-row v-if="!alamatsNull" class="mx-2 mt-2">
    <v-col v-for="alamat in alamats" :key="alamat.id" cols="12">
        <v-card
        class="mx-auto"
        >
        <v-toolbar flat>
            <v-toolbar-title class="ms-2"><v-icon>mdi-map-marker</v-icon> {{alamat.tipe_alamat}}</v-toolbar-title>
            <v-spacer></v-spacer>
            
            <v-speed-dial
            location="bottom center"
            transition="scale-transition"
            >
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn icon v-bind="activatorProps">
                <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </template>
            <v-btn :key="alamat.id" icon :to="`/alamat/${alamat.id}`">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn key="2" icon @click="deleteAlamat(alamat.id)">
                <v-icon>mdi-trash-can</v-icon>
            </v-btn>
            </v-speed-dial>
        </v-toolbar>

        <v-card-text class="pt-4">
        {{alamat.alamat}}
        </v-card-text>
        <div class="px-4 mb-2">
        <v-chip-group selected-class="bg-deep-purple-lighten-2">
            <v-chip>{{alamat.detail_alamat}}</v-chip>
        </v-chip-group>
        </div>
        </v-card>
    </v-col>
  </v-row>
  
</template>
<script>
import api from '@/api/axios.js';
import Swal from 'sweetalert2';
export default {
  data() {
    return {
      alamats: null,
      alamatsNull : true,
      loading: true,
      editAlamat: false,
      createAlamat: false,
    }
  },
  methods: {
    async getAlamat() {
      try{
        const response = await api.get('profil/alamat');
        this.alamats = response.data.alamat;
        if(this.alamats.length == 0){
          this.alamatsNull = true;
        } else {
          this.alamatsNull = false;
        }
      } catch(error){
        console.log(error)
      }
    },
    async deleteAlamat(id) {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
          await api.delete(`profil/delete/alamat/${id}`);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          }).then(() => {
            window.location.reload()
          });
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        Swal.fire({
          title: "Error!",
          text: "There was an error deleting your address.",
          icon: "error"
        });
      }
    }

  },
  mounted(){
    this.getAlamat();
  }
}
</script>

<style scoped>
.position-sticky {
  position: -webkit-sticky; /* Untuk Safari */
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>
