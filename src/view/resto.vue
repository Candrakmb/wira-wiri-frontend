<script setup>
import Navbar from '@/components/navbar.vue';
import Header from '@/components/header.vue';
import ListResto from '@/components/listResto.vue'
</script>

<template>
    <div class="position-sticky">
        <Header />
      </div>
    <ListResto />
    <Navbar />
</template>

<style scoped>
.position-sticky {
    position: -webkit-sticky; /* Untuk Safari */
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>

