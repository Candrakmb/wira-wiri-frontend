<template>
    <v-container class="p-4" justify="center">
      <p class="text-h5 font-weight-bold">Sign Up</p>
      <p class="text-caption">Create account and choose favorite menu</p>
      <v-form @submit.prevent="submitForm">
        <v-text-field
          v-model="name"
          :rules="namaRules"
          label="Nama Lengkap"
        ></v-text-field>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
        ></v-text-field>
        <v-text-field
          v-model="no_whatsapp"
          :rules="NomerRules"
          label="Nomer WhatsApp"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          type="password"
        ></v-text-field>
        <v-text-field
          v-model="password_confirmasi"
          :rules="confirRules"
          label="Konfirmasi Password"
          type="password"
        ></v-text-field>
        <v-btn
          color="deep-purple-darken-3"
          variant="elevated"
          class="mt-2 text-capitalize"
          type="submit"
          size="x-large"
          block
          rounded="lg"
          :disabled="isLoading"
        >
          <template v-if="!isLoading">Sign Up</template>
          <template v-else>
            <v-progress-circular indeterminate color="white" size="24"></v-progress-circular>
          </template>
        </v-btn>
      </v-form>
      <p class="text-center mt-3">Have an account? <a class="text-decoration-none" href="/login">Sign In</a></p>
    </v-container>
  </template>
  
  <script>
    import Swal from 'sweetalert2';
    import axios from 'axios';
  
    export default {
      data: () => ({
        name: '',
        namaRules: [
          value => !!value || 'Nama Lengkap is required.',
        ],
        email: '',
        emailRules: [
          value => !!value || 'E-mail is required.',
          value => /.+@.+\..+/.test(value) || 'E-mail must be valid.'
        ],
        no_whatsapp: '+62',
        NomerRules: [
          value => !!value || 'Nomer WhatsApp is required.',
          value => /^\+62\d{8,12}$/.test(value) || 'Nomor telepon harus valid dan dalam format +628XXXXXXXXX.'
        ],
        password: '',
        passwordRules: [
          value => !!value || 'Password is required.',
        ],
        password_confirmasi: '',
        confirRules: [
          value => !!value || 'Konfirmasi Password is required.',
        ],
        isLoading: false, // State untuk indikator loading
      }),
      methods: {
        async submitForm() {
          // Simple validation to ensure password and confirm password match
          if (this.password !== this.password_confirmasi) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Password and Konfirmasi Password do not match.',
            });
            return;
          }
  
          const formData = {
            name: this.name,
            email: this.email,
            no_whatsapp: this.no_whatsapp,
            password: this.password,
            password_confirmation: this.password_confirmasi,
          };
  
          this.isLoading = true; // Set isLoading ke true saat pengiriman dimulai
          try {
             await axios.post('http://127.0.0.1:8000/api/register', formData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Registration successful.',
              }).then(() => {
                this.isLoading = false; // Set isLoading ke false saat selesai
                this.$router.push('/login');
              });
          } catch(error){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Registration failed.',
              });
              this.isLoading = false; // Set isLoading ke false saat selesai
              console.error(error);
          }
      }
    }
  }
  </script>
  