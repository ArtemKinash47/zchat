<template>
  <q-layout view="hHh LpR fFr">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="absolute-center"> ZCHAT </q-toolbar-title>
        <q-space />
        <div class="nav_btns">
          <q-btn round flat aria-label="Open profile" @click="profileWindowOpen = true">
            <q-avatar color="white" text-color="primary">JD</q-avatar>
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
          <q-tab class="text-orange" name="Direct Messages" label="Direct Messages" />
          <q-tab class="text-purple" name="Channels" label="Channels" />
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
                <ChatLink v-for="chat in chatLinks" :key="chat.name" v-bind="chat" />
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="Channels" class="q-pa-none">
              <q-list>
                <ChannelLink
                  v-for="channel in channelLinks"
                  :key="channel.name"
                  v-bind="channel"
                />
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>

        <q-separator />

        <div class="q-pa-md">
          <q-btn
            push
            color="positive"
            text-color="primary"
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
      <q-card style="min-width: 750px; height: 500px">
        <q-tabs v-model="tab_addChat" class="text-teal">
          <q-tab label="Add Chat" name="one" />
          <q-tab label="Create Channel" name="two" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab_addChat" animated>
          <q-tab-panel name="one">
            ewwrfraf
          </q-tab-panel>
          <q-tab-panel name="two">
            With so much content to display at once, and often so little screen
            real-estate, Cards have fast become the design pattern of choice for
            many companies, including the likes of Google and Twitter.
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
  </q-layout>
</template>
<script setup>
import { ref } from 'vue'
import ChatLink from '@/components/ChatLink.vue'
import ChannelLink from '@/components/ChannelLink.vue'
import MyProfile from '@/components/MyProfile.vue'
import Settings from '@/components/Settings.vue'
const tab = ref('Direct Messages')
const chatLinks = [
  {
    name: 'Alex Morgan',
    hasNickname: true,
    nickname: '@alexmorgan',
    avatar: 'https://cdn.quasar.dev/img/avatar.png',
    isOnline: 1,
    unreadCount: 3,
  },
  {
    name: 'John Rivera',
    nickname: '',
    isOnline: -1,
    unreadCount: 0,
  },
  {
    name: 'Marko Doe',
    nickname: '',
    isOnline: 0,
    unreadCount: 0,
  },
]

const channelLinks = [
  {
    name: 'Design Team',
    isPrivate: true,
    unreadCount: 3,
    onlineCount: 5,
  },
]

const leftDrawerOpen = ref(false)
const profileWindowOpen = ref(false)
const addChatOpen = ref(false)
const tab_addChat = ref('one')

function openAddChat() {
  addChatOpen.value = true
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>

.nav_btns {
  display: flex;
  align-items: center;
  gap: 15px;
}

</style>
