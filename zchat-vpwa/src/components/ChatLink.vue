<template>
  <q-item
    clickable
    :to="{
      path: '/',
      query: {
        name: props.hasNickname ? deleteAt(props.nickname) || props.name : props.name,
      },
    }"
  >
    <q-item-section avatar>
      <q-avatar size="40px" color="blue-grey-1" text-color="blue-grey-9">
        <img v-if="props.avatar" :src="props.avatar" :alt="`${props.name} avatar`" />
        <span v-else>{{ getInitial(props.name) }}</span>
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.name}}</q-item-label>
      <q-item-label v-if="props.hasNickname" caption class="text-grey-7">
        {{ props.nickname || props.caption }}
      </q-item-label>
    </q-item-section>
    
    <q-item-section side>
      <q-badge :color="props.isOnline ? 'green' : 'primary'">
        {{ props.isOnline ? 'Online' : 'Offline' }}
      </q-badge>
    </q-item-section>

  </q-item>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    default: '',
  },

  hasNickname: {
    type: Boolean,
    default: false,
  },

  nickname: {
    type: String,
    default: '',
  },

  avatar: {
    type: String,
    default: '',
  },

  caption: {
    type: String,
    default: '',
  },

  isOnline: {
    type: Boolean,
    default: false,
  },
})

function getInitial(name) {
  return name.trim().charAt(0).toUpperCase() || '?'
}

function deleteAt(nick) {
  return nick.trim().replace(/^@/, '')
}
</script>
