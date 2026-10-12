<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="auth-box">
          <div class="text-h5 text-center text-secondary q-mb-md">ZCHAT</div>

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

const router = useRouter()
const { login } = useAuth()
const tab = ref('Sign In')

function onAuth() {
  login()
  router.push('/')
}
</script>

<style scoped>
.auth-box { 
  width: 400px;
  max-width: 90vw;
}
</style>