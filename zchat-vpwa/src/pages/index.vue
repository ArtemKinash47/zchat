<template>
  <q-layout view="hHh LpR fFr">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="absolute-center"> ZCHAT </q-toolbar-title>

        <q-space />
        <div class="nav_btns">
          <q-btn
            round
            flat
            aria-label="Open profile"
            @click="profileWindowOpen = true"
          >
            <q-avatar color="white" text-color="primary">JD</q-avatar>
          </q-btn>
          <q-btn flat round color="white" icon="settings">
          </q-btn>
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

const chatLinks = [
  {
    name: 'Alex Morgan',
    hasNickname: true,
    nickname: '@alexmorgan',
    avatar: 'https://cdn.quasar.dev/img/avatar.png',
    isOnline: true,
  },
  {
    name: 'John Rivera',
    nickname: '',
    isOnline: false,
  },
  {
    name: 'Marko Doe',
    nickname: '',
    isOnline: false,
  },
]

const channelLinks = [
  {
    name: 'Design Team',
    isPrivate: true,
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
