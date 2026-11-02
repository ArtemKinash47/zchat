<template>
  <q-dialog v-model="isOpen" :maximized="$q.screen.lt.sm">
    <q-card class="profile-card">
      <q-card-section class="row justify-end q-pb-none">
        <q-btn icon="close" flat round dense v-close-popup aria-label="Close profile" />
      </q-card-section>
      <q-card-section class="profile-fields column items-center">
        <q-avatar size="72px" color="primary" text-color="white">
          <img v-if="props.chatAvatar" :src="props.chatAvatar" :alt="`${props.chatName} avatar`" />
          <span v-else>{{ getInitial(props.chatName) }}</span>
        </q-avatar>
        <div class="text-h6 text-accent">{{ props.chatName || 'Profile' }}</div>
        <div v-if="props.chatType === 1 && props.chatNickname" class="text-caption text-grey-7">
          @{{ props.chatNickname }}
        </div>

        <div v-if="props.chatType === 2" class="members-section">
          <div class="q-pa-md">
              <q-option-group
                v-model="isPrivate"
                :options="privacyOptions"
                type="radio"
                inline
                disable
                aria-label="Channel visibility"
              />
          </div>
          <div class="text-secondary">Channel members</div>
          
          <q-list bordered separator class="members-list">
            <q-item
              v-for="(participant, index) in props.participants"
              :key="participant.id ?? index"
            >
              <q-item-section side>
                <q-badge :color="getStatusColor(participant.isOnline)" rounded />
              </q-item-section>
              <q-item-section>{{ participant.name }}</q-item-section>
              <q-item-section side>
                <q-badge v-if="participant.admin" color="primary" label="Admin" />
              </q-item-section>
              <q-btn class="justify-end" color="accent" label="0/3" flat icon="group_remove" />
            </q-item>
            <q-item v-if="props.participants.length === 0">
              <q-item-section class="text-grey">No members yet</q-item-section>
            </q-item>
          </q-list>
          <div class="row no-wrap q-gutter-sm q-mb-sm q-mt-sm">
            <q-input
              v-model="newMemberName"
              outlined
              dense
              maxlength="20"
              color="accent"
              class="col"
              label="New member name"
              @keydown.enter.prevent="addMember"
            />
            <q-btn
              color="primary"
              icon="person_add"
              aria-label="Add channel member"
              :disable="!newMemberName.trim()"
              @click="addMember"
            />
          </div>
        </div>
        <q-btn
          color="negative"
          :label="props.chatType === 1 ? 'Leave chat' : 'Leave channel'"
          v-close-popup
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const privacyOptions = [
  { label: 'Public', value: false, color: 'positive' },
  { label: 'Private', value: true, color: 'negative' },
]

function getStatusColor(isOnline) {
  if (isOnline === 1) return 'positive'
  if (isOnline === -1) return 'negative'
  return 'grey'
}

const emit = defineEmits(['add-member'])
const isOpen = defineModel({ type: Boolean, default: false })
const isPrivate = defineModel('isPrivate', { type: Boolean, default: false })
const newMemberName = ref('')
const props = defineProps({
  chatType: {
    type: Number,
    default: null,
  },
  chatAvatar: {
    type: String,
    default: '',
  },
  chatName: {
    type: String,
    default: '',
  },
  chatNickname: {
    type: String,
    default: '',
  },
  participants: {
    type: Array,
    default: () => [],
  },
})

function getInitial(name) {
  return name.trim().charAt(0).toUpperCase() || '?'
}

function addMember() {
  const name = newMemberName.value.trim()
  if (!name) return

  emit('add-member', name)
  newMemberName.value = ''
}
</script>

<style scoped>
.profile-input {
  width: 100%;
  max-width: 400px;
}

.profile-card {
  width: min(750px, 90vw);
  max-height: 90vh;
  overflow-y: auto;
}

.profile-fields {
  gap: 25px;
}

.members-section {
  width: 100%;
  max-width: 480px;
}

.members-list {
  max-height: 250px;
  overflow-y: auto;
}

@media (max-width: 599px) {
  .profile-card {
    width: 100%;
    max-width: 100%;
    max-height: 100dvh;
    border-radius: 0;
  }

  .profile-fields {
    gap: 16px;
    padding: 16px;
  }

  .profile-input {
    max-width: none;
  }
}
</style>
