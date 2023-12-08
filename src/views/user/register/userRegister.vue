<template>
  <div class="h-screen bg-cover bg-center " style="background-image: url('/assets/ntnu_bg.png')">
    <div class="flex flex-col items-center justify-center h-full  backdrop-blur-sm">

      <div
          class="absolute inset-0 bg-opacity-30 font-electrolyte bg-gradient-to-bl from-black to-transparent bg-gradient-to-tl from-black to-transparent opacity-75"></div>
      <div class="w-1/3 rounded-md bg-opacity-40 rounded-3xl relative bg-black p-4">
        <router-link to="/login" class="self-start">
          <Button theme="success" ghost>
            <template #icon>
              <ArrowLeftIcon />
            </template>
            上一頁
          </Button>
        </router-link>
        <div class="p-2 text-center text-4xl font-bold text-white">註冊</div>
        <div class="text-center text-white">請輸入您的電子郵件與密碼</div>

        <Form ref="form" class="!mt-8 !p-4 !px-12 !pb-8" :data="registerForm" :colon="true" :label-width="0">
          <FormItem class="my-4" name="username">
            <Input v-model="registerForm.username" clearable placeholder="使用者名稱">
              <template #prefix-icon>
                <User1Icon />
              </template>
            </Input>
          </FormItem>

          <FormItem class="my-4" name="email">
            <Input v-model="registerForm.email" clearable placeholder="電子郵件">
              <template #prefix-icon>
                <MailIcon />
              </template>
            </Input>
          </FormItem>

          <FormItem name="password">
            <Input v-model="registerForm.password" type="password" clearable placeholder="密碼">
              <template #prefix-icon>
                <lock-on-icon />
              </template>
            </Input>
          </FormItem>

          <FormItem name="password">
            <Input v-model="registerForm.chkPassword" type="password" clearable placeholder="確認密碼">
              <template #prefix-icon>
                <lock-on-icon />
              </template>
            </Input>
          </FormItem>

          <FormItem>
            <Button theme="success" type="submit" block @click="onSubmit">送出</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Button, Form, FormItem, Input, MessagePlugin} from "tdesign-vue-next";
import { MailIcon, LockOnIcon, ArrowLeftIcon, User1Icon } from 'tdesign-icons-vue-next'
import {ref} from "vue";
import { useFetch } from "@vueuse/core";
import { useRouter } from "vue-router"
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  chkPassword: '',
})

const router = useRouter()


interface RegisterResData {
  code: number;
  msg: string;
  data: string;
}

const onSubmit = async () => {
  if (registerForm.value.password !== registerForm.value.chkPassword) {
    await MessagePlugin.error('密碼不一致')
    return
  }
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: registerForm.value.username,
      email: registerForm.value.email,
      password: registerForm.value.password,
    })
  }).get().json<RegisterResData>()
  if (data.value) {
    if (data.value.msg === 'error') {
     await MessagePlugin.error('註冊失敗')
      return
    } else if (data.value.msg === 'duplicate') {
      await MessagePlugin.error('此帳號已被註冊')
      return
    }
    await MessagePlugin.success('註冊成功，請前往電子郵件進行驗證')
    await router.replace({name: 'userLogin'})
  }
}
</script>
<style scoped>
</style>
