<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-yellow-400 px-6 relative">
    <!-- จุดตกแต่งด้านข้าง -->
    <div class="absolute right-2 top-16 space-y-2">
        <span class="block w-3 h-3 bg-yellow-300 rounded-full"></span>
        <span class="block w-3 h-3 bg-yellow-300 rounded-full"></span>
        <span class="block w-3 h-3 bg-yellow-300 rounded-full"></span>
        <span class="block w-3 h-3 bg-yellow-300 rounded-full"></span>
        <span class="block w-3 h-3 bg-yellow-300 rounded-full"></span>
    </div>
    <div class="absolute right-10 top-16 space-y-2">
        <span class="block w-3 h-3 bg-yellow-300 rounded-full"></span>
        <span class="block w-3 h-3 bg-yellow-300 rounded-full"></span>
        <span class="block w-3 h-3 bg-yellow-300 rounded-full"></span>
        <span class="block w-3 h-3 bg-yellow-300 rounded-full"></span>
        <span class="block w-3 h-3 bg-yellow-300 rounded-full"></span>
    </div>

    <!-- Card แจ้งเตือน -->
    <div class="bg-yellow-400 text-center max-w-sm w-full rounded-2xl px-6 py-10">
        <!-- ไอคอน Check -->
        <div class="bg-black text-white w-16 h-16 flex items-center justify-center rounded-full mx-auto">
            <i class="fa-solid fa-check text-3xl"></i>
        </div>

        <!-- หัวข้อ -->
        <h2 class="text-black font-bold text-xl mt-4">บันทึกข้อมูลแล้ว</h2>

        <!-- คำอธิบาย -->
        <p class="text-black text-sm mt-2 leading-relaxed">
            ตอนนี้คุณอยู่ในสถานะการรออนุมัติจากเจ้าหน้าที่ <br>
            หลังจากที่ได้รับการอนุมัติแล้ว <br>
            แหล่งท่องเที่ยวของคุณจะถูกแสดงในหน้าเว็บไซต์
        </p>

        <!-- ปุ่มตกลง -->
        <Button @click="navigateTo(`/vendor/register-business/success/${route.params.id}`)" class="w-full mt-10" style="color: white!important;" severity="contrast" label="ตกลง" />
   
        
    </div>
</div>

</template>

<script setup>
definePageMeta({
    middleware: ["auth"],
});
const route = useRoute();
</script>