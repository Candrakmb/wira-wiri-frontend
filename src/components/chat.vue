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
      sendLoading: false,
    }
  },
  methods: {
    async chatIndex(){
      const formData = {
        invoice_number: this.data.invoice_number,
      }
      const response = await api.post('message', formData)
      this.messages = response.data.messages;

      this.isLoading = false;
      this.scrollToBottom();
    },
    async sendChat(){
      this.sendLoading = true;
      const formSendData = {
        invoice_number: this.data.invoice_number,
        receiver_id: this.data.reciver_id,
        content : this.content
      }

      const response = await api.post('message/create', formSendData)
      console.log(response);
      this.content = null;
      this.chatIndex();
      this.sendLoading = false;
    },
    listenMessage(){
        Echo.private("chat-channel." + this.data.sender_id ).listen("SendMessage", (data) => {
          this.chatIndex();
          this.sendLoading = false;
        });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  },
  mounted() {
      this.chatIndex();
      this.listenMessage();
  }
}
</script>

<style scoped>
/* Kontainer chat dengan auto-scroll */
.chat-container {
  flex: 1;
  overflow-y: auto;
  height: calc(100vh - 80px);
  padding-bottom: 80px; /* Agar tidak ketutupan input */
}

/* Bubble chat */
.chat-bubble {
  max-width: 70%;
  word-wrap: break-word;
  padding: 10px;
  border-radius: 10px;
}

/* Pesan yang dikirim */
.sent {
  background-color: #0d6efd;
  color: white;
  margin-left: auto;
}

/* Pesan yang diterima */
.received {
  background-color: #f1f1f1;
  color: black;
  margin-right: auto;
}

/* Input chat tetap di bawah */
.chat-input {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background: white;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
}
</style>

<template>
  <v-layout class="bg-white d-flex flex-column">
    <!-- Area Percakapan -->
    <v-container v-if="!isLoading" ref="chatContainer" class="chat-container">
      <v-row v-for="message in messages" :key="message.id" class="mb-2">
        <v-col cols="12" class="d-flex py-0">
          <v-card
            class="pa-2"
            :class="message.sender_id === data.sender_id ? 'chat-bubble sent' : 'chat-bubble received'"
          >
            <p class="m-0">{{ message.content }}</p>
            <p class="m-0 text-caption text-end text-medium-emphasis">{{ message.time }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Input Chat -->
    <v-card class="chat-input d-flex align-center">
      <v-textarea
        v-model="content"
        class="flex-grow-1 me-3"
        density="compact"
        label="Ketik pesan..."
        variant="solo"
        hide-details
        single-line
        auto-grow
        clearable
        rows="1"
        max-rows="5"
        rounded
      ></v-textarea>
      <v-btn :loading="sendLoading" @click="sendChat" icon="mdi-send" color="blue" :disabled="!content"></v-btn>
    </v-card>
  </v-layout>
</template>
