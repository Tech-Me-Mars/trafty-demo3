<template>
    <div>
      <!-- Input Autocomplete -->
      <div class="search-box">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <AutoComplete
            v-model="searchQuery"
            :suggestions="places"
            @complete="searchPlaces"
            @item-select="selectPlace"
            field="display_name"
            placeholder="ค้นหาสถานที่..."
            class="p-inputtext"
          />
        </span>
      </div>
  
      <!-- แผนที่ Leaflet -->
      <LMap ref="mapRef" :zoom="zoom" :center="[lat, lon]" style="height: 500px; width: 100%;">
        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LMarker v-if="selectedLat && selectedLon" :lat-lng="[selectedLat, selectedLon]"></LMarker>
      </LMap>
  
      <div class="coordinates">
        <p><strong>Latitude:</strong> {{ selectedLat }}</p>
        <p><strong>Longitude:</strong> {{ selectedLon }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
//   import AutoComplete from "primevue/autocomplete";
  import axios from "axios";
  
  // กำหนดค่าตั้งต้น
  const zoom = ref(13);
  const lat = ref(13.736717); // Bangkok
  const lon = ref(100.523186);
  const selectedLat = ref(null);
  const selectedLon = ref(null);
  const searchQuery = ref("");
  const places = ref([]);
  
  // ฟังก์ชันค้นหาสถานที่ผ่าน Nominatim API
  const searchPlaces = async (event) => {
    if (!event.query) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${event.query}&limit=5`;
  
    try {
      const response = await axios.get(url);
      places.value = response.data.map((place) => ({
        display_name: place.display_name,
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
      }));
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };
  
  // ฟังก์ชันเมื่อผู้ใช้เลือกสถานที่
  const selectPlace = (event) => {
    selectedLat.value = event.value.lat;
    selectedLon.value = event.value.lon;
    lat.value = selectedLat.value;
    lon.value = selectedLon.value;
  };
  </script>
  
  <style scoped>
  .search-box {
    margin-bottom: 10px;
  }
  .p-inputtext {
    width: 100%;
    padding: 8px;
    font-size: 16px;
  }
  .coordinates {
    margin-top: 10px;
    font-size: 16px;
  }
  </style>
  