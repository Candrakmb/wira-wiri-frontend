<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import ProfilComponent from '@/components/profilComponent.vue';
</script>

<template>
    <div class="position-sticky">
        <a href="/">
            <v-card
            class="mx-auto"
            prepend-icon="mdi-arrow-left"
            title="Profilku"
        >
        <template v-slot:prepend>
            <v-icon size="x-large"></v-icon>
        </template>
        </v-card>
        </a>
    </div>
    <ProfilComponent />
</template>

<style scoped>
.position-sticky {
    position: -webkit-sticky; /* Untuk Safari */
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>

