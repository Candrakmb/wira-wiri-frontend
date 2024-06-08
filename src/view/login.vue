<template>
  <v-container class="p-4 mt-12" justify="center">
    <p class="text-h5 font-weight-bold">Welcome Back &#128075;</p>
    <p class="text-caption">Sign in your account</p>
    <v-form @submit.prevent="submitForm">
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="Email"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Password"
        class="mt-2"
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
        <template v-if="!isLoading">Sign In</template>
        <template v-else>
          <v-progress-circular indeterminate color="white" size="24"></v-progress-circular>
        </template>
      </v-btn>
      <v-alert v-if="errorMessage" type="error" class="mt-3" dismissible>
        {{ errorMessage }}
      </v-alert>
    </v-form>
    <p class="text-center mt-3">Don't have an account? <a class="text-decoration-none" href="/signup">Sign Up</a></p>
  </v-container>
</template>

<script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  export default {
    data: () => ({
      email: '',
      emailRules: [
        value => !!value || 'E-mail is required.',
        value => /.+@.+\..+/.test(value) || 'E-mail must be valid.'
      ],
      password: '',
      passwordRules: [
        value => {
          if (value) return true;
          return 'Password is required.';
        },
      ],
      isLoading: false, // State untuk indikator loading
      errorMessage: '', // State untuk menyimpan pesan error
    }),
    methods: {
      submitForm() {
        const formData = {
          email: this.email,
          password: this.password,
        };

        this.isLoading = true; // Set isLoading ke true saat pengiriman dimulai
        this.errorMessage = ''; // Reset pesan error sebelum pengiriman

        axios.post('http://127.0.0.1:8000/api/login', formData)
          .then(response => {
              this.isLoading = false;
              window.location.href = '/signup'; 
          })
          .catch(error => {
            // Handle error response
            this.isLoading = false; // Set isLoading ke false saat selesai
            this.errorMessage = 'Email Atau password salah';
          });
      }
    }
  }
</script>
