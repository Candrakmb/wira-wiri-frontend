<template>
  <v-container class="p-4 mt-12" justify="center">
    <p class="text-h5 font-weight-bold">Welcome Back &#128075;</p>
    <p class="text-caption">Sign in to your account</p>
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
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        @click:append-inner="visible = !visible"
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
import {mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      emailRules: [
        value => !!value || 'E-mail is required.',
        value => /.+@.+\..+/.test(value) || 'E-mail must be valid.'
      ],
      password: '',
      passwordRules: [
        value => !!value || 'Password is required.',
      ],
      isLoading: false, 
      errorMessage: '', 
      visible: false,
    };
  },
  methods: {
    ...mapActions(['login']),
    async submitForm() {
      
      this.isLoading = true; 
      this.errorMessage = ''; 

      try {
        await this.login({ email: this.email, password: this.password });
        this.isLoading = false; 
        this.$router.push('/');
      } catch (error) {
        console.error('Error occurred:', error); 
        this.errorMessage = 'password atau email salah';
        this.isLoading = false; 
      }
    }
  }
};
</script>
