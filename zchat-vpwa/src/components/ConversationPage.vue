<template>
  <q-page class="conversation-page" :style-fn="pageStyleFn">
    <div class="title_bar">
      <q-bar class="bg-secondary text-white">
        <div class="title_conv text-h5">
          {{ conversationTitle || 'Select a conversation' }}
        </div>
          <q-btn class="justify-end bg-primary" round  icon="more_horiz" @click="ChatInfoOpen = true"/>
      </q-bar>
    </div>
    <q-scroll-area ref="messagesScrollArea" class="messages-scroll-area">
      <q-infinite-scroll
        ref="messageHistory"
        reverse
        :scroll-target="messagesScrollArea"
        @load="onLoad"
      >
        <template #loading>
          <div class="row justify-center q-my-md">
            <q-spinner-pie color="primary" size="40px" />
          </div>
        </template>
        <div class="messages">
          <q-chat-message
            v-for="message in msgs"
            :key="message.id"
            :avatar="message.avatar"
            :name="message.sender"
            :stamp="message.time"
            :sent="message.sender === 'You'"
            :bg-color="message.sender === 'You' ? 'secondary' : message.sender === 'ZCHAT SYSTEM' ? 'info' : 'primary'"
            :text-color=" message.sender === 'ZCHAT SYSTEM' ? 'warning' : 'white'"
          >
          <template #default>
            <span>
              <span
              v-for="(part, index) in messageParts(message.text)"
              :key="index"
              :class="{ 'chat-mention': part.isMention }"
              >{{ part.text }}
              </span>
            </span> 
          </template>
          </q-chat-message>
        </div>
      </q-infinite-scroll>
      </q-scroll-area>
    <div class="typing-area">
      <div
        v-if="conversationTitle === 'Direct message with alexmorgan' && text.length > 0"
        class="typing-status"
      >
        <q-spinner-facebook color="secondary" />
        <span>You and Alex Morgan are typing...</span>
      </div>
      <div
        v-else-if="text.length === 0 && conversationTitle === 'Direct message with alexmorgan'"
        class="typing-indicator typing-status"
      >
        <q-spinner-facebook color="secondary" />
        <span>Alex Morgan is typing...</span>
      </div>
      <div v-else-if="text.length > 0" class="typing-status">
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
    </div>
    <q-input
      v-model="text"
      outlined
      class="message-input"
      label="Message"
      color="accent"
      placeholder="Type a message"
      @update:model-value="onTextChanged"
      @keydown.enter.exact.prevent="sendMessage"
    >
      <template #append>
        <div class="composer-icons">
          <q-btn icon="send" flat @click="sendMessage"/>
        </div>
      </template>
    </q-input>
  </q-page>
  <ChatInfo
    v-model="ChatInfoOpen"
    v-model:is-private="channelIsPrivate"
    :chat-type="channelType"
    :chat-name="chatName"
    :participants="channelParticipants"
    @add-member="addChannelMember"
  />
</template>

<script setup>
import { computed, inject, nextTick, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import Commands from './Commands.vue'
import ChatInfo from './ChatInfo.vue'
import lebronAvatar from '@/assets/lebron.png'
import denAvatar from '@/assets/den.jpg'

const $q = useQuasar()
const route = useRoute()
const text = ref('')
const commandSelected = ref(false)
const channelLinks = inject('channelLinks', ref([]))
const messagesScrollArea = ref(null)
const messageHistory = ref(null)
const ChatInfoOpen = ref(false)
const visibleMessageCount = ref(10)

function scrollMessagesToBottom() {
  nextTick(() => {
    requestAnimationFrame(() => {
      const scrollArea = messagesScrollArea.value
      const scrollTarget = scrollArea?.getScrollTarget()
      if (scrollTarget) {
        scrollArea.setScrollPosition('vertical', scrollTarget.scrollHeight)
      }
    })
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
const chatName = computed(() => {
  const channel = route.query.channel
  if (typeof channel === 'string' && channel) return channel

  const name = route.query.name
  return typeof name === 'string' ? name : ''
})
const channelType = computed(() => {
  const channelType = route.query.channel
  if (typeof channelType === 'string' && channelType) return 2

  const nameType = route.query.name
  if (typeof nameType === 'string' && nameType) return 1

  return null
})

const channelParticipants = computed(() => {
  const channelName = route.query.channel
  if (typeof channelName !== 'string' || !channelName) return []

  const channel = channelLinks.value.find(({ name }) => name === channelName)
  return (channel?.usersList ?? []).map((member, index) =>
    typeof member === 'string' ? { id: index, name: member } : { id: index, ...member },
  )
})

const channelIsPrivate = computed({
  get() {
    const channelName = route.query.channel
    if (typeof channelName !== 'string' || !channelName) return false

    return channelLinks.value.find(({ name }) => name === channelName)?.isPrivate ?? false
  },
  set(isPrivate) {
    const channelName = route.query.channel
    if (typeof channelName !== 'string' || !channelName) return

    const channel = channelLinks.value.find(({ name }) => name === channelName)
    if (channel) channel.isPrivate = isPrivate
  },
})

function addChannelMember(name) {
  const channelName = route.query.channel
  if (typeof channelName !== 'string' || !channelName) return

  const channel = channelLinks.value.find(({ name }) => name === channelName)
  if (!channel) return

  const normalizedName = name.trim().toLowerCase()
  const alreadyMember = (channel.usersList ?? []).some((member) => {
    const memberName = typeof member === 'string' ? member : member.name
    return memberName.trim().toLowerCase() === normalizedName
  })
  if (alreadyMember) {
    $q.notify({
      type: 'warning',
      message: `${name} is already a channel member.`,
    })
    return
  }

  channel.usersList ??= []
  channel.usersList.push({ name: name.trim(), isOnline: 0, admin: false })
}

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
        denAvatar,
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
        denAvatar,
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
        denAvatar,
    },
  ],
  'direct:Leybron Jahames': [
    {
      id: 11,
      sender: 'Leybron Jahames',
      text: 'I pushed the latest changes.',
      time: '11:30',
      avatar: lebronAvatar,
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
      avatar: lebronAvatar,
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
      avatar: lebronAvatar,
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
        denAvatar,
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
        denAvatar,
    },
    {
      id: 29,
      sender: 'Den Verstappen',
      text: 'DEN VERSTAPPEN!',
      time: '13:14',
      avatar:
        denAvatar,
    },
  ],
  'channel:Infinity Chat': [
    {
      id: 21,
      sender: 'Leybron Jahames',
      text: 'Welcome to the project chat.',
      time: '14:00',
      avatar: lebronAvatar,
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
      avatar: lebronAvatar,
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
      avatar: lebronAvatar,
    },
    {
      id: 30,
      sender: 'Alex Morgan',
      text: 'What is everyone working on today?',
      time: '14:06',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
    {
      id: 31,
      sender: 'You',
      text: 'I am checking the chat layout on mobile.',
      time: '14:07',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 32,
      sender: 'Leybron Jahames',
      text: 'I will review the latest changes after lunch.',
      time: '14:08',
      avatar: lebronAvatar,
    },
    {
      id: 33,
      sender: 'Den Verstappen',
      text: 'I can test it on my phone too.',
      time: '14:09',
      avatar:
        denAvatar,
    },
    {
      id: 34,
      sender: 'Alex Morgan',
      text: 'That would be helpful, thanks!',
      time: '14:10',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
    {
      id: 35,
      sender: 'You',
      text: 'The input and command list should now fit smaller screens better.',
      time: '14:12',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 36,
      sender: 'Leybron Jahames',
      text: 'Looks good from here. The spacing feels much cleaner.',
      time: '14:14',
      avatar: lebronAvatar,
    },
    {
      id: 37,
      sender: 'Den Verstappen',
      text: 'I checked the phone view. Everything is readable.',
      time: '14:16',
      avatar:
        denAvatar,
    },
    {
      id: 38,
      sender: 'Alex Morgan',
      text: 'Can we also try the mention suggestions?',
      time: '14:18',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
    {
      id: 39,
      sender: 'You',
      text: 'Sure, I will test typing @alex in the middle of a message.',
      time: '14:19',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 40,
      sender: 'Leybron Jahames',
      text: 'It should show matching accounts as soon as you type.',
      time: '14:21',
      avatar: lebronAvatar,
    },
    {
      id: 41,
      sender: 'Den Verstappen',
      text: 'I will try a few different usernames.',
      time: '14:23',
      avatar:
        denAvatar,
    },
    {
      id: 42,
      sender: 'Alex Morgan',
      text: 'The channel history is looking more realistic now.',
      time: '14:25',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
    {
      id: 43,
      sender: 'You',
      text: 'I added some sample messages so we can check scrolling too.',
      time: '14:26',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 44,
      sender: 'Leybron Jahames',
      text: 'Great. @your_nickname I will scroll back and check that older messages stay accessible.',
      time: '14:27',
      avatar: lebronAvatar,
    },
    {
      id: 45,
      sender: 'Den Verstappen',
      text: 'Scrolling works smoothly on mobile.',
      time: '14:28',
      avatar:
        denAvatar,
    },
    {
      id: 46,
      sender: 'Alex Morgan',
      text: 'Nice work, everyone. Let us keep sharing updates here.',
      time: '14:29',
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
    },
    {
      id: 47,
      sender: 'You',
      text: 'Sounds good! I will post again after the next round of testing.',
      time: '14:30',
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    },
    {
      id: 48,
      sender: 'Leybron Jahames',
      text: 'Thanks for the update.',
      time: '14:31',
      avatar: lebronAvatar,
    },
    {
      id: 49,
      sender: 'Den Verstappen',
      text: 'All good on my side too!',
      time: '14:32',
      avatar:
        denAvatar,
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

const allMsgs = computed(() => {
  const key = activeConversationKey.value
  return key ? (messagesByConversation.value[key] ?? []) : []
})

const msgs = computed(() => allMsgs.value.slice(-visibleMessageCount.value))

watch(activeConversationKey, () => {
  visibleMessageCount.value = 10
  nextTick(() => {
    messageHistory.value?.reset()
    messageHistory.value?.resume()
    scrollMessagesToBottom()
  })
})

watch(() => allMsgs.value.length, scrollMessagesToBottom, {
  flush: 'post',
})

let nextMsgId = 50

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
      ? (channel?.usersList ?? []).map((member) =>
          typeof member === 'string' ? member : member.name,
        )
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
  if (route.query.channel === 'Infinity Chat') {
    $q.notify({
      icon: 'notifications',
      position: 'bottom-right',
      message: `${msg.sender} have sent: ${messageText}`,
      color: 'primary',
      textColor: 'white',
    })
  }
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
function pageStyleFn(offset) {
  return { height: `calc(100dvh - ${offset}px)` }
}

const knownNicknames = new Set(['alexmorgan', 'your_nickname'])

function messageParts(message) {
  return message
    .split(/(@[A-Za-z0-9_]+)/g)
    .filter(Boolean)
    .map((text) => ({
      text,
      isMention:
        text.startsWith('@') &&
        knownNicknames.has(text.slice(1).toLowerCase()),
    }))
}

function onLoad(_index, done) {
  setTimeout(() => {
    const totalMessages = allMsgs.value.length

    if (visibleMessageCount.value >= totalMessages) {
      done(true)
      return
    }

    visibleMessageCount.value = Math.min(visibleMessageCount.value + 10, totalMessages)
    nextTick(() => {
      done(visibleMessageCount.value >= allMsgs.value.length)
    })
  }, 2000)
}

</script>

<style scoped>
.title_bar .q-bar {
  height: 3rem;
  min-height: 3rem;
}

.chat-mention {
  color: #ffeb3b;
  font-weight: 700;
}

.title_conv {
  flex: 1 1 0;
  min-width: 0;           
  overflow: hidden;
  text-overflow: ellipsis; 
  white-space: nowrap;
}
.conversation-page {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages-scroll-area {
  width: 100%;
  flex: 1 1 0;
  min-height: 0;
}

.messages {
  padding-inline: 16px;
  margin-top: 12px;
}

.title_bar,
.typing-area {
  flex: 0 0 auto;
}

.message-input {
  flex: 0 0 auto;
  margin: 0 16px 12px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.typing-status {
  margin-inline: 16px;
}

.command-list {
  border: 1px solid var(--q-primary);
  border-radius: 4px;
  box-sizing: border-box;
  max-height: 35dvh;
  margin: 0 16px 8px;
  overflow-x: hidden;
  overflow-y: auto;
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

  .command-list {
    max-height: 30dvh;
    margin-inline: 10px;
  }

  .typing-status {
    margin-inline: 10px;
  }
}
</style>
