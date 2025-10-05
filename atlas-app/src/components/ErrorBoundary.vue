<script setup lang="ts">
import { onErrorCaptured, ref } from "vue";

const error = ref();
const errorMessage = ref("");

onErrorCaptured((e, _, info) => {
  console.error(e, info);
  error.value = e;
  errorMessage.value = info;
  return false;
});
</script>

<template>
  <div v-if="error">{{ `${error} @ ${errorMessage}` }}</div>
  <slot v-else></slot>
</template>
