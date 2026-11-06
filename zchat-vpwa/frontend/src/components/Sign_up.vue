<template>
    <h1 class="reg-title text-accent">Sign In</h1>
    <q-form @submit.prevent="onSubmit">
      <q-input
        class="registration-input"
        clearable
        clear-icon="close"
        filled
        lazy-rules
        autocomplete="email"
        counter
        maxlength="254"
        :rules="[
          (val) => !!val?.trim() || 'Email is required',
          (val) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Enter a valid email address',
        ]"
        color="accent"
        v-model="email"
        type="email"
        label="Email"
      />
      <q-input
        class="registration-input"
        v-model="password"
        filled
        lazy-rules
        autocomplete="current-password"
        counter
        maxlength="32"
        :rules="[(val) => !!val || 'Password is required']"
        color="accent"
        :type="isPwd ? 'password' : 'text'"
        label="Password"
      >
        <template #append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <q-btn
        type="submit"
        class="reg-confirm-btn"
        color="primary"
        text-color="white"
        label="Sign In"
      />
    </q-form>

</template>
<style scoped>
.reg-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 48px;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
}
.registration-logo {
  display: block;
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 0 auto 12px;
}
.registration-input {
  margin-bottom: 16px;
  margin-left: 32px;
  margin-right: 32px;
}
.reg-confirm-btn {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  size: 48px;
}
</style>
<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])
const email = ref('')
const password = ref('')
const isPwd = ref(true)

function onSubmit() {
  emit('submit', { email: email.value, password: password.value })
}
</script>