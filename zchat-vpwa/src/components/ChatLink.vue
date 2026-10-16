<template>
  <q-item
    clickable
    :to="{
      path: '/',
      query: {
        name: props.hasNickname ? deleteAt(props.nickname) || props.name : props.name,
      },
    }"
    @click="emit('clear-unread', props.name)"
  >
    <q-item-section avatar>
      <div class="relative-position">
        <q-avatar size="40px" color="blue-grey-1" text-color="blue-grey-9">
          <img v-if="props.avatar" :src="props.avatar" :alt="`${props.name} avatar`"/>
          <span v-else>{{ getInitial(props.name) }}</span>
        </q-avatar>
        <q-badge :color="statusColor" rounded class="absolute-bottom-right"/>
      </div>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.name}}</q-item-label>
      <q-item-label v-if="props.hasNickname" caption class="text-grey-7">
        {{ props.nickname || props.caption }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-badge v-if="props.new" rounded color="accent" label="!" />
      <q-badge v-else-if="props.unreadCount > 0" rounded color="accent">
        {{ props.unreadCount }}
      </q-badge>
    </q-item-section>

  </q-item>
</template>

<script setup>
import { computed } from 'vue'
const emit = defineEmits(['clear-unread'])
const statusColor = computed(() => {
  if (props.isOnline === 1) return 'positive'
  if (props.isOnline === -1) return 'negative'
  return 'grey'
})
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
    type: Number,
    default: 0,
  },  

  unreadCount: {
    type: Number,
    default: 0,
  },
  new: {
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
