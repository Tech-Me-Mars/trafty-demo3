<template>
    <div>
        <div class="relative flex flex-col items-center h-[20rem]">
            <longdo-map class="h-full w-full" @load="getMap" />
            <!-- <button type="button"
                                class="absolute bottom-4 right-4 p-2 px-7 border border-black !text-xs bg-white"
                                @click="confirmLocation">
                                <i class="mdi mdi-map-marker-radius text-red-600"></i>ยืนยันตำแหน่ง
                            </button> -->
        </div>
        <!-- <longdo-map class="h-full w-full" v-else /> -->
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
LongdoMapLoad({
    apiKey: '1e7c1b91542a627c2f556824f98e9977',
})
import { LongdoMapLoad, LongdoMap, LongdoMapMarker, LongdoMapPolyline } from 'longdo-map-vue'


const countMarker = ref(0);
const map = ref(null);
function getMap(mapInstance) {
    map.value = mapInstance;
}

const showMap = ref(false);

const loadFindMapAll = async () => {

    try {
        showMap.value = false;
        showMap.value = true;
        countMarker.value = 1

        setTimeout(() => {
            initialCluster();
        }, 500);

    } catch (error) {
        countMarker.value = 0
        console.error(error);
    }
};

const resMap = ref([
    {
        lat: 13.269791277070857,
        lon: 100.92339428311003, title: "หาดวอนนภา",
        image: "https://lh5.googleusercontent.com/p/AF1QipNyZaoyWJsBjAcX-jQ-7sR_HRzzbuYSXnQqdcs=w408-h302-k-no",
        icon_map:"https://cdn-icons-png.flaticon.com/256/6395/6395499.png",
        distance:"30 km"
    },
    {
        lat: 13.312166376485363,
        lon: 101.02653075321774, title: "วัดป่าวชิรบรรพต",
        image: "https://mpics.mgronline.com/pics/Images/565000009880807.JPEG",
        icon_map:"https://cdn-icons-png.flaticon.com/512/4705/4705148.png",
        distance:"30 km"
    }
    , 
]);
function initialCluster() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "@/assets/css/MarkerCluster.Default.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "/js/longdomap.markercluster-src.js";
    script.id = "markercluster";
    document.head.appendChild(script);

    script.onload = () => {
        const longdo = window.longdo;
        let markercluster = new lmc.MarkerCluster(map.value, {});

        resMap.value?.forEach(item => {
            const detailHtml = `
<div style="
                display: flex; 
                align-items: center; 
                background: white; 
          

                width: 250px;
            ">
                <img src="${item.image}" 
                    alt="${item.title}" 
                    style="width: 100px; height: 85px; border-radius: 6px; object-fit: cover; margin-right: 10px;">
<div style="display: flex; flex-direction: column; align-items: flex-start; ">
    <div style="font-size: 14px; font-weight: bold; color: #333;">
        ${item.title}
    </div>
    <div style="font-size: 12px; color: red; margin-top: 5px;">
        ${item.distance}
    </div>
</div>
            </div>
            `;

            markercluster.addMarkers(
                new longdo.Marker(
                    { lat: item.lat, lon: item.lon },
                    {
                        icon: {
                            url: item.icon_map || 'https://cdn-icons-png.flaticon.com/512/6395/6395499.png',
                            offset: { x: 12, y: 45 },
                            size: { width: 45, height: 50 }
                        },
                        // title: item.title,
                        title: '',
                        detail: detailHtml,
                    }
                )
            );
        });

        markercluster.render();

        if (resMap.value?.option) {
            map.value.location({
                lon: resMap.value.option.center_long,
                lat: resMap.value.option.center_lat,
            });
            map.value.zoom(resMap.value?.option?.zoom || 13); // Set the zoom level to 13
        }
    };
}

onMounted(async () => {
    await loadFindMapAll();
});


</script>
<style>
.radio-green .ant-radio-inner {
    background-color: green !important;
    border-color: green !important;
}

.radio-yellow .ant-radio-inner {
    background-color: rgb(255, 174, 0) !important;
    border-color: rgb(255, 174, 0) !important;
}

.radio-default .ant-radio-inner {
    background-color: #d9d9d9;
    /* default color */
    border-color: #d9d9d9;
    /* default color */
}
</style>