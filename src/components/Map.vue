<template>
  <div ref="mapContainer" class="fill"></div>
</template>

<script setup>
import useMap from "@/services/useMap";
import { useMapStore } from "@/store/map";
import "leaflet/dist/leaflet.css";
import { ref, watchEffect } from "vue";

const mapContainer = ref(null);
const mapStore = useMapStore();

const { districts, generateMarkers, onReady } = useMap(mapContainer);

onReady(() => generateMarkers(100));
watchEffect(() => (mapStore.districts = districts.value));

defineExpose({ generateMarkers });
</script>
