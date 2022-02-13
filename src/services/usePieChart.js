import {
  ArcElement, Chart, Legend, PieController, Title,
  Tooltip
} from "chart.js";
import { computed, watch } from "vue";

Chart.register(PieController, ArcElement, Legend, Title, Tooltip);

const chartInitialdata = {
  labels: [],
  datasets: [
    {
      label: "АО Москвы",
      data: [],
      backgroundColor: [
        "#C41E3A",
        "#A330C9",
        "#FF7C0A",
        "#AAD372",
        "#3FC7EB",
        "#00FF98",
        "#F48CBA",
        "#FFFFFF",
        "#FFF468",
        "#0070DD",
        "#8788EE",
        "#C69B6D",
      ],
      hoverOffset: 4,
    },
  ],
};

export const usePieChart = (chartContainer, mapStore) => {
  let pieChart = null;

  const chartLabels = computed(() => {
    if (mapStore.districts) {
      return mapStore.districts.map((item) => item.district);
    }

    return [];
  });

  const chartData = computed(() => {
    if (mapStore.districts) {
      return mapStore.districts.map(
        (item) => item.markerGroup?.getLayers().length
      );
    }

    return [];
  });

  const unwatch = watch(chartContainer, (value) => {
    if (value) {
      pieChart = new Chart(chartContainer.value, {
        type: "pie",
        data: chartInitialdata,
        options: {
          responsive: true,
          onClick: (e, elements) => {
            const segment = elements[0];
            if (segment) {
              const district = mapStore.districts.find(
                (item) => item.district === pieChart.data.labels[segment.index]
              );
              district.markerGroup.fire("toggle");
            }
          },
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "АО Москвы",
            },
            tooltip: {
              boxPadding: 4,
            },
          },
        },
      });

      unwatch();
    }
  });

  watch([chartLabels, chartData], () => {
    pieChart.data.labels = chartLabels.value;
    pieChart.data.datasets.forEach((dataset) => {
      dataset.data = chartData.value;
    });
    pieChart.update();
  });
};

export default usePieChart;
