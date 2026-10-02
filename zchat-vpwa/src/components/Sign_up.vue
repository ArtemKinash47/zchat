<template>
    <h1 class="reg-title">Sign In</h1>

     <q-input
      class="registration-input"
      clearable
      clear-icon="close"
      filled
      color="primary"
      v-model="text"
      label="Nickname"
    />
    <q-input
      class="registration-input"
      v-model="password"
      filled
      :type="isPwd ? 'password' : 'text'"
      hint="Confirm Password"
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
      class="reg-confirm-btn"
      color="primary"
      label="Sign In"
    />

</template>
<style scoped>
.reg-title {
  text-align: center;
  margin-bottom: 20px;
  color: orange;
  font-size: 48px;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
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
const password = ref('')
const isPwd = ref(true)
</script>