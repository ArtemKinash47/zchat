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
        <q-btn color="positive" label="Save Changes" v-close-popup />
        <q-btn color="negative" label="Leave chat" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>


const isOpen = defineModel({ type: Boolean, default: false })

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
