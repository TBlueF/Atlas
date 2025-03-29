<script setup lang="ts">
  import SceneViewer from "./SceneViewer.vue";
  import ErrorBoundary from "./ErrorBoundary.vue";
</script>

<template>
  <ErrorBoundary>
    <SceneViewer v-bind:settings="{
      layers: [
          {
            type: 'bluemap:hires'
          }
      ]
    }"></SceneViewer>
  </ErrorBoundary>
</template>

<style scoped lang="scss">

</style>
