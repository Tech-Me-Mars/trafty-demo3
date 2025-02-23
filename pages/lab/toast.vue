<template>
    <div>
        dd
    </div>
    <MyToast :data="alertToast" />

</template>
<script setup>
const alertToast =ref({})
const load= async()=>{
    alertToast.value = {
            title: 'ล้มเหลว',
            isError: true,
            color: "error",
            msg: "error msg",
            dataError: null,
        };
}

onMounted(()=>{load()})
</script>