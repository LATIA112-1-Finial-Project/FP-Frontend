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
          <template #icon><User1Icon /></template>
        </t-button>
        <t-button variant="text" shape="square" class="mr-8" @click="handleLogout">
          <template #icon><LogoutIcon /></template>
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
import {User1Icon, LogoutIcon} from "tdesign-icons-vue-next";
import {MessagePlugin} from "tdesign-vue-next";
import {useRouter} from "vue-router";

const authStore = useAuthStore();

const userInfo = authStore.userInfo

const router = useRouter()

interface UserInfoResData {
  code: number;
  msg: string;
  data: string;
}

interface generalResData {
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


const handleLogout = async () => {
  const { data } = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).get().json<generalResData>()
  if(data.value) {
    if (data.value.msg !== 'success') {
      return
    }
    await MessagePlugin.success("登出成功")
    authStore.logout()
    await router.replace({name: 'userLogin'})
  }
}

// if no token, redirect to login page
if (!authStore.isLoggedIn) {
  router.replace({name: 'userLogin'})
}

onMounted(() => {
  if(!authStore.isLoggedIn){
    router.replace({name: 'userLogin'})
  }
  handleUserInfo()
})

</script>

<style scoped>
</style>