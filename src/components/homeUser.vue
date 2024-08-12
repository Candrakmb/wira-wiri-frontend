<template>
<v-container class="p-3">
    <v-row>
        <v-col cols="12">
            <v-card class="p-1" color="deep-purple-darken-3" rounded="4" elevation="5">
                <div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                        <v-card-title class="text-body-1 pt-2 pb-0">
                            Delivery To
                        </v-card-title>
                        <v-card-subtitle class="pt-0 pb-0">basuki rahmad gg aspol</v-card-subtitle>
                        <v-card-actions>
                            <v-btn class="ms-2 p-1 text-capitalize" size="small" text="Rumah" rounded="2" variant="flat"></v-btn>
                        </v-card-actions>
                    </div>
                    <v-avatar class="me-2" rounded="0" size="50">
                        <!-- <v-icon icon="$mdiGoogleMaps"></v-icon> -->
                        <v-icon aria-hidden="false" color="white" size="x-large">
                            mdi-google-maps
                        </v-icon>
                    </v-avatar>
                </div>
            </v-card>
        </v-col>
        <v-col cols="12" class="pt-1">
            <v-card class="p-2" color="deep-purple-lighten-4" rounded="2" elevation="5">
                <div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                        <v-card-title class="text-h6 pb-0">
                            Halcyon Days
                        </v-card-title>
                        <v-card-subtitle class="">Ellie Goulding</v-card-subtitle>
                        <v-card-actions>
                            <v-btn class="ms-1 text-capitalize" size="small" text="Order Now" variant="flat" color="deep-purple-darken-3" rounded="3" width="100" height="30"></v-btn>
                        </v-card-actions>
                    </div>
                    <v-avatar class="ma-3" rounded="0" size="90">
                        <!-- <v-icon icon="$mdiGoogleMaps"></v-icon> -->
                        <v-img src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"></v-img>
                    </v-avatar>
                </div>
            </v-card>
        </v-col>
        <v-col cols="12">
            <p class="text-h6 font-weight-bold mb-1">Top Resto</p>
            <v-slide-group v-model="model">
                <v-slide-group-item v-for="n in 5" :key="n">
                    <v-container class="p-0 me-2">
                        <v-img width="120px" height="140px" src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" cover class="rounded-3"></v-img>
                        <p class="mb-0 mt-1 ma-1 font-weight-bold text-body-2 text-truncate" style="max-width: 120px;">Mie Goreng admwamdkwadk admkwam</p>
                    </v-container>
                </v-slide-group-item>
            </v-slide-group>
        </v-col>
        <v-col cols="12">
            <p class="text-h6 font-weight-bold mb-1">Top Menu</p>
            <v-slide-group v-model="model">
                <v-slide-group-item v-for="n in 5" :key="n">
                    <v-container class="p-0 me-2">
                        <v-img width="120px" height="140px" src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" cover class="rounded-3"></v-img>
                        <p class="mb-0 mt-1 ma-1 font-weight-bold text-body-2 text-truncate" style="max-width: 120px;">Mie Goreng admwamdkwadk admkwam</p>
                        <strong class="mb-0 ma-1 text-subtitle-2 text-truncate text-deep-purple-darken-4" style="max-width: 120px;">Rp20.000</strong>
                    </v-container>
                </v-slide-group-item>
            </v-slide-group>
        </v-col>
    </v-row>
</v-container>
</template>

<script>

</script>
