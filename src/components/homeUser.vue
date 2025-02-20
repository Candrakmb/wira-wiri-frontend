<template>
<v-container class="p-3" v-if="!isLoading">
    <v-row>
        <v-col cols="12" v-if="selectedAlamat == null">
            <v-card class="p-1" color="deep-purple-darken-3" rounded="4" elevation="5">
                <div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                        <v-card-title class="text-body-1 pt-2 pb-0">
                            Delivery To
                        </v-card-title>
                        <v-card-subtitle class="pt-0 pb-0 " style="max-width: 250px;">Belum Menambah Alamat</v-card-subtitle>
                        <v-card-actions>
                            <v-btn to="/alamat/create" class="ms-2 p-1 text-capitalize" size="small"  variant="flat" rounded="2">Tambah Alamat</v-btn>
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
        <v-col cols="12"  v-if="selectedAlamat != null">
            <v-card class="p-1" color="deep-purple-darken-3" rounded="4" elevation="5">
                <div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                        <v-card-title class="text-body-1 pt-2 pb-0">
                            Delivery To
                        </v-card-title>
                        <v-card-subtitle class="pt-0 pb-0 " style="max-width: 250px;">{{ selectedAlamat.alamat }}</v-card-subtitle>
                        <v-card-actions>
                            <v-btn class="ms-2 p-1 text-capitalize" size="small"  variant="flat" rounded="2">{{ selectedAlamat.tipe_alamat }}</v-btn>
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
                        <v-card-title class="text-h6 pb-0 text-capitalize">
                            {{ menuRandom[0].nama }}
                        </v-card-title>
                        <v-card-subtitle class="">{{ formatCurrency(menuRandom[0].harga) }}</v-card-subtitle>
                        <v-card-actions>
                            <v-btn :to="'/menu/' + menuRandom[0].kedai_id" class="ms-1 text-capitalize" size="small" text="Order Now" variant="flat" color="deep-purple-darken-3" rounded="3" width="100" height="30"></v-btn>
                        </v-card-actions>
                    </div>
                    <v-avatar class="ma-3" rounded="0" size="90">
                        <!-- <v-icon icon="$mdiGoogleMaps"></v-icon> -->
                        <v-img :src="menuRandom[0].img_url"></v-img>
                    </v-avatar>
                </div>
            </v-card>
        </v-col>
        <v-col cols="12">
            <p class="text-h6 font-weight-bold mb-1">Top Resto</p>
            <v-slide-group>
                <v-slide-group-item v-for="kedai in kedaiRandom" :key="kedai.id">
                    <a :href="'menu/' + kedai.id">
                        <v-container @click="$router.push('menu/' + kedai.id)" class="p-0 me-2">
                        <v-img width="120px" height="140px" :src="kedai.img_url" cover class="rounded-3"></v-img>
                        <p class="mb-0 mt-1 ma-1 font-weight-bold text-body-2 text-truncate text-capitalize" style="max-width: 120px;">{{ kedai.user.name }}</p>
                    </v-container>
                    </a>
                </v-slide-group-item>
            </v-slide-group>
        </v-col>
        <v-col cols="12">
            <p class="text-h6 font-weight-bold mb-1">Top Menu</p>
            <v-slide-group>
                <v-slide-group-item v-for="menu in menuRandom" :key="menu.id">
                    <a :href="'menu/' + menu.kedai_id">
                     <v-container class="p-0 me-2">
                        <v-img width="120px" height="140px" :src="menu.img_url" cover class="rounded-3"></v-img>
                        <p class="mb-0 mt-1 ma-1 font-weight-bold text-body-2 text-truncate text-capitalize" style="max-width: 120px;">{{menu.nama}}</p>
                        <strong class="mb-0 ma-1 text-subtitle-2 text-truncate text-deep-purple-darken-4" style="max-width: 120px;">{{ formatCurrency(menu.harga) }}</strong>
                     </v-container>
                    </a>
                </v-slide-group-item>
            </v-slide-group>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import api from '@/api/axios'
import formatCurrency from '@/mixins/formatCurrency'
export default{
    mixins: [formatCurrency],
    data(){
        return{
            kedaiRandom: null,
            menuRandom:null,
            isLoading: true,
            selectedAlamat: null,
            latitude: null,
            longitude: null,

        }
    },
    methods: {
       async getRandomKedaiAndMenu(){
            try{
                const response = await api.get('/menu/random');
                this.kedaiRandom = response.data.kedai_random;
                this.menuRandom = response.data.menu_random;
                this.isLoading = false;
            } catch(error){
                console.log(error);
                this.isLoading = false;
            }
        },
    async getAlamatById(id){
            try {
                const response = await api.get('profil/detail/alamat/' + id);
                this.selectedAlamat = response.data.alamat;
                this.getRandomKedaiAndMenu();
                console.log(this.selectedAlamat);
            } catch (error) {
                console.log(error);
            }
    },
     async getSelectedAlamat(){
        const formData = {
                latitude: this.latitude, 
                longitude: this.longitude, 
        };
        try {
                const response = await api.post('profil/selected/alamat', formData);
                if(response.data.alamat !=null ){
                    this.getAlamatById(response.data.alamat);
                } else {
                    this.selectAlamat = null;
                    this.getRandomKedaiAndMenu();
                }
            } catch (error) {
                console.log(error);
        }
    },
    
    },
    
    mounted(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.getSelectedAlamat();
        }, error => {
            console.error('Error getting location:', error);
        });
        } else {
        console.error('Geolocation is not supported by this browser.');
        }
        
    }
}

</script>
