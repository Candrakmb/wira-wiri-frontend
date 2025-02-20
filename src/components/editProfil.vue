<template>
        <v-form
            v-model="form"
            @submit.prevent="onSubmit"
        >
        <v-card-text>
           
          <v-row dense>
            <v-col
              cols="12"
              md="4"
              sm="6"
              v-if = "success"
            >
            <v-alert
            color="success"
            icon="$success"
            title="update berhasil"
            ></v-alert> 
            </v-col>
            <v-col cols="12" class="text-center mb-3">
                        <h4>Preview</h4>
                        <v-avatar
                            color="grey"
                            size="100"
                        >
                            <v-img :src="imageUrl" cover></v-img>
                        </v-avatar>
                    </v-col>
            <v-col cols="12">
                <v-file-input
                    v-model="profil"
                    :rules="imageRule"
                    accept="image/png, image/jpeg, image/bmp"
                    label="Profil"
                    placeholder="Pilih gambar menu"
                    prepend-icon="mdi-camera"
                    density="compact"
                    variant="outlined"
                    @change="onFileChange"
                    rounded
                    show-size
                ></v-file-input>
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="6"
            >
                <v-text-field
                    v-model="name"
                    :rules="[required]"
                    :readonly="loading"
                    label="Nama"
                    clearable
                ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="4"
              sm="6"
            >
                <v-text-field
                    v-model="no_whatsapp"
                    :rules="[required]"
                    :readonly="loading"
                    label="Nomor HP"
                    clearable
                ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="4"
              sm="6"
            >
                <v-text-field
                    v-model="email"
                    :rules="[required]"
                    :readonly="loading"
                    label="Email"
                    clearable
                ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!form"
            :loading="loading"
            color="deep-purple-darken-3"
            text="Save"
            variant="flat"
            type="submit"
            block
          ></v-btn>
          <v-spacer></v-spacer>
         
        </v-card-actions>
        <div class="text-center">
          
        </div>
       
        </v-form>
</template>
<script>
import api from '@/api/axios.js';

export default {
  data() {
    return {
      imageRule: [(value) => {
                    return !value || !value.length || value[0].size < 2000000 || 'Gambar melebihi batas maksimum 2 mb!'
                    }],
      form : true,
      user :null,
      pelanggan:null,
      role :null,
      loading : false,
      name : null,
      email: null,
      no_whatsapp: null,
      profil: null,
      edit : false,
      success: false,
      imageUrl: '',

    };
  },
  methods: {
    async getUser() {
      try {
        const response = await api.get('user');
        this.user = response.data.user;
        this.pelanggan = response.data.user.pelanggan[0];
        this.role = response.data.role;
        this.name = this.user.name;
        this.email = this.user.email;
        this.no_whatsapp = this.pelanggan.no_whatsapp;
        this.imageUrl = this.pelanggan.img_url;
        this.loading = false;
      } catch (error) {
        console.error('Error fetching restaurant list:', error);
      }
    },
    async onSubmit () {
        if (!this.form) return
        const formData = {
            name: this.name,
            email: this.email,
            no_whatsapp: this.no_whatsapp,
            profil: this.profil,
        };
        this.loading = true
        try{
            const response = await api.post('profil/update', formData,{
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if(response.data.success){
              console.log(response);
              this.loading = false;
              this.success = true;
              setTimeout(() => ( window.location.reload()), 2000)
            } else {
              console.log(response);
              this.loading = false;
            }
            
        }catch (error){
            console.error('Error updating profile', error);
            this.loading = false;
        }
    },
    createImage(file) {
      if (!(file instanceof Blob || file instanceof File)) {
        console.error('Parameter is not a Blob or File');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target.result; // Menyimpan URL gambar setelah file dibaca
      };
      reader.readAsDataURL(file); // Membaca file sebagai URL Data
    },
    onFileChange(event) {
      const file = event.target.files[0]; // Mendapatkan file dari event input

      if (!file) {
        return; // Jika tidak ada file yang dipilih
      }

      this.createImage(file); // Mengirim file untuk diproses
    },
    required (v) {
        return !!v || 'Field is required'
    },
  },
  mounted() {
    this.getUser();
  },
  
};

</script>