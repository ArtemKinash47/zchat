<template>
  <q-layout view="hHh LpR fFr">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="absolute-center"> ZCHAT </q-toolbar-title>

        <q-space />
        <div class="nav_btns">
          <q-btn round flat aria-label="Open profile" @click="profileWindowOpen = true">
            <q-avatar color="white" text-color="primary">
              JD
            </q-avatar>
          </q-btn>
          <Settings />
        </div>


      </q-toolbar>
    </q-header>
    
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>DIRECT MESSAGES</q-item-label>

        <ChatLink v-for="chat in chatLinks" :key="chat.name" v-bind="chat" />

        <q-item-label header>CHANNELS</q-item-label>

        <ChannelLink v-for="channel in channelLinks" :key="channel.name" v-bind="channel" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <MyProfile v-model="profileWindowOpen" />
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import ChatLink from '@/components/ChatLink.vue'
import ChannelLink from '@/components/ChannelLink.vue'
import MyProfile from '@/components/MyProfile.vue'
import Settings from '@/components/Settings.vue'

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
