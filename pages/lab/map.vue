<script setup>
import { ref, onMounted } from "vue";

const mapContainer = ref(null); // Reference to the map container DOM element
const map = ref(null);

onMounted(() => {
setTimeout(() => {
    
    if (typeof window !== "undefined" && window.longdo && mapContainer.value) {
    const longdo = window.longdo;
    map.value = new longdo.Map({
      placeholder: mapContainer.value, // Reference as placeholder
    });

    // Add event listeners for the map
    map.value.Event.bind("ready", () => {
      console.log("Map is ready!");

      // Define the marker positions
      const positions = [
        { lon: 100.56, lat: 13.74 },
        { lon: 100.57, lat: 13.75 },
      ];

      // Add markers to the map
      positions.forEach((position) => {
        const marker = new longdo.Marker(position);
        map.value.Overlays.add(marker);
      });
    });
  } else {
    console.error("Longdo Map SDK is not loaded or map container is not available!");
  }
  
}, 500);
});
</script>

<template>
  <div ref="mapContainer" style="width: 100%; height: 500px;"></div>
</template>
