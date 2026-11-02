<template>
  <q-dialog v-model="isOpen" :maximized="$q.screen.lt.sm">
    <q-card class="profile-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Profile</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup aria-label="Close profile" />
      </q-card-section>
      <q-card-section class="profile-fields column items-center">
        <q-avatar size="72px" color="primary" text-color="white">
          <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
        </q-avatar>
        <q-input
          v-model="name"
          clearable
          clear-icon="close"
          filled
          lazy-rules
          counter
          maxlength="20"
          :rules="[(val) => (val && val.trim().length >= 5) || 'Minimum 5 symbols']"
          color="secondary"
          label="Name"
          class="profile-input"
        />
        <q-input
          v-model="surname"
          clearable
          clear-icon="close"
          filled
          lazy-rules
          counter
          maxlength="20"
          :rules="[(val) => (val && val.trim().length >= 5) || 'Minimum 5 symbols']"
          color="secondary"
          label="Surname"
          class="profile-input"
        />
        <q-input
          v-model="nickname"
          clearable
          clear-icon="close"
          filled
          lazy-rules
          counter
          maxlength="20"
          :rules="[(val) => (val && val.trim().length >= 5) || 'Minimum 5 symbols']"
          color="secondary"
          label="Nickname"
          class="profile-input"
        />
        <q-input
          v-model="email"
          clearable
          clear-icon="close"
          filled
          lazy-rules
          counter
          maxlength="20"
          :rules="[(val) => (val && val.trim().length >= 5) || 'Minimum 5 symbols']"
          color="secondary"
          label="Email"
          type="email"
          class="profile-input"
        />
        <q-input
          v-model="password"
          filled
          lazy-rules
          counter
          maxlength="30"
          :rules="[(val) => (val && val.trim().length >= 5) || 'Minimum 5 symbols']"
          :type="isPwd ? 'password' : 'text'"
          hint="Enter your password to save changes"
          class="profile-input"
        >
        </q-input>
        <q-input
          v-model="passwordConf"
          filled
          lazy-rules
          counter
          maxlength="30"
          :rules="[(val) => (val && val.trim().length >= 5) || 'Minimum 5 symbols']"
          :type="isPwdConf ? 'password' : 'text'"
          hint="Confirm your password to save changes"
          class="profile-input"
        >
          <template #append>
            <q-icon
              :name="isPwdConf ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwdConf = !isPwdConf"
            />
          </template>
        </q-input>
        <q-btn color="positive" label="Save Changes" v-close-popup />
        <q-btn color="negative" label="Discard Changes" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = defineModel({ type: Boolean, default: false })

const name = ref('Josh')
const surname = ref('Giddey')
const nickname = ref('jd')
const email = ref('josh.giddey@example.com')
const password = ref('')
const passwordConf = ref('')
const isPwdConf = ref(true)
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
