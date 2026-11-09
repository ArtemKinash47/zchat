<template>
  <q-page class="conversation-page" :style-fn="pageStyleFn">
    <div class="title_bar">
      <q-bar class="bg-secondary text-white">
        <div class="title_conv text-h5">
          {{ chatName || 'Select a conversation' }}
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
        v-if="text.startsWith('/') && !commandSelected"
        class="command-list text-subtitle2 text-grey-7"
      >
        <Commands
          v-for="(info, command) in filCommandInfo"
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
    :chat-nickname="chatNickname"
    :chat-avatar="chatAvatar"
    :participants="channelParticipants"
    @add-member="addChannelMember"
  />
</template>

<script setup>
import { computed, inject, nextTick, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import Commands from './Commands.vue'
import ChatInfo from './ChatInfo.vue'
import { knownNicknames } from '@/knownNicknames.js'

const $q = useQuasar()
const route = useRoute()
const text = ref('')
const commandSelected = ref(false)
const channelLinks = inject('channelLinks', ref([]))
const chatLinks = inject('chatLinks', ref([]))
const messagesScrollArea = ref(null)
const messageHistory = ref(null)
const ChatInfoOpen = ref(false)
const router = useRouter()

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

const queryString = (value) => (typeof value === 'string' ? value : '')

const channelQuery = computed(() => queryString(route.query.channel))
const nameQuery = computed(() => queryString(route.query.name))

const normalize = (value) => value.trim().replace(/^@/, '').toLowerCase()

const currentChannel = computed(() =>
  channelQuery.value
    ? channelLinks.value.find(({ name }) => name === channelQuery.value)
    : undefined,
)

const directChat = computed(() => {
  if (!nameQuery.value) return null
  const target = normalize(nameQuery.value)

  return (
    chatLinks.value.find(({ name, nickname }) =>
      [name, nickname].some((id) => typeof id === 'string' && normalize(id) === target),
    ) ?? null
  )
})

const conversationTitle = computed(() => {
  if (channelQuery.value) return `${channelQuery.value}`
  if (nameQuery.value) return `${nameQuery.value}`
  return ''
})

const chatName = computed(() =>
  channelQuery.value || (directChat.value?.name ?? nameQuery.value),
)

const chatNickname = computed(() => directChat.value?.nickname ?? '')

const channelType = computed(() => {
  if (channelQuery.value) return 2
  if (nameQuery.value) return 1
  return null
})

const chatAvatar = computed(() =>
  channelQuery.value ? (currentChannel.value?.avatar ?? '') : (directChat.value?.avatar ?? ''),
)

const channelParticipants = computed(() =>
  (currentChannel.value?.usersList ?? []).map((member, index) =>
    typeof member === 'string' ? { id: index, name: member } : { id: index, ...member },
  ),
)

const channelIsPrivate = computed({
  get: () => currentChannel.value?.isPrivate ?? false,
  set: (value) => {
    if (currentChannel.value) currentChannel.value.isPrivate = value
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

const API_URL = 'http://localhost:3333/api/v1/account'
const PAGE_SIZE = 20
const MY_AVATAR = 'https://cdn.quasar.dev/img/avatar4.jpg'

const messagesByConversation = ref({})
const hasMoreByConversation = ref({})
let sysMsgCounter = 0

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })
const activeConversation = computed(() => {
  if (channelQuery.value && currentChannel.value?.id) {
    return { key: `channel:${currentChannel.value.id}`, type: 'channel', id: currentChannel.value.id }
  }
  if (nameQuery.value && directChat.value?.id) {
    return { key: `direct:${directChat.value.id}`, type: 'direct', id: directChat.value.id }
  }
  return null
})

const msgs = computed(() => {
  const conv = activeConversation.value
  return conv ? (messagesByConversation.value[conv.key] ?? []) : []
})

function formatTime(iso) {
  return iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
}

function mapMessage(m) {
  return {
    id: m.id,
    sender: m.mine ? 'You' : m.sender,
    text: m.content,
    time: formatTime(m.createdAt),
    avatar: m.mine ? MY_AVATAR : undefined,
  }
}

async function fetchMessages(conv, before) {
  const params = new URLSearchParams({ type: conv.type, limit: PAGE_SIZE })
  if (before) params.set('before', before)
  const res = await fetch(`${API_URL}/chats/${conv.id}/messages?${params}`, { headers: authHeaders() })
  if (!res.ok) throw new Error(`messages ${res.status}`)
  return res.json()
}

async function onLoad(_index, done) {
  const conv = activeConversation.value
  if (!conv || hasMoreByConversation.value[conv.key] === false) return done(true)

  const list = messagesByConversation.value[conv.key] ?? []
  const oldestId = list.find((m) => typeof m.id === 'number')?.id
  try {
    const data = await fetchMessages(conv, oldestId)
    messagesByConversation.value[conv.key] = [...data.messages.map(mapMessage), ...list]
    hasMoreByConversation.value[conv.key] = data.hasMore
    done(!data.hasMore)
  } catch (e) {
    console.error(e)
    done(true)
  }
}
watch(
  () => activeConversation.value?.key,
  () => {
    nextTick(() => {
      messageHistory.value?.reset()
      messageHistory.value?.resume()
    })
  },
)
watch(() => msgs.value.at(-1)?.id, scrollMessagesToBottom, { flush: 'post' })

async function sendMessage() {
  const conv = activeConversation.value
  const messageText = text.value.trim()
  if (!conv || !messageText) return

  const list = messagesByConversation.value[conv.key] ?? []

  if (messageText === '/list') {
    const members = conv.type === 'channel'
      ? (currentChannel.value?.usersList ?? []).map((m) => (typeof m === 'string' ? m : m.name))
      : ['You', chatName.value]
    messagesByConversation.value[conv.key] = [
      ...list,
      { id: `sys-${sysMsgCounter++}`, sender: 'ZCHAT SYSTEM', text: members.join(', '),
        time: formatTime(new Date().toISOString()) },
    ]
    text.value = ''
    return
  }

  if (messageText == '/quit'){
    if (conv.type !== 'channel' || !currentChannel.value) {
      $q.notify({ type: 'warning', message: 'you can leave from a channel' })
      return
    }

    try {
      const res = await fetch(`${API_URL}/channels/${conv.id}`, {
        method: 'DELETE',
        headers: authHeaders()
      })
      const body = await res.json()

      if(!res.ok) {
        throw new Error(body.errors?.[0]?.message || body.message || `could not close/delete channel -> ${res.status}`)
      }

      channelLinks.value = channelLinks.value.filter((channel) => channel.id !== conv.id)
      await router.push({ path: '/' })
      $q.notify({ type: 'positive', message: 'Channel closed' })
      text.value = ''
    } catch (error) {
      console.error('channel failed to close/delete :', error)
      $q.notify({ type: 'negative', message: error.message })
    }
    return
  }

  if (messageText == '/cancel'){
    if (conv.type !== 'channel' || !currentChannel.value) {
      $q.notify({ type: 'warning', message: 'you can leave from a channel' })
      return
    }

    try {
      const res = await fetch(`${API_URL}/channels/${conv.id}/cancelsub`, {
        method: 'DELETE',
        headers: authHeaders()
      })
      const body = await res.json()

      if(!res.ok) {
        throw new Error(body.errors?.[0]?.message || body.message || `could not close/delete channel -> ${res.status}`)
      }

      channelLinks.value = channelLinks.value.filter((channel) => channel.id !== conv.id)
      await router.push({ path: '/' })
      $q.notify({ type: 'positive', message: body.message === 'chanel deleted successfully' ? 'channel closed(deleted)' : 'you left the channel' })
      text.value = ''
    } catch (error) {
      console.error('channel failed to close/delete :', error)
      $q.notify({ type: 'negative', message: error.message })
    }
    return
  }

  const messageParts = messageText.split(/\s+/)
  if (messageParts[0] === '/invite') {
    if (messageParts.length !== 2 || !messageParts[1].replace(/^@/, '')) {
      $q.notify({ type: 'warning', message: 'Usage of command: "/invite nickname"' })
      return
    }

    const nickname = messageParts[1].replace(/^@/, '')

    if (conv.type !== 'channel' || !currentChannel.value) {
      $q.notify({ type: 'warning', message: 'You can only invite users to a channel' })
      return
    }

    try {
      const res = await fetch(`${API_URL}/channels/${conv.id}/members`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      })

      const body = await res.json()

      if (!res.ok) {
        throw new Error(
          body.errors?.[0]?.message || body.message || `invite failed (${res.status})`,
        )
      }

      const member = body.member
      const channel = currentChannel.value
      
      channel.usersList ??= []

      if (!channel.usersList.some((existing) => existing.id === member.id)) {
        channel.usersList.push(member)
      }

      messagesByConversation.value[conv.key] = [
        ...list,
        {
          id: `sys-${sysMsgCounter++}`,
          sender: 'ZCHAT SYSTEM',
          text: `${member.name} was added to the channel ${channel.name}`,
          time: formatTime(new Date().toISOString()),
        },
      ]
      text.value = ''
    } catch (error) {
      console.error('Invite failed:', error)
      $q.notify({ type: 'negative', message: error.message })
    }

    return
  }

  try {
    const res = await fetch(`${API_URL}/chats/${conv.id}/messages`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: conv.type, content: messageText }),
    })
    if (!res.ok) throw new Error(`send ${res.status}`)
    const { message } = await res.json()
    messagesByConversation.value[conv.key] = [...list, mapMessage(message)]
    text.value = ''
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Message was not sent' })
  }
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

function messageParts(message) {
  return message
    .split(/(@[A-Za-z0-9_]+)/g)
    .filter(Boolean)
    .map((text) => ({
      text,
      isMention:
        text.startsWith('@') &&
        knownNicknames.includes(text.slice(1).toLowerCase()),
    }))
}

const filCommandInfo = computed(() => {
  const typedCommand = text.value.trim().split(/\s+/)[0].toLowerCase()

  return Object.fromEntries(
    Object.entries(commandInfo).filter(([command]) =>
      command.split(' ')[0].toLowerCase().startsWith(typedCommand),
    ),
  )
})
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
