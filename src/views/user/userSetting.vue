<template>
  <t-layout>
    <t-aside class="h-[calc(100vh-72px)] overflow-y-auto">
      <t-menu v-model="menuVal">
        <t-menu-item
            :key="1"
            :value="1"
            class="text-md font-semibold"
            @click="curSettingComponent = userData"
        >
          <template #icon>
            <UserCircleIcon />
          </template>
          你的帳號
        </t-menu-item>
        <t-menu-item
            :key="2"
            :value="2"
            class="text-md font-semibold"
            @click="curSettingComponent = userSecurity"
        >
          <template #icon>
            <LockOnIcon />
          </template>
          登入與安全性
        </t-menu-item>
      </t-menu>
    </t-aside>
    <Content class="h-[calc(100vh-72px)] overflow-y-auto py-8 px-12 flex-col">
      <keep-alive>
        <component :is="curSettingComponent"/>
      </keep-alive>
    </Content>
  </t-layout>

</template>

<script setup lang="ts">

import {Content} from "tdesign-vue-next";
import userData from "@/components/container/user/data.vue";
import userSecurity from "@/components/container/user/security.vue";
import {UserCircleIcon, LockOnIcon} from "tdesign-icons-vue-next";
import {ref, shallowRef} from "vue";
const menuVal = ref()
const curSettingComponent = shallowRef(userData)
</script>

<style scoped>
</style>