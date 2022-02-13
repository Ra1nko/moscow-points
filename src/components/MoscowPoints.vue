<template>
  <ElRow align="middle" class="fill">
    <ElCol :span="12" class="fill block">
      <Map ref="map" />
    </ElCol>
    <ElCol :span="12" class="fill block">
      <Diagram @generate-markers="onGenerateMarkers" />
    </ElCol>
  </ElRow>
</template>

<script setup>
import { ref } from "vue";

const map = ref(null);

const onGenerateMarkers = () => {
  map.value.generateMarkers(100);
};
</script>

<style scoped>
.block {
  padding: 15px;
}
</style>
