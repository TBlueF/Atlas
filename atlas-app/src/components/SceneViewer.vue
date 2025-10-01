<script setup lang="ts">
  import { onMounted, useTemplateRef } from "vue";
  import { Stage, type SceneSettings } from "atlas";

  const props = defineProps<{ settings: SceneSettings }>();
  const containerElement = useTemplateRef<HTMLDivElement>('scene-container');

  onMounted(async () => {
    const stage = new Stage(props.settings);

    if (containerElement.value) {
      const container = containerElement.value;
      container.appendChild(stage.glRenderer.domElement);
      window.addEventListener("resize", () => {
        stage.glRenderer.setSize(container.clientWidth, container.clientHeight)
        stage.render(0);
      });
      stage.glRenderer.setSize(container.clientWidth, container.clientHeight)
    }

    await stage.initialize();
    stage.update(0);
    stage.render(0);
  });
</script>

<template>
  <div class="scene-viewer" ref="scene-container">
  </div>
</template>

<style scoped lang="scss">
  .scene-viewer {
    width: 100%;
    height: 100%;
  }
</style>