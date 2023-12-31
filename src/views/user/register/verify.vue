<template>
  <div class="h-screen bg-cover bg-center " style="background-image: url('/assets/ntnu_bg.png')">
    <div class="flex flex-col items-center justify-center h-full  backdrop-blur-sm">

      <div
          class="absolute inset-0 bg-opacity-30 font-electrolyte bg-gradient-to-bl from-black to-transparent bg-gradient-to-tl from-black to-transparent opacity-75"></div>
      <div class="w-1/3 rounded-md bg-opacity-40 rounded-3xl relative bg-black p-4">
        <router-link to="/login" class="self-start">
          <Button theme="success" ghost>
            <template #icon>
              <ArrowLeftIcon/>
            </template>
            上一頁
          </Button>
        </router-link>
        <div class="p-2 text-center text-4xl font-bold text-white">註冊</div>
        <div class="text-center text-white">請輸入您的使用者名稱與密碼</div>

        <Form ref="form" class="!mt-8 !p-4 !px-12 !pb-8" :data="registerForm" :colon="true" :label-width="0">
          <FormItem class="my-4" name="username">
            <Input v-model="registerForm.username" clearable placeholder="使用者名稱">
              <template #prefix-icon>
                <User1Icon/>
              </template>
            </Input>
          </FormItem>

          <FormItem name="password">
            <Input v-model="registerForm.password" type="password" clearable placeholder="密碼">
              <template #prefix-icon>
                <lock-on-icon/>
              </template>
            </Input>
          </FormItem>

          <FormItem name="password">
            <Input v-model="registerForm.chkPassword" type="password" clearable placeholder="確認密碼">
              <template #prefix-icon>
                <lock-on-icon/>
              </template>
            </Input>
          </FormItem>

          <FormItem>
            <Button theme="success" type="submit" block @click="onSubmit" v-loading="isSubmitting" :disabled="isSubmitting" >送出</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Button, Form, FormItem, Input, MessagePlugin} from "tdesign-vue-next";
import {LockOnIcon, ArrowLeftIcon, User1Icon} from 'tdesign-icons-vue-next'
import {onMounted, ref} from "vue";
import {useFetch} from "@vueuse/core";
import {useRouter} from "vue-router"

const registerForm = ref({
  username: '',
  password: '',
  chkPassword: '',
})

const router = useRouter()
const isSubmitting = ref(false)
const url = window.location
const access_token = ref('')

interface RegisterResData {
  code: number;
  msg: string;
  data: string;
}

const onSubmit = async () => {
  isSubmitting.value = true
  if (registerForm.value.password !== registerForm.value.chkPassword) {
    await MessagePlugin.error('密碼不一致')
    isSubmitting.value = false
    return
  }
  if (registerForm.value.username === '' || registerForm.value.password === '' || registerForm.value.chkPassword === '') {
    await MessagePlugin.error('請確認填寫完整資料')
    isSubmitting.value = false
    return
  }
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/confirm_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': access_token.value
        },
        body: JSON.stringify({
          username: registerForm.value.username,
          password: registerForm.value.password,
          chk_password: registerForm.value.chkPassword,
        })
      },
      {
        updateDataOnError: true,
        onFetchError: (error) => {
          return error
        }
      }
  ).get().json<RegisterResData>()
  if (data.value) {
    if (data.value.msg === 'error') {
      if (data.value.data === 'Required missing') {
        await MessagePlugin.error('請確認填寫完整資料')
        isSubmitting.value = false
        return
      }
      else if (data.value.data === 'Not the same') {
        await MessagePlugin.error('密碼與確認密碼不一致')
        isSubmitting.value = false
      }
      isSubmitting.value = false
      return
    } else if (data.value.msg === 'duplicate') {
      await MessagePlugin.error('此帳號名稱或電子郵件已被註冊')
      isSubmitting.value = false
      return
    } else if (data.value.msg === 'expired') {
      await MessagePlugin.error('驗證過期或無效驗證，請重新註冊並於 10 分鐘內驗證完成')
      isSubmitting.value = false
      await router.replace({name: 'userRegister'})
      return
    }
    await MessagePlugin.success('註冊成功，請登入')
    isSubmitting.value = false
    await router.replace({name: 'userLogin'})
  }
  isSubmitting.value = false
}

onMounted(() => {
  access_token.value = `${new URLSearchParams(url.search).get("token")}`
})
</script>
<style scoped>
</style>
