<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <!-- หัวข้อ -->
        <h1 class="text-2xl font-bold text-gray-800 ">{{ t('เข้าสู่ระบบ') }} {{ t('Smart Travel Safety') }}</h1>
        <p class="text-gray-500 mb-6">{{ t('เลือกประเภทผู้ใช้งานที่จะเข้าสู่ระบบ') }}</p>

        <!-- ปุ่มสำหรับการเลือกผู้ใช้งาน -->
        <div class="flex flex-col w-full gap-4">

            <Button :label="t('นักท่องเที่ยว')" severity="primary" type="button" rounded class="w-full" :pt="{
                root: {
                    class: '!border-primary-main'
                },
            }" @click="onTouristClick" />
            <Button :label="t('ผู้ประกอบการ')" severity="primary" type="button" rounded class="w-full" :pt="{
                root: {
                    class: '!border-primary-main'
                },
            }" @click="onShopClick" />
            <Button :label="t('เจ้าหน้าที่ตำรวจท่องเที่ยว')" severity="primary" type="button" rounded class="w-full" :pt="{
                root: {
                    class: '!border-primary-main'
                },
            }" @click="onAuditorClick" />
            <Button :label="t('กลับหน้าหลัก')" severity="primary" type="button" rounded outlined class="w-full" :pt="{
                root: {
                    class: '!border-primary-main'
                },
            }" @click="navigateTo('/')" />
        </div>
        <div class="mt-10">
            <p class="text-sm text-gray-500">
                {{ t('ยังไม่มีบัญชี') }}?
                <NuxtLink to="/auth/register" class="text-primary-main font-medium hover:underline">
                    {{ t('ลงทะเบียน') }}
                </NuxtLink>
            </p>
        </div>

        <MyToast :data="alertToast" />

    </div>
</template>

<script setup>
const alertToast = ref({});
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import * as dataApi from "./api/data.js";
localStorage.clear();
const onTouristClick = async () => {
    navigateTo('/auth/login-by-client')
    // try {
    //     const payload = {
    //         username: 'tourist',
    //         password: '1234'
    //     }
    //     const res = await dataApi.login(payload);
    //     localStorage.setItem("token", res.data.data.access_token);
    //     localStorage.setItem("role_id", res.data.data.user?.role_id);

    //     navigateTo('/')
    // } catch (error) {
    //     console.error(error)
    //     alertToast.value = {
    //         title: "ล้มเหลว",
    //         isError: true,
    //         color: "error",
    //         msg: error.response?.data?.message || "Error occurred",
    //         dataError: error,
    //     };
    // }
}

const onShopClick = async () => {
    try {
        const payload = {
            username: 'business',
            password: '1234'
        }
        const res = await dataApi.login(payload);
        localStorage.setItem("token", res.data.data.access_token);
        localStorage.setItem("role_id", res.data.data.user?.role_id);
        localStorage.setItem("name", res.data.data.user?.name);


        navigateTo('/vendor/my-business')
    } catch (error) {
        console.error(error)
        alertToast.value = {
            title: t("ล้มเหลว"),
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
    }
}

const onAuditorClick = async () => {
    try {
        const payload = {
            username: 'police',
            password: '1234'
        }
        const res = await dataApi.login(payload);
        await localStorage.setItem("token", res.data.data.access_token);
        await localStorage.setItem("role_id", res.data.data.user.role_id);
        await localStorage.setItem("name", res.data.data.user?.name);


        await navigateTo('/inspector/home')
    } catch (error) {
        console.error(error)
        alertToast.value = {
            title: t("ล้มเหลว"),
            isError: true,
            color: "error",
            msg: error.response?.data?.message || "Error occurred",
            dataError: error,
        };
    }
}
</script>