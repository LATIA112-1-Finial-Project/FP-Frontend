<template>
  <div class="h-screen bg-cover bg-center " style="background-image: url('/assets/ntnu_bg.png')">
    <div class="flex flex-col items-center justify-center h-full  backdrop-blur-sm">
      <div
          class="absolute inset-0 bg-opacity-30 font-electrolyte bg-gradient-to-bl from-black to-transparent bg-gradient-to-tl from-black to-transparent opacity-75"></div>
      <div class="w-1/3 rounded-md bg-opacity-40 rounded-3xl relative bg-black p-4">
        <router-link to="/" class="self-start">
          <Button theme="success" ghost>
            <template #icon>
              <ArrowLeftIcon/>
            </template>
            上一頁
          </Button>
        </router-link>
        <div class="p-2 text-center text-4xl font-bold text-white">登入</div>
        <div class="text-center text-white">請輸入您的電子郵件與密碼</div>
        <div class="flex items-center justify-center mt-4">
          <div class="mr-4 text-white">沒有帳號嗎？</div>
          <router-link to="/register" class="text-blue-500 hover:underline">
            註冊帳號
          </router-link>
        </div>

        <Form ref="form" class="!p-4 !px-12 !pb-2" :data="loginForm" :colon="true" :label-width="0">
          <FormItem class="my-4" name="account">
            <Input v-model="loginForm.email" clearable placeholder="電子郵件">
              <template #prefix-icon>
                <MailIcon/>
              </template>
            </Input>
          </FormItem>

          <FormItem name="password">
            <Input v-model="loginForm.password" type="password" clearable placeholder="密碼">
              <template #prefix-icon>
                <lock-on-icon/>
              </template>
            </Input>
          </FormItem>

          <FormItem>
            <Button theme="success" type="submit" block @click="onSubmit" v-loading="isSubmitting" :disabled="isSubmitting">登入</Button>
          </FormItem>
        </Form>

        <div class="flex items-center justify-center mt-4 pb-4">
          <div class="mr-4 text-white">忘記密碼嗎？</div>
          <router-link to="/forgetPassword" class="text-blue-500 hover:underline">
            忘記密碼
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Button, Form, FormItem, Input, MessagePlugin} from "tdesign-vue-next";
import {MailIcon, LockOnIcon, ArrowLeftIcon} from 'tdesign-icons-vue-next'
import {ref} from "vue";
import {useAuthStore} from "@/stores/auth";
import {useFetch} from "@vueuse/core";
import {useRouter} from "vue-router"
import {UserInfoFromLogin} from "@/apiModel/user/types";

const authStore = useAuthStore();
const loginForm = ref({
  email: ref(import.meta.env.VITE_USER_NAME),
  password: ref(import.meta.env.VITE_USER_PASSWORD),
})

const isLogin = ref(false)

const router = useRouter();

const isSubmitting = ref(false)


interface AuthData {
  token: string;
  type: string;
  detail: string;
}

interface LoginResData {
  code: number;
  msg: string;
  data: AuthData;
}

const onSubmit = async () => {
  isSubmitting.value = true
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm.value),
      },
      {
        updateDataOnError: true,
        onFetchError: (error) => {
          return error
        }
      }
  ).get().json<LoginResData>()
  if (data.value) {
    if (data.value.msg === 'error') {
      await MessagePlugin.error("登入失敗，請檢查帳號密碼是否正確")
      isSubmitting.value = false
      return
    }
    // not_confirmed
    if (data.value.msg === 'not_confirmed') {
      await MessagePlugin.error("電子郵件尚未驗證")
      isSubmitting.value = false
      return
    }
    else if (data.value.msg === 'not_confirmed') {
      await MessagePlugin.success(data.value.msg)
      isSubmitting.value = false
      return
    }
    const resData = data.value.data
    const userInfo = {
      token: resData.token,
      email: loginForm.value.email,
    } as UserInfoFromLogin
    authStore.setUserInfoFromLogin(userInfo)
    await MessagePlugin.success("登入成功")
    if (authStore.isLoggedIn) loginAfter()
  }
}

const loginAfter = () => {
  isLogin.value = true
  isSubmitting.value = false
  router.replace({name: 'showDashboard'})
}
</script>
<style scoped>
</style>
