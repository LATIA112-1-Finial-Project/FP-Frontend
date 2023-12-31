<template>
  <t-layout>
    <t-header class="flex items-center h-[calc(72px)]">
      <t-head-menu default-value="2-1" expand-type="popup">
        <template #logo>
          <router-link :to="{name: 'showDashboard'}">
            <div class="font-bold text-xl ml-8" @click="pageVal=false"> 大學排名與熱門領域討論站</div>
          </router-link>
        </template>
        <t-menu-item value="2" @click="handleUniversityClick" class="text-md font-semibold">
          大學排名分析
        </t-menu-item>
        <t-menu-item value="3" @click="handleArxivClick" class="text-md font-semibold">
          論文領域熱門分析
        </t-menu-item>
        <template #operations>
          <t-button variant="text" shape="square" class="mr-4">
            <template #icon>
              <a href="https://github.com/LATIA112-1-Finial-Project" target="_blank">
                <LogoGithubIcon />
              </a>
            </template>
          </t-button>
          <t-button variant="text" shape="square" class="mr-4" @click="handleSettingClick">
            <template #icon>
              <router-link :to="{name: 'showSetting'}">
                <User1Icon />
              </router-link>
            </template>
          </t-button>
          <t-button variant="text" shape="square" class="mr-8" @click="handleLogout">
            <template #icon>
              <LogoutIcon/>
            </template>
          </t-button>
        </template>
      </t-head-menu>
    </t-header>
    <t-layout class="flex">
      <router-view v-if="pageVal">
      </router-view>
      <Content v-if="!pageVal"
               class="h-[calc(100vh-72px)] overflow-y-auto py-8 px-12 flex items-center justify-center flex-col">
        <t-card hover-shadow header-bordered
                class="flex items-center justify-center font-bold text-3xl w-2/3 h-2/3 rounded-3xl">
          <div>
            Hi, {{ authStore.userInfo.username }}
          </div>
          <div>
            歡迎來到大學排名與熱門領域討論站
          </div>
        </t-card>
      </Content>
    </t-layout>
  </t-layout>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import {onMounted, ref} from "vue";
import {useFetch} from "@vueuse/core";
import {User1Icon, LogoutIcon, LogoGithubIcon} from "tdesign-icons-vue-next";
import {MessagePlugin} from "tdesign-vue-next";
import {useRouter} from "vue-router";
import {Content} from "tdesign-vue-next";

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
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/user_info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userInfo.token}`
    }
  }).get().json<UserInfoResData>()
  if (data.value) {
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
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).get().json<generalResData>()
  if (data.value) {
    if (data.value.msg !== 'success') {
      return
    }
    await MessagePlugin.success("登出成功")
    authStore.logout()
    await router.replace({name: 'userLogin'})
  }
}

// click 綜合討論區 menu-item value = 1, router-view to /user/discussion
// click 大學排名分析 menu-item value = 2, router-view to /user/ranking
// click 論文領域熱門分析 menu-item value = 3, router-view to /user/arxiv


// use v-if to show router-view or default page (Content)
// pageVal = 1, router-view to /user/discussion
// pageVal = 2, router-view to /user/ranking
// pageVal = 3, router-view to /user/arxiv
const pageVal = ref(false)
const handleArxivClick = () => {
  pageVal.value = true
  router.push({name: 'showArxiv'})
}

const handleUniversityClick = () => {
  pageVal.value = true
  router.push({name: 'showTopUniversity'})
}

const handleSettingClick = () => {
  pageVal.value = true
  router.push({name: 'showSetting'})
}


// if no token, redirect to login page
if (!authStore.isLoggedIn) {
  router.replace({name: 'userLogin'})
}

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.replace({name: 'userLogin'})
  }
  handleUserInfo()
})

</script>

<style scoped>
</style>