<template>
    <v-layout style="height: 70px;"  >
      <v-bottom-navigation
        v-model="value"
        :color="color"
        mode="shift"
        grow
      >
        <v-btn to="/home">
            <font-awesome-icon icon="fa-solid fa-house" size="2x"/>
            <span>Home</span>
        </v-btn>
      
        <v-btn to="/food">
            <font-awesome-icon icon="fa-solid fa-utensils" size="2x"/>
  
          <span>Wi-Food</span>
        </v-btn>

        <v-btn to="/order">
            <font-awesome-icon icon="fa-solid fa-clipboard" size="2x"/>
  
          <span>Pesanan</span>
        </v-btn>
      </v-bottom-navigation>
    </v-layout>
  </template>

<script>
export default {
  data: () => ({ value: 1 }),

  computed: {
    color () {
      switch (this.value) {
        default: return 'deep-purple-darken-3'
      }
    },
  },
}
</script>