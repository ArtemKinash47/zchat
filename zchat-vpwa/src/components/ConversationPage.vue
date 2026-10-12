<template>
  <q-page class="conversation-page q-pa-md">
    <div class="conversation-heading">
      <div v-if="conversationTitle" class="title_conv text-h5">{{ conversationTitle }}</div>
      <div v-else class="text-subtitle1 text-grey-7">Select a conversation</div>
    </div>
    <q-scroll-area ref="messagesScrollArea" class="messages-scroll-area">
      <div class="messages">
        <q-chat-message
          v-for="message in msgs"
          :key="message.id"
          :avatar="message.avatar"
          :name="message.sender"
          :text="[message.text]"
          :stamp="message.time"
          :sent="message.sender === 'You'"
        />
      </div>
    </q-scroll-area>
    <div class="message-composer">
      <div v-if="conversationTitle === 'Direct message with alexmorgan' && text.length > 0">
        <q-spinner-facebook color="secondary" />
        <span>You and Alex Morgan are typing...</span>
      </div>
      <div
        v-else-if="text.length === 0 && conversationTitle === 'Direct message with alexmorgan'"
        class="typing-indicator"
      >
        <q-spinner-facebook color="secondary" />
        <span>Alex Morgan is typing...</span>
      </div>
      <div v-else-if="text.length > 0">
        <q-spinner-facebook color="secondary" />
        <span>You are typing...</span>
      </div>
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
        @keydown.enter.exact.prevent="sendMessage"
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
import { computed, inject, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Commands from './Commands.vue'

const route = useRoute()
const text = ref('')
const commandSelected = ref(false)
const channelLinks = inject('channelLinks', ref([]))
const messagesScrollArea = ref(null)

function scrollMessagesToBottom() {
  nextTick(() => {
    messagesScrollArea.value?.setScrollPercentage('vertical', 1, 300)
  })
}

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

const messagesByConversation = ref({
  'direct:alexmorgan': [
    {
      id: 1,
      sender: 'Alex Morgan',
      text: 'Hey, how is the project going?',
      time: '09:15',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
    {
      id: 2,
      sender: 'You',
      text: 'Pretty well! I finished the layout.',
      time: '09:17',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 3,
      sender: 'Alex Morgan',
      text: 'Nice! Can you share a preview?',
      time: '09:18',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
    {
      id: 4,
      sender: 'You',
      text: 'Sure, I will send it shortly.',
      time: '09:20',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 5,
      sender: 'Alex Morgan',
      text: 'Thanks, looking forward to it.',
      time: '09:21',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
    {
      id: 26,
      sender: 'Alex Morgan',
      text: 'JD?',
      time: '10:00',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
    {
      id: 27,
      sender: 'Alex Morgan',
      text: 'Where is it?',
      time: '10:01',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
  ],
  'direct:Den Verstappen': [
    {
      id: 6,
      sender: 'Den Verstappen',
      text: 'Are we still meeting today?',
      time: '10:02',
      avatar:
        'https://img.redbull.com/images/c_crop,x_914,y_1637,h_3171,w_3171/c_fill,g_auto,w_308,h_308/q_auto:low,f_auto/redbullcom/2022/5/5/esxtfazwc5k0xntwv20i/max-verstappen-profile-pic',
    },
    {
      id: 7,
      sender: 'You',
      text: 'Yes, at 2 PM.',
      time: '10:04',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 8,
      sender: 'Den Verstappen',
      text: 'Great, I will bring the notes.',
      time: '10:05',
      avatar:
        'https://img.redbull.com/images/c_crop,x_914,y_1637,h_3171,w_3171/c_fill,g_auto,w_308,h_308/q_auto:low,f_auto/redbullcom/2022/5/5/esxtfazwc5k0xntwv20i/max-verstappen-profile-pic',
    },
    {
      id: 9,
      sender: 'You',
      text: 'Perfect, see you then.',
      time: '10:06',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 10,
      sender: 'Den Verstappen',
      text: 'See you!',
      time: '10:07',
      avatar:
        'https://img.redbull.com/images/c_crop,x_914,y_1637,h_3171,w_3171/c_fill,g_auto,w_308,h_308/q_auto:low,f_auto/redbullcom/2022/5/5/esxtfazwc5k0xntwv20i/max-verstappen-profile-pic',
    },
  ],
  'direct:Leybron Jahames': [
    {
      id: 11,
      sender: 'Leybron Jahames',
      text: 'I pushed the latest changes.',
      time: '11:30',
      avatar: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
    },
    {
      id: 12,
      sender: 'You',
      text: 'Thanks, I will review them.',
      time: '11:32',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 13,
      sender: 'Leybron Jahames',
      text: 'The tests are passing now.',
      time: '11:33',
      avatar: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
    },
    {
      id: 14,
      sender: 'You',
      text: 'Great work!',
      time: '11:35',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 15,
      sender: 'Leybron Jahames',
      text: 'Let me know if anything needs fixing.',
      time: '11:36',
      avatar: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
    },
  ],
  'channel:Design Team': [
    {
      id: 16,
      sender: 'Alex Morgan',
      text: 'I added the new dashboard mockups.',
      time: '13:10',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
    {
      id: 17,
      sender: 'You',
      text: 'The colors look good.',
      time: '13:12',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 18,
      sender: 'Den Verstappen',
      text: 'I agree. The layout feels clearer.',
      time: '13:14',
      avatar:
        'https://img.redbull.com/images/c_crop,x_914,y_1637,h_3171,w_3171/c_fill,g_auto,w_308,h_308/q_auto:low,f_auto/redbullcom/2022/5/5/esxtfazwc5k0xntwv20i/max-verstappen-profile-pic',
    },
    {
      id: 19,
      sender: 'You',
      text: 'I will update the buttons to match.',
      time: '13:16',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 20,
      sender: 'Alex Morgan',
      text: 'Thanks, everyone!',
      time: '13:18',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
    {
      id: 28,
      sender: 'Den Verstappen',
      text: 'TU TU TUTU!',
      time: '13:14',
      avatar:
        'https://img.redbull.com/images/c_crop,x_914,y_1637,h_3171,w_3171/c_fill,g_auto,w_308,h_308/q_auto:low,f_auto/redbullcom/2022/5/5/esxtfazwc5k0xntwv20i/max-verstappen-profile-pic',
    },
    {
      id: 29,
      sender: 'Den Verstappen',
      text: 'DEN VERSTAPPEN!',
      time: '13:14',
      avatar:
        'https://img.redbull.com/images/c_crop,x_914,y_1637,h_3171,w_3171/c_fill,g_auto,w_308,h_308/q_auto:low,f_auto/redbullcom/2022/5/5/esxtfazwc5k0xntwv20i/max-verstappen-profile-pic',
    },
  ],
  'channel:Infinity Chat': [
    {
      id: 21,
      sender: 'Leybron Jahames',
      text: 'Welcome to the project chat.',
      time: '14:00',
      avatar: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
    },
    {
      id: 22,
      sender: 'You',
      text: 'Happy to be here!',
      time: '14:02',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 23,
      sender: 'Leybron Jahames',
      text: 'We use this channel for general updates.',
      time: '14:03',
      avatar: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
    },
    {
      id: 24,
      sender: 'You',
      text: 'Got it, thanks.',
      time: '14:04',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 25,
      sender: 'Leybron Jahames',
      text: 'Feel free to ask any questions.',
      time: '14:05',
      avatar: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
    },
  ],
})

const activeConversationKey = computed(() => {
  const channel = route.query.channel
  if (typeof channel === 'string' && channel) return `channel:${channel}`

  const name = route.query.name
  if (typeof name === 'string' && name) return `direct:${name}`

  return null
})

const msgs = computed(() => {
  const key = activeConversationKey.value
  return key ? (messagesByConversation.value[key] ?? []) : []
})

watch(() => [activeConversationKey.value, msgs.value.length], scrollMessagesToBottom, {
  flush: 'post',
})

let nextMsgId = 30

function sendMessage() {
  const key = activeConversationKey.value
  const messageText = text.value.trim()
  if (!key || !messageText) {
    return
  }

  if (messageText === '/list') {
    const channelName = route.query.channel
    const directName = route.query.name
    const channel = channelLinks.value.find(({ name }) => name === channelName)
    const members = channelName
      ? (channel?.usersList ?? [])
      : ['You', typeof directName === 'string' ? directName : '']
    const membersText = members.join(', ')

    messagesByConversation.value[key] = [
      ...(messagesByConversation.value[key] ?? []),
      {
        id: nextMsgId++,
        sender: 'ZCHAT SYSTEM',
        text: membersText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]
    text.value = ''
    return
  }

  const msg = {
    id: nextMsgId++,
    sender: 'You',
    text: messageText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
  }
  messagesByConversation.value[key] = [...(messagesByConversation.value[key] ?? []), msg]
  text.value = ''
}

const commandInfo = {
  '/join channelName [private]':
    'Create a channel, if not exists, and join it. If "private" is specified, the channel will be private.',
  '/join channelName': 'Join or create the public channel',
  '/invite nickname': 'Invite a user through their nickname',
  '/revoke nickname': "Revoke a user's access to the specified channel",
  '/kick nickname': 'Kick a user from the specified channel',
  '/quit': 'Close/delete the channel(if admin)',
  '/cancel': 'Leave current channel / delete if admin',
  '/list': 'List all members of the chat/channel',
}
</script>

<style scoped>
.conversation-page {
  display: flex;
  flex-direction: column;
}

.messages-scroll-area {
  width: 100%;
  height: min(75vh, 1200px);
}

.message-composer {
  margin-top: auto;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
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

@media (max-width: 599px) {
  .title_conv {
    font-size: 1.2rem;
  }
}
</style>
