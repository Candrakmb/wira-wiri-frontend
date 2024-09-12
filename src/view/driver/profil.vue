<!-- eslint-disable vue/multi-word-component-names -->
<script>
import Navbar from '@/components/navbar.vue';

export default{
    components: {
        Navbar
    }
}
</script>
<template>
    <v-layout>
        <v-app-bar class="d-flex align-center justify-center">
            <p class="mx-auto mt-3 text-h5 font-weight-bold">Profil</p>
        </v-app-bar>
        <v-main>
               
            <v-card class="mt-4 elevation-0">
                <v-row>
                    <v-col cols="12" class="text-center mb-5">
                        <v-fab
                            class="ms-15 mt-5"
                            icon="mdi-pencil"
                            location="bottom center"
                            size="small"
                            absolute
                            offset
                        ></v-fab>
                        <v-avatar color="#00A9FF" size="100" >
                        <span class="text-h3">Cj</span>
                        </v-avatar>
                        
                    </v-col>
                    <v-col cols="12">
                        <v-container class="px-11 py-1">
                            <v-row no-gutters>
                                <v-col cols="12">
                                    Nama
                                </v-col>
                                <v-col class="text-h6 font-weight-bold d-inline-block text-truncate" cols="12" style="max-width: 300px;">
                                    Candra kusuma muhammad Bimantara
                                </v-col>
                            </v-row>
                            <v-divider class="my-1"></v-divider>
                        </v-container>
                        <v-container class="px-11 py-1">
                            <v-row no-gutters>
                                <v-col cols="12">
                                    Email
                                </v-col>
                                <v-col class="text-h6 font-weight-bold d-inline-block text-truncate" cols="12" style="max-width: 300px;">
                                    Candra kusuma muhammad Bimantara
                                </v-col>
                            </v-row>
                            <v-divider class="my-1"></v-divider>
                        </v-container>
                        <v-container class="px-11 py-1">
                            <v-row no-gutters>
                                <v-col cols="12">
                                    Whatsapp
                                </v-col>
                                <v-col class="text-h6 font-weight-bold d-inline-block text-truncate" cols="12" style="max-width: 300px;">
                                    Candra kusuma muhammad Bimantara
                                </v-col>
                            </v-row>
                            <v-divider class="my-1"></v-divider>
                        </v-container>
                        <v-container class="px-11 py-1">
                            <v-row no-gutters>
                                <v-col cols="12">
                                    Nama
                                </v-col>
                                <v-col class="text-h6 font-weight-bold d-inline-block text-truncate" cols="12" style="max-width: 300px;">
                                    Candra kusuma muhammad Bimantara
                                </v-col>
                            </v-row>
                            <v-divider class="my-1"></v-divider>
                        </v-container>
                    </v-col>
                </v-row>
            </v-card>
            <v-card class="elevation-0 px-9 my-4">
                <v-card-actions>
                  <v-row>
                    <v-col cols="12">
                        <v-btn 
                        append-icon="mdi-chevron-right"
                        color="#00A9FF"
                        text="Histori Orderan"
                        variant="flat"
                        block
                        ></v-btn>
                    </v-col>
                    <v-col cols="12">
                        <v-btn 
                        append-icon="mdi-chevron-right"
                        color="#00A9FF"
                        text="Keluar"
                        variant="outlined"
                        block
                        ></v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
            </v-card>
            
        </v-main>
    </v-layout>
    <Navbar />
</template>

