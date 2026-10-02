<template>
  <div class="q-pa-md">
    <q-btn flat round color="white" icon="settings" aria-label="Settings">
      <q-menu>
        <q-list role="menu">
          <q-item>
            <div class="q-pa-lg">
              <q-toggle v-model="lightMode" color="secondary" :label="lightMode ? 'Dark Mode' : 'Light Mode'" />
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

const lightMode = ref(true)

function onItemClick() {
  console.log('Clicked on an Item')
}
</script>

<style scoped>
  #logout:hover {
    color: red;
  }
</style>