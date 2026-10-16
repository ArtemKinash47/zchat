<template>
  <q-item
    clickable
    :to="{
      path: '/',
      query: {
        channel: props.name,
      },
    }"
    @click="emit('clear-unread-channel', props.name)"
  >
    <q-item-section avatar>
      <div class="avatar-wrapper">
        <q-avatar size="40px" color="blue-grey-1" text-color="blue-grey-9">
          <img v-if="props.avatar" :src="props.avatar" :alt="`${props.name} avatar`" />
          <span v-else>{{ getInitial(props.name) }}</span>
        </q-avatar>

        <q-badge :color="props.onlineCount > 0 ? 'positive' : 'grey'" rounded class="online-badge">
          {{ props.onlineCount }}
        </q-badge>
      </div>
    </q-item-section>
    <q-item-section>
      <q-item-label class="row items-center q-gutter-xs" :class="{ 'text-accent': Dark.isActive }">
        <span>{{ props.name }}</span>
        <q-icon
          :name="props.isPrivate ? 'vpn_lock' : 'public'"
          :color="props.isPrivate ? 'negative' : 'positive'"
          size="18px"
        />
      </q-item-label>
      <q-item-label v-if="props.caption" caption class="text-grey-7">
        {{ props.caption }}
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
<style scoped>
.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.online-badge {
  position: absolute;
  right: -6px;
  bottom: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  justify-content: center;
  border: 2px solid white;
  font-size: 11px;
}
</style>
<script setup>
import { Dark } from 'quasar'
const emit = defineEmits(['clear-unread-channel'])

const props = defineProps({
  name: {
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

  isPrivate: {
    type: Boolean,
    default: false,
  },
  unreadCount: {
    type: Number,
    default: 0,
  },
  new: {
    type: Boolean,
    default: false,
  },
  onlineCount: {
    type: Number,
    default: 0,
  },
  usersList: {
    type: Array,
    default: () => [],
  },
})

function getInitial(name) {
  return name.trim().charAt(0).toUpperCase() || '?'
}
</script>
