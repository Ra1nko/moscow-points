<template>
  <div class="fill">
    <canvas ref="chartContainer" class="chart"></canvas>
    <ElButton class="button" type="primary" @click="$emit('generate-markers')">
      Сгенерировать маркеры
    </ElButton>
  </div>
</template>

<script setup>
import usePieChart from "@/services/usePieChart";
import { useMapStore } from "@/store/map";
import { ref } from "vue";

const chartContainer = ref(null);
const mapStore = useMapStore();

usePieChart(chartContainer, mapStore);

defineEmits(["generate-markers"]);
</script>

<style scoped>
.chart {
  max-width: 100%;
  max-height: calc(100% - 100px);
  object-fit: contain;
}

.button {
  margin-top: 50px;
}
</style>
