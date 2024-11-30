<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import DimensiDevice from '@/components/DimensiDevice.vue';
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import store from './store';

window.Pusher = Pusher;
const  token = store.getters.token;
window.Echo = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
    enabledTransports: ["ws", "wss"],
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    authEndpoint: import.meta.env.VITE_BASE_URL + "/broadcasting/auth",
 });

const isVisible = ref(false);
const installDialog = ref(false);
let deferredPrompt;

const detectDevice = () => {
  const userAgent = navigator.userAgent;
  return !(/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);
};

const handleResize = () => {
  isVisible.value = detectDevice();
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installDialog.value = true;
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const installApp = () => {
  installDialog.value = false;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    deferredPrompt = null;
  });
};
</script>

<template>
  <main>
    <!-- <v-dialog v-model="installDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Install App</v-card-title>
        <v-card-text>
          Install our app for a better experience.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="installApp">Install</v-btn>
          <v-btn text @click="installDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <div v-if="!isVisible">
      <router-view/>
    </div>
  </main>
</template>

<style>
  a {
        text-decoration: none;
        color: inherit;
    }
</style>
