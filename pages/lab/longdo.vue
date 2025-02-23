<template>
    <div>
        <!-- ปุ่มปักหมุด -->
        <button @click="addMarkerAtCenter" class="btn">
            ปักหมุดตรงกลางจอ
        </button>

        <div>
            <label for="" class="block">ค้นหาสถานที่ใกล้เคียง</label>

            <AutoComplete v-model="selectedCountry" forceSelection optionLabel="name" :suggestions="resLocation"
                @complete="search" @value-change="onLocationSearchSelect" dropdownicon="fa-regular fa-trash-can" class="custom-border" inputClass="custom-border">
    
                <template #option="slotProps" class="w-full">
                    <div class="flex flex-col p-2 border-b border-gray-200">
                        <span class="font-medium text-lg text-primary-main">{{ slotProps.option?.name }}</span>
                        <span class="text-sm text-gray-500">{{ slotProps.option?.address }}</span>
                    </div>
                </template>
            </AutoComplete>

        </div>
        <!-- แผนที่ Longdo Map -->
        <client-only>
            <div class="relative flex flex-col items-center h-[30rem]">
                <div id="map" class="map-container"></div>
            </div>
        </client-only>

        <!-- แสดงค่าพิกัด -->
        <div class="coordinates">
            <p><strong>Latitude:</strong> {{ selectedLat }}</p>
            <p><strong>Longitude:</strong> {{ selectedLon }}</p>
        </div>
        <div>
            <p>
                {{ selectedCountry }}
            </p>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

// เก็บค่าที่เลือกและผลลัพธ์การค้นหา
const selectedCountry = ref();
const resLocation = ref([]);

// แผนที่และค่าพิกัดที่เลือก
let map = null;
const selectedLat = ref(null);
const selectedLon = ref(null);

// ✅ เมื่อเลือกสถานที่จาก AutoComplete
const onLocationSearchSelect = (e) => {
    try {
        if (!e) {
          return  
        }
        if (e.lat && e.lon) {
            selectedLat.value = e.lat;
            selectedLon.value = e.lon;
            focusOnLocation(e.lat, e.lon);
        }
    } catch (error) {
        console.error("Error in selection:", error);
    }
};

// ✅ ฟังก์ชันค้นหาสถานที่จาก API
const search = async (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            resLocation.value = [];
        } else {
            if (event.query?.length >= 4) {
                const requestOptions = {
                    method: "GET",
                    redirect: "follow"
                };
                fetch(`https://search.longdo.com/mapsearch/json/search?keyword=${event.query}&limit=20&key=cffdefc2f61c2b38e32abe2c7b7e19cd`, requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        console.log("Search results:", result);
                        resLocation.value = result.data.map(item => ({
                            name: item.name,
                            address: item.address || "ไม่มีที่อยู่",
                            lat: item.lat,
                            lon: item.lon,
                            id: item.id
                        }));
                    })
                    .catch((error) => console.error(error));
            }
        }
    }, 250);
};

// ✅ โหลด Longdo Map API
const loadLongdoMap = () => {
    return new Promise((resolve, reject) => {
        if (window.longdo) {
            resolve(window.longdo);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://api.longdo.com/map3/?key=f38639d33e37f4e422cd8085d997d55f";
        script.async = true;
        script.onload = () => resolve(window.longdo);
        script.onerror = () => reject(new Error("Failed to load Longdo Map API"));
        document.head.appendChild(script);
    });
};

// ✅ สร้างแผนที่
const initMap = async () => {
    try {
        const longdo = await loadLongdoMap();
        const mapContainer = document.getElementById("map");

        if (!mapContainer) {
            console.error("Element #map not found");
            return;
        }

        map = new longdo.Map({
            placeholder: mapContainer,
            zoom: 12,
            location: { lat: 13.736717, lon: 100.523186 }, // Default Bangkok
        });
    } catch (error) {
        console.error("Error loading Longdo Map:", error);
    }
};


// ✅ โฟกัสแผนที่ไปยังพิกัดที่เลือก
const focusOnLocation = (lat, lon) => {
    if (!map) return;

    // ลบ Marker เก่าทั้งหมด
    clearMarkers

    // เพิ่ม Marker ใหม่
    const marker = new longdo.Marker(
        { lat, lon },
        {
            title: "ตำแหน่งที่เลือก",
            detail: `Lat: ${lat}, Lon: ${lon}`,
            icon: {
                url: "/image/pin_mark.png",
            },
        }
    );

    // เพิ่ม Marker ลงแผนที่
    map.Overlays.add(marker);

    // ตั้งค่ากล้องไปยังตำแหน่งที่เลือก
    map.location({ lat, lon }, true);
};


const addMarkerAtCenter = () => {
    if (!map) return;

    // ลบ Marker ทั้งหมดก่อน
    clearMarkers();

    // รับค่าพิกัดตรงกลางของแผนที่
    const center = map.location();

    // สร้าง Marker ใหม่
    const marker = new longdo.Marker(
        { lat: center.lat, lon: center.lon },
        {
            title: "ตำแหน่งตรงกลาง",
            detail: `Lat: ${center.lat}, Lon: ${center.lon}`,
            icon: {
                url: "/image/pin_mark.png", // ไอคอนที่กำหนดเอง
            },
        });

    // เพิ่ม Marker ลงแผนที่
    map.Overlays.add(marker);

    // อัปเดตค่าพิกัดที่เลือก
    selectedLat.value = center.lat;
    selectedLon.value = center.lon;
};
// ลบ Marker ทั้งหมด
const clearMarkers = () => {
    if (map) {
        map.Overlays.clear(); // ลบ Marker ทั้งหมดบนแผนที่
    }
};
// ✅ โหลดแผนที่เมื่อ DOM พร้อม
onMounted(() => {
    initMap();
});
</script>


<style scoped>
.map-container {
    width: 100%;
    /* height: 500px; */
    height: 50rem;
}
</style>