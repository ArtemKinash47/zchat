<template>
  <q-page class="conversation-page q-pa-md">
    <div class="conversation-heading">
      <div v-if="conversationTitle" class="text-h5">{{ conversationTitle }}</div>
      <div v-else class="text-subtitle1 text-grey-7">Select a conversation</div>
    </div>
    <q-input
      v-model="text"
      outlined
      class="message-composer"
      label="Message"
      placeholder="Type a message"
    >
      <template #append>
        <div class="composer-icons">
          <q-icon name="send" />
          <q-icon name="attach_file" />
        </div>
      </template>
    </q-input>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const text = ref('')

const conversationTitle = computed(() => {
  const channel = route.query.channel
  if (typeof channel === 'string' && channel) return `# ${channel}`

  const name = route.query.name
  if (typeof name !== 'string' || !name) return ''

  return `Direct message with ${name}`
})
</script>

<style scoped>
.conversation-page {
  display: flex;
  flex-direction: column;
}

.message-composer {
  margin-top: auto;
}

.composer-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
