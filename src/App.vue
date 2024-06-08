<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import DimensiDevice from '@/components/DimensiDevice.vue';

// Ref untuk memantau kondisi visibilitas elemen
const isVisible = ref(false);

// Fungsi untuk mendeteksi perangkat desktop
const detectDevice = () => {
  const userAgent = navigator.userAgent;
  // console.log(userAgent);
  return !(/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);
};

// Fungsi untuk memperbarui visibilitas berdasarkan lebar layar dan jenis perangkat
const handleResize = () => {
  isVisible.value = detectDevice();
};

// Menambahkan event listener saat komponen dipasang
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize(); // Untuk memeriksa kondisi saat halaman dimuat
});

// Menghapus event listener saat komponen dilepas
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <main>
    <!-- <div v-if="isVisible" class="alert_device">
      <DimensiDevice />
    </div> -->
    <div v-if="!isVisible">
      <router-view/>
    </div>
  </main>
</template>

<style scoped>
</style>
