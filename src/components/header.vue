<!-- eslint-disable vue/multi-word-component-names -->
<template>
<v-card class="bg-color-white rounded-b-xl">
    <v-container class="text-center pt-4 pb-1">
        <v-row justify="center" dense>
            <v-col cols="10">
                <v-autocomplete   @click="goToSearch" class="mx-auto" density="comfortable" menu-icon="" placeholder="Search resto dan makanan" prepend-inner-icon="mdi-magnify" style="max-width: 350px;" theme="light" variant="solo" auto-select-first item-props rounded></v-autocomplete>
            </v-col>
            <v-col cols="2" class="text-end mt-1">
                <a href="/profil">
                    <v-avatar to="/profil" color="deep-purple-darken-3" size="43">
                        <font-awesome-icon icon="fa-solid fa-user" size="1x" />
                    </v-avatar>
                </a>
            </v-col>
        </v-row>
    </v-container>
</v-card>
</template>

<script>
export default {
    methods: {
        goToSearch() {
        this.$router.push("/search/kedai");
        },
    },
    data: () => ({
        dialog: false,
        items: [{
                prependIcon: 'mdi-clock-outline',
                title: 'recipe with chicken',
            },
            {
                prependIcon: 'mdi-clock-outline',
                title: 'best hiking trails near me',
            },
            {
                prependIcon: 'mdi-clock-outline',
                title: 'how to learn a new language',
            },
            {
                prependIcon: 'mdi-clock-outline',
                title: 'DIY home organization ideas',
            },
            {
                prependIcon: 'mdi-clock-outline',
                title: 'latest fashion trends',
            },
        ],
        shortcuts: [{
                icon: 'mdi-github',
                title: 'Master ',
                href: 'https://github.com/vuetifyjs/vuetify',
            },
            {
                icon: 'mdi-github',
                title: 'Dev',
                href: 'https://github.com/vuetifyjs/vuetify/tree/dev',
            },
            {
                icon: 'mdi-github',
                title: 'Stable',
                href: 'https://github.com/vuetifyjs/vuetify/tree/v2-stable',
            },
            {
                icon: 'mdi-github',
                title: 'My Pull Requests',
                href: 'https://github.com/vuetifyjs/vuetify/pulls/johnleider',
            },
        ],
    }),
}
</script>
