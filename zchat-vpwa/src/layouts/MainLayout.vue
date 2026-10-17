<template>
  <q-layout view="hHh LpR fFr">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="absolute-center"> ZCHAT </q-toolbar-title>
        <q-space />
        <div class="nav_btns">
          <q-btn round flat aria-label="Open profile" @click="profileWindowOpen = true">
            <q-avatar class="profile-avatar" color="white" text-color="primary">
              <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
            </q-avatar>
          </q-btn>
          <Settings />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <div class="column fit">
        <q-tabs
          v-model="tab"
          align="justify"
          narrow-indicator
          no-caps
          class="col-auto"
        >
          <q-tab class="text-accent" name="Direct Messages" label="Direct Messages" />
          <q-tab class="text-secondary" name="Channels" label="Channels" />
        </q-tabs>

        <q-separator />

        <q-scroll-area class="col">
          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="fade"
            transition-next="fade"
            class="bg-transparent"
          >
            <q-tab-panel name="Direct Messages" class="q-pa-none">
              <q-list>
                <ChatLink
                  v-for="chat in sortedChatLinks"
                  :key="chat.name"
                  v-bind="chat"
                  @clear-unread="clearChatUnread"
                />
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="Channels" class="q-pa-none">
              <q-list>
                <ChannelLink
                  v-for="channel in sortedChannelLinks"
                  :key="channel.name"
                  v-bind="channel"
                  @clear-unread-channel="clearChannelUnread"
                />
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>

        <q-separator />

        <div class="q-pa-md">
          <q-btn
            push
            color="primary"
            text-color="white"
            label="Add Chat"
            class="full-width"
            no-caps
            @click="openAddChat"
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <slot />  
    </q-page-container>

    <MyProfile v-model="profileWindowOpen" />

    <q-dialog v-model="addChatOpen" backdrop-filter="blur(4px) saturate(150%)">
      <q-card class="add-chat-card">
        <q-tabs v-model="tab_addChat" class="text-accent">
          <q-tab label="Add Chat" name="one" />
          <q-tab label="Create Channel" name="two" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab_addChat" animated>
          <q-tab-panel name="one">
            <q-select
              class="add_chat"
              v-model="text_200"
              outlined
              use-input
              hide-selected
              fill-input
              hide-dropdown-icon
              bottom-slots
              :options="options_fill"
              @filter="filterFn"
              @input-value="setChatInput"
              label="Enter nickname"
              stack-label
              color="accent"
              maxlength="20"
              :dense="dense"
            >
              <template #before>
                <q-avatar>
                  <img alt="User avatar" src="https://cdn.quasar.dev/img/avatar5.jpg" />
                </q-avatar>
              </template>

              <template #append>
                <q-icon
                  v-if="text_200 !== ''"
                  name="close"
                  class="cursor-pointer"
                  @click="text_200 = ''"
                />
              </template>

              <template #after>
                <q-btn
                  round
                  dense
                  flat
                  icon="send"
                  aria-label="Add chat"
                  :disable="!text_200.trim()"
                  @click="addChat"
                />
              </template>
            </q-select>
          </q-tab-panel>
          <q-tab-panel name="two">
           <q-input
              outlined
              v-model="text_300"
              bottom-slots
              label="Enter channel name"
              stack-label
              :dense="dense"
              color="accent"
            >
            </q-input>
            <div class="q-pa-md">
              <q-option-group :options="options" type="radio" v-model="group" style="display: flex;" />
            </div>
            <q-select
              outlined
              v-model="text_400"
              use-input
              hide-selected
              fill-input
              hide-dropdown-icon
              hide-no-option
              maxlength="20"
              color="accent"
              input-debounce="150"
              :options="options_fill"
              @filter="filterFn"
              @input-value="setModel"
              behavior="menu"
              popup-content-style="max-height: 240px"
              label="Enter nickname or channel name"
              stack-label
              bottom-slots
              :dense="dense"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">No suggestions found</q-item-section>
                </q-item>
              </template>

              <template #append>
                <q-icon
                  v-if="text_400 !== ''"
                  name="close"
                  class="cursor-pointer"
                  @click.stop="text_400 = ''"
                />
              </template>

              <template #after>
                <q-btn
                  v-if="text_400.trim() !== ''"
                  round
                  dense
                  flat
                  icon="add"
                  aria-label="Add channel member"
                  @click="addChannelMember"
                />
              </template>
              
            </q-select>
            <div class="channel-members-scroll q-pa-md">
                <div class="channel-members">
                  <div
                    v-for="member in selectedChannelMembers"
                    :key="member.nickname"
                    class="selected-channel-member"
                  >
                    <q-avatar size="40px">
                      <img :alt="`${member.nickname} avatar`" :src="member.avatar" />
                      <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 8]">
                        {{ member.nickname }}
                      </q-tooltip>
                    </q-avatar>
                    <q-btn
                      class="remove-channel-member"
                      round
                      dense
                      size="xs"
                      color="negative"
                      icon="close"
                      :aria-label="`Remove ${member.nickname}`"
                      @click="removeChannelMember(member.nickname)"
                    />
                  </div>
                </div>
            </div>
            <div class="row justify-end q-mt-md">
              <q-btn
                color="positive"
                label="Create channel"
                :disable="!text_300.trim()"
                @click="createChannel"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
  </q-layout>
</template>
<script setup>
import { computed, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import ChatLink from '@/components/ChatLink.vue'
import ChannelLink from '@/components/ChannelLink.vue'
import MyProfile from '@/components/MyProfile.vue'
import Settings from '@/components/Settings.vue'
import { knownNicknames } from '@/knownNicknames.js'

const router = useRouter()
const text_200 = ref('')
const text_300 = ref('')
const dense = ref(false)
const text_400 = ref('')
const selectedChannelMembers = ref([])

const options_fill = ref(knownNicknames)

function filterFn (val, update) {
  update(() => {
    const needle = val.trim().toLowerCase()

    if (needle === '') {
      options_fill.value = []
      return
    }

    options_fill.value = knownNicknames
      .filter(v => v.toLowerCase().includes(needle))
      .slice(0, 50)
  })
}

function setModel (val) {
  text_400.value = val.slice(0, 67)
}

function setChatInput(val) {
  text_200.value = val.slice(0, 67)
}

function getAvatarUrl(nickname) {
  const nicknameIndex = knownNicknames.findIndex(
    (knownNickname) => knownNickname.toLowerCase() === nickname.toLowerCase(),
  )
  return `https://cdn.quasar.dev/img/avatar${(Math.max(nicknameIndex, 0) % 6) + 1}.jpg`
}

function addChannelMember () {
  const nickname = text_400.value.trim()
  if (!nickname) return

  if (!selectedChannelMembers.value.some(member => member.nickname === nickname)) {
    selectedChannelMembers.value.push({
      nickname,
      avatar: getAvatarUrl(nickname),
    })
  }

  text_400.value = ''
}

function removeChannelMember (nickname) {
  selectedChannelMembers.value = selectedChannelMembers.value.filter(
    member => member.nickname !== nickname,
  )
}

function addChat() {
  const nickname = text_200.value.trim().replace(/^@/, '')
  if (!nickname) return

  const routeName = nickname.toLowerCase()
  const existingChat = chatLinks.value.find(({ name, hasNickname, nickname: savedNickname }) => {
    const existingRouteName = hasNickname
      ? (savedNickname || name).trim().replace(/^@/, '')
      : name.trim()
    return existingRouteName.toLowerCase() === routeName
  })
  const chat = existingChat ?? {
    name: nickname,
    hasNickname: true,
    nickname: `@${nickname}`,
    avatar: getAvatarUrl(nickname),
    isOnline: 0,
    unreadCount: 0,
    new: true,
  }

  if (!existingChat) chatLinks.value.push(chat)

  tab.value = 'Direct Messages'
  addChatOpen.value = false
  text_200.value = ''
  router.push({ path: '/', query: { name: routeName } })
}

function createChannel() {
  const name = text_300.value.trim()
  if (!name) return

  const routeName = name.toLowerCase()
  const existingChannel = channelLinks.value.find(
    (channel) => channel.name.trim().toLowerCase() === routeName,
  )
  if (existingChannel) {
    tab.value = 'Channels'
    addChatOpen.value = false
    router.push({ path: '/', query: { channel: existingChannel.name } })
    return
  }

  const usersList = [
    { name: 'You', isOnline: 1, admin: true },
    ...selectedChannelMembers.value.map(({ nickname }) => ({
      name: nickname,
      isOnline: 0,
      admin: false,
    })),
  ]
  channelLinks.value.push({
    name,
    isPrivate: group.value === 'private',
    unreadCount: 0,
    onlineCount: 1,
    new: true,
    usersList,
  })

  tab.value = 'Channels'
  addChatOpen.value = false
  text_300.value = ''
  text_400.value = ''
  selectedChannelMembers.value = []
  group.value = 'public'
  router.push({ path: '/', query: { channel: name } })
}

const tab = ref('Direct Messages')
const chatLinks = ref([
  {
    name: 'Alex Morgan',
    hasNickname: true,
    nickname: 'alexmorgan',
    avatar: 'https://cdn.quasar.dev/img/avatar.png',
    isOnline: 1,
    unreadCount: 3,
    new: false, 
  },
  {
    name: 'Den Verstappen',
    hasNickname: true,
    nickname: 'KuniLina',
    avatar: 'https://img.redbull.com/images/c_crop,x_914,y_1637,h_3171,w_3171/c_fill,g_auto,w_308,h_308/q_auto:low,f_auto/redbullcom/2022/5/5/esxtfazwc5k0xntwv20i/max-verstappen-profile-pic',
    isOnline: -1,
    unreadCount: 0,
    new: false, 
  },
  {
    name: 'Leybron Jahames',
    hasNickname: true,
    nickname: 'LeybronJahames',
    avatar: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
    isOnline: 0,
    unreadCount: 0,
    new: true, 
  },
])

const sortedChatLinks = computed(() =>
  [...chatLinks.value].sort((first, second) => Number(second.new) - Number(first.new)),
)

const channelLinks = ref([
  {
    name: 'Design Team',
    isPrivate: true,
    unreadCount: 3,
    onlineCount: 5,
    new: false, 
    usersList: [
      { name: 'You', isOnline: 1, admin: true },
      { name: 'Alex Morgan', isOnline: 1, admin: false },
      { name: 'Den Verstappen', isOnline: -1, admin: false },
    ],
  },
  {
    name: 'Infinity Chat',
    isPrivate: false,
    unreadCount: 0,
    onlineCount: 0,
    new: false, 
    usersList: [
      { name: 'You', isOnline: 1, admin: true },
      { name: 'Den Verstappen', isOnline: -1, admin: false },
      { name: 'Leybron Jahames', isOnline: 0, admin: false },
      { name: 'Leybron Jahames', isOnline: 0, admin: false },
      { name: 'Leybron Jahames', isOnline: 0, admin: false },
      { name: 'Leybron Jahames', isOnline: 0, admin: false },
      { name: 'Leybron Jahames', isOnline: 0, admin: false },
      { name: 'Leybron Jahames', isOnline: 0, admin: false },
      { name: 'Leybron Jahames', isOnline: 0, admin: false },
      { name: 'Leybron Jahames', isOnline: 0, admin: false },
      { name: 'Leybron Jahames', isOnline: 0, admin: false },
    ],
  },
])

const sortedChannelLinks = computed(() =>
  [...channelLinks.value].sort((first, second) => Number(second.new) - Number(first.new)),
)

provide('channelLinks', channelLinks)
provide('chatLinks', chatLinks)

const leftDrawerOpen = ref(false)
const profileWindowOpen = ref(false)
const addChatOpen = ref(false)
const tab_addChat = ref('one')

function openAddChat() {
  addChatOpen.value = true
}

function clearChatUnread(chatName) {
  const chat = chatLinks.value.find(({ name }) => name === chatName)
  if (chat) {
    chat.unreadCount = 0
    chat.new = false
  }
}

function clearChannelUnread(channelName) {
  const channel = channelLinks.value.find(({ name }) => name === channelName)
  if (channel) {
    channel.unreadCount = 0
    channel.new = false
  }
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
const group = ref('public')
const options = [
  { label: 'Public',value: 'public', color: 'positive'},
  { label: 'Private',value: 'private', color: 'negative' },
]
</script>

<style scoped>
.nav_btns {
  display: flex;
  align-items: center;
  gap: 2px;
}

:deep(.profile-avatar) {
  width: clamp(32px, 8vw, 40px);
  height: clamp(32px, 8vw, 40px);
}
.channel-members-scroll {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.channel-members {
  display: flex;
  flex-wrap: nowrap;
  width: max-content;
  gap: 12px;
}

.selected-channel-member {
  position: relative;
  flex: 0 0 auto;
}

.remove-channel-member {
  position: absolute;
  top: -6px;
  right: -6px;
  z-index: 1;
}

.add-chat-card {
  width: 520px;
  max-width: 92vw;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgb(0 0 0 / 20%);
}

</style>
