<!-- eslint-disable vue/multi-word-component-names -->
<script>
import api from '@/api/axios' 
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      messages: null,
      content: null,
      isLoading: true,
    }
  },
  methods: {
    async chatIndex(){
      const formData = {
        invoice_number: this.data.invoice_number,
      }
      const response = await api.post('message', formData)
      this.messages = response.data.messages;
      console.log(this.messages);
      this.isLoading = false;
    },
    async sendChat(){
      const formSendData = {
        invoice_number: this.data.invoice_number,
        receiver_id: this.data.reciver_id,
        content : this.content
      }

      const response = await api.post('message/create', formSendData)
      console.log(response);
      this.content = null;
      this.chatIndex();
    },
    listenMessage(){
        Echo.private("chat-channel." + this.data.sender_id ).listen("SendMessage", (data) => {
          console.log(data);
          this.chatIndex();
        });
    },
  },
  mounted() {
      this.chatIndex();
      this.listenMessage();
      console.log(this.data);
  }
}
</script>

<style scoped>
.v-layout {
  height: 100vh;
}
</style>
<template>
  <v-layout class="bg-white" column>
    <!-- Area Percakapan -->
    <v-container v-if="!isLoading" class="pt-2" style="flex: 1; overflow-y: auto;">
      <v-row v-for="message in messages" :key="message">
        <v-col v-if="message.sender_id != data.sender_id" cols="12" class="mb-10 position-relative">
          <v-card class="pa-2 ms-2 pb-0 rounded-lg position-absolute left-0" style="max-width: 60%;">
            <p class="m-0">{{ message.content }}</p>
            <p class="m-0 text-caption text-end text-medium-emphasis">{{message.time}}</p>
          </v-card>
        </v-col>
        <v-col v-else cols="12" class="mb-10 position-relative">
          <v-card color="blue" class="pa-2 pb-0 me-2 rounded-lg position-fixed right-0" style="max-width: 60%;">
            <p class="m-0">{{ message.content }}</p>
            <p class="m-0 text-caption text-end">{{message.time}}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Input Chat -->
      <v-card class="position-fixed bottom-0 w-100 px-3 py-2">
        
        <v-textarea
              v-model="content"
              density="compact"
              label="ketik pesan"
              variant="solo"
              hide-details
              single-line
              auto-grow
              filled
              clearable
              rows="1"
              max-rows="5"
            >
            <template v-slot:append>
              <v-icon @click ="sendChat()" size="40" color="blue">
                mdi-send
              </v-icon>
            </template>
        </v-textarea>
      </v-card>
  </v-layout>
</template>
