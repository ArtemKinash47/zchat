<template>
  <q-page class="conversation-page q-pa-md">
    <div class="conversation-heading">
      <div v-if="conversationTitle" class="text-h5">{{ conversationTitle }}</div>
      <div v-else class="text-subtitle1 text-grey-7">Select a conversation</div>
    </div>
    <div class = "message-composer">
    <q-list
      v-if="text === '/' && !commandSelected"
      class="command-list text-subtitle2 text-grey-7"
    >
        <Commands
          v-for="(info, command) in commandInfo"
          :key="command"
          :name="command"
          :info="info"
          @select="selectCommand"
        />
    </q-list>
        <q-input
          v-model="text"
          outlined
          class="message-composer"
          label="Message"
          placeholder="Type a message"
          @update:model-value="onTextChanged"
        >
          <template #append>
            <div class="composer-icons">
              <q-icon name="send" />
              <q-icon name="attach_file" />
            </div>
          </template>
        </q-input>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Commands from './Commands.vue'

const route = useRoute()
const text = ref('')
const commandSelected = ref(false)

function selectCommand(command) {
  text.value = command
  commandSelected.value = true
}

function onTextChanged() {
  commandSelected.value = false
}

const conversationTitle = computed(() => {
  const channel = route.query.channel
  if (typeof channel === 'string' && channel) return `# ${channel}`

  const name = route.query.name
  if (typeof name !== 'string' || !name) return ''

  return `Direct message with ${name}`
})

const commandInfo = {
      '/join channelName [private]': 'Create a channel, if not exists, and join it. If "private" is specified, the channel will be private.',
      '/join channelName': 'Join or create the public channel',
      '/invite nickname': 'Invite a user through their nickname',
      '/revoke nickname': 'Revoke a user\'s access to the specified channel',
      '/kick nickname': 'Kick a user from the specified channel',
      '/quit': 'Close/delete the channel(if admin)',
      '/cancel': 'Leave current channel / delete if admin',
  }
</script>

<style scoped>
.conversation-page {
  display: flex;
  flex-direction: column;
}

.message-composer {
  margin-top: auto;
}

.command-list {
  border: 1px solid var(--q-primary);
  border-radius: 4px;
  overflow: hidden;
  margin-left: 6px;
}

.composer-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
