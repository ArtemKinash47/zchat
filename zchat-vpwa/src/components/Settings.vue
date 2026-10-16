<template>
  <div>
    <q-btn flat round color="white" icon="settings" aria-label="Settings">
      <q-menu>
        <q-list role="menu">
          <q-item class="settings-item">
            <div class="q-pa-lg">
              <q-toggle
                :model-value="Dark.isActive"
                color="secondary"
                :label="Dark.isActive ? 'Dark Mode' : 'Light Mode'"
                @update:model-value="Dark.set"
              />
            </div>
          </q-item>
          <q-item class="settings-item">
            <div class="q-pa-md">
              <q-option-group
                :options="options"
                type="radio"
                v-model="group"
                style="display: flex"
              />
            </div>
          </q-item>
          <q-item class="settings-item">
            <div class="q-pa-lg">
              <p>Filter out messages regarding only you</p>
              <q-toggle
                v-model="direct"
                color="secondary"
                :label="direct ? 'Direct Messages Only' : 'All Messages'"
              />
            </div>
          </q-item>

          <q-item id="logout" v-close-popup @click="onItemClick">
            <q-item-section>
              <q-item-label>LOGOUT</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

import { Dark } from 'quasar'


const router = useRouter()
const group = ref('onl')
const { logout } = useAuth()
const direct = ref(false)
function onItemClick() {
  logout()
  router.push('/auth')
}


const options = [
  { label: 'Online', value: 'onl', color: 'positive'},
  { label: 'Offline', value: 'offl', color: 'grey'},
  { label: 'Do Not Disturb', value: 'dnd', color: 'negative' },
]
</script>

<style scoped>
.settings-item {
  margin-bottom: 6px;
}

#logout:hover {
  color: red;
}
</style>