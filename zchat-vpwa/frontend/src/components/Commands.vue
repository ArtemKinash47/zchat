<template>
    <q-item
    class="command-item q-pa-none"
    clickable
    v-ripple
    @click="emit('select', name)"
  >
    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
      <q-item-label caption>{{ info }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
    const emit = defineEmits(['select'])

    defineProps({
        name: {
            type: String,
            default: '',
        },
        info: {
            type: String,
            default: '',
        },
    })

   
</script>

<style scoped>
.command-item {
  margin: 0;
  padding-left: 8px;
  border-bottom: 1px solid var(--q-primary);
}

.command-item :deep(.q-item__section) {
min-width: 0;
overflow-wrap: anywhere;
}
</style>
