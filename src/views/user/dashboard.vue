<template>
  <div class="box mt-4">
    <t-head-menu default-value="2-1" expand-type="popup">
      <template #logo>
        <div class="font-bold text-xl ml-8"> 大學排名與熱門領域討論站 </div>
      </template>
      <t-menu-item value="1">
        綜合討論區
      </t-menu-item>
      <t-submenu value="2" title="大學排名分析">
        <t-menu-item value="2-1"> 綜合分數 </t-menu-item>
        <t-menu-item value="2-2"> 學校聲望 </t-menu-item>
        <t-menu-item value="2-3"> 師資聲望 </t-menu-item>
      </t-submenu>
      <t-menu-item value="3">
        論文領域熱門分析
      </t-menu-item>
      <template #operations>
        <t-button variant="text" shape="square" class="mr-4">
          <template #icon><t-icon name="user" /></template>
        </t-button>
        <t-button variant="text" shape="square" class="mr-8">
          <template #icon><t-icon name="ellipsis" /></template>
        </t-button>
      </template>
    </t-head-menu>
  </div>
  <div class="ml-12">
    hi {{userInfo.username}}
  </div>
</template>

<script setup lang="ts" >
import {useAuthStore} from "@/stores/auth.ts";
import {onMounted} from "vue";
import { useFetch } from "@vueuse/core";

const authStore = useAuthStore();

const userInfo = authStore.userInfo

interface UserInfoResData {
  code: number;
  msg: string;
  data: string;
}

interface UserInfo {
  username: string;
  email: string;
}

// get user info from GET import.meta.env.VITE_API_ENDPOINT + /api/v1/user_info

const handleUserInfo = async () => {
  const { data } = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/user_info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userInfo.token}`
    }
  }).get().json<UserInfoResData>()
  if(data.value) {
    if (data.value.msg !== 'success') {
      return
    }
    const resData = data.value.data
    const userInfo: UserInfo = {
      username: resData.username,
      email: resData.email,
    }
    authStore.setUserInfo(userInfo)
  }
}

onMounted(() => {
  handleUserInfo()
})

</script>

<style scoped>
</style>