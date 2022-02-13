import AOGeoJSON from "@/assets/geoJSON/ao.js";
import { breakNumber } from "@/utils";
import { generatePointsInPoly } from "@/api/worker-api";
import L from "leaflet";
import { computed, ref, toRaw, watch } from "vue";

const setupMap = (mapContainer) => {
  const districtLayers = [];
  const baseStyle = {
    weight: 1,
    color: "#0070DD",
    dashArray: "",
    fillOpacity: 0.1,
  };
  const onLayerHover = (e) =>
    e.target.setStyle({
      fillOpacity: 0.5,
    });
  const resetLayerStyle = (e) => e.target.setStyle(baseStyle);

  const tileLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }
  );

  const geoJSON = L.geoJSON(AOGeoJSON, {
    style: baseStyle,
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.ABBREV);
      districtLayers.push(layer);

      layer.on({
        mouseover: onLayerHover,
        mouseout: resetLayerStyle,
      });
    },
  });

  const map = L.map(mapContainer, {
    layers: [tileLayer, geoJSON],
  }).setView([55.7522, 37.6156], 10);

  return { map, districtLayers };
};

export const useMap = (mapContainer) => {
  const map = ref(null);
  const districtLayers = ref(null);

  const _onReady = ref(null);
  const _onLayerToggle = (event) => {
    const { target } = event;

    if (map.value.hasLayer(target)) {
      map.value.removeLayer(target);
    } else {
      map.value.addLayer(target);
    }
  };

  const generateMarkers = async (markersQty) => {
    districtLayers.value.forEach((district) => {
      if (district.markerGroup) {
        map.value.removeLayer(district.markerGroup);
      }
    });

    const pattern = breakNumber(markersQty, districtLayers.value.length).map(
      (item, index) => {
        return {
          layer: districtLayers.value[index],
          qty: item,
        };
      }
    );

    pattern.forEach(async (item) => {
      const points = await generatePointsInPoly(
        item.qty,
        toRaw(item.layer.feature)
      );
      const markers = points.map((point) => L.marker(point));
      const layerGroup = L.layerGroup(markers);

      layerGroup.on({
        toggle: _onLayerToggle,
      });

      item.layer.markerGroup = layerGroup;
      map.value.addLayer(layerGroup);
    });
  };

  const unwatch = watch(mapContainer, (value) => {
    if (value) {
      ({ map: map.value, districtLayers: districtLayers.value } = setupMap(
        mapContainer.value
      ));

      if (_onReady.value) {
        _onReady.value();
      }
      unwatch();
    }
  });

  const districts = computed(() => {
    if (districtLayers.value) {
      return districtLayers.value.map((district) => {
        return {
          district: district.feature.properties.ABBREV,
          markerGroup: district.markerGroup,
        };
      });
    }
  });

  const onReady = (cb) => {
    _onReady.value = () => cb();
  };

  return { map, districts, generateMarkers, onReady };
};

export default useMap;
