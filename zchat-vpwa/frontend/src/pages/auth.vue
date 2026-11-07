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
          <q-banner
            v-if="authError"
            class="q-mb-md text-center"
            rounded
            dense
            color="negative"
            text-color="primary"
          >
            {{ authError.toUpperCase() }}
          </q-banner>

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
const authError = ref('')

const API_URL = 'http://localhost:3333/api/v1'

async function onAuth(formData) {
  authError.value = ''
  loading.value = true

  try {
    const regSelected = tab.value === 'Registration'
    const response = await fetch(`${API_URL}/auth/${regSelected ? 'signup' : 'login'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        regSelected
          ? {
              firstName: formData.name,
              lastName: formData.surname,
              email: formData.email,
              nickname: formData.nickname,
              password: formData.password,
              passwordConfirmation: formData.passwordConf,
            }
          : {
              email: formData.email,
              password: formData.password,
            },
      ),
    })

    const result = await response.json()
    if (!response.ok) {
      if (!regSelected && response.status === 401) {
        throw new Error('invalid email or password.')
      }

      const message = result.message || result.errors?.[0]?.message
      throw new Error(message || `auth failed (${response.status}).`)
    }
    const payload = result.data ?? result
    if (!payload.token) throw new Error('missing token in server response.')
    localStorage.setItem('token', payload.token)
    login()
    await router.push('/')
  } catch (error) {
    console.error(error)
    authError.value =
      error instanceof TypeError
        ? 'could not connect to the server'
        : error.message
  } finally {
    loading.value = false
  }
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