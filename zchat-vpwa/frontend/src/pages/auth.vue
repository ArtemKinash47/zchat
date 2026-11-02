<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div v-if="loading" class="text-center">
          <img :src="zchatLogo" class="loading-logo" alt="Zchat logo" />
          <q-spinner-pie size="60px" color="primary" />
          <div class="q-mt-md">Loading your chatz and channelz...</div>
        </div>

        <div v-else class="auth-box">
          <q-tabs
            v-model="tab"
            align="justify"
            narrow-indicator
            class="q-mb-md"
          >
            <q-tab class="text-accent" name="Sign In" label="Sign In" />
            <q-tab class="text-info" name="Registration" label="Registration" />
          </q-tabs>

          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="fade"
            transition-next="fade"
          >
            <q-tab-panel name="Sign In">
              <SignUp @submit="onAuth" />
            </q-tab-panel>

            <q-tab-panel name="Registration">
              <RegistrationForm @submit="onAuth" />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import RegistrationForm from '@/components/Registration.vue'
import SignUp from '@/components/Sign_up.vue'
import zchatLogo from '@/assets/zchat.png'

const router = useRouter()
const { login } = useAuth()
const tab = ref('Sign In')
const loading = ref(false)

async function onAuth() {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 1500))
  login()
  await router.push('/')
}
</script>

<style scoped>
.auth-box {
  width: 400px;
  max-width: 90vw;
}

.loading-logo {
  display: block;
  width: 160px;
  height: 160px;
  object-fit: contain;
  margin: 0 auto 16px;
}
</style>