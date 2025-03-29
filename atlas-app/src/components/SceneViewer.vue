<script setup lang="ts">
  import { onMounted, useTemplateRef } from "vue";
  import { Scene, type SceneSettings } from "atlas";

  const props = defineProps<{ settings: SceneSettings }>();
  const containerElement = useTemplateRef<HTMLDivElement>('scene-container');

  onMounted(async () => {
    const scene = new Scene(props.settings);

    if (containerElement.value) {
      const container = containerElement.value;
      container.appendChild(scene.glRenderer.domElement);
      window.addEventListener("resize", () => {
        scene.glRenderer.setSize(container.clientWidth, container.clientHeight)
        scene.render(0);
      });
      scene.glRenderer.setSize(container.clientWidth, container.clientHeight)
    }

    console.log("Initializing Scene...")
    await scene.initialize();
    console.log("Updating Scene...")
    scene.update(0);
    console.log("Rendering Scene...")
    scene.render(0);
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