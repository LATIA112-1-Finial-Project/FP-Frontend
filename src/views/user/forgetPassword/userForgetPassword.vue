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
        <div class="p-2 text-center text-4xl font-bold text-white">重設密碼</div>
        <div class="text-center text-white">請輸入您的密碼與確認密碼</div>

        <Form ref="form" class="!mt-8 !p-4 !px-12 !pb-8" :data="forgetPasswordForm" :colon="true" :label-width="0">
          <FormItem name="password">
            <Input v-model="forgetPasswordForm.password" type="password" clearable placeholder="密碼">
              <template #prefix-icon>
                <lock-on-icon/>
              </template>
            </Input>
          </FormItem>

          <FormItem name="password">
            <Input v-model="forgetPasswordForm.chkPassword" type="password" clearable placeholder="確認密碼">
              <template #prefix-icon>
                <lock-on-icon/>
              </template>
            </Input>
          </FormItem>

          <FormItem>
            <Button theme="success" type="submit" block @click="onSubmit" v-loading="isSubmitting" :disabled="isSubmitting">送出</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Button, Form, FormItem, Input, MessagePlugin} from "tdesign-vue-next";
import {LockOnIcon, ArrowLeftIcon} from 'tdesign-icons-vue-next'
import {ref} from "vue";
import {useFetch} from "@vueuse/core";
import {useRouter} from "vue-router"

const forgetPasswordForm = ref({
  password: '',
  chkPassword: '',
  token: '',
})

const isSubmitting = ref(false)

const router = useRouter()
const url = window.location;

const access_token = new URLSearchParams(url.search).get("token")
if (access_token){
  forgetPasswordForm.value.token = access_token
}

interface ForgetPasswordResData {
  code: number;
  msg: string;
  data: string;
}

const onSubmit = async () => {
  isSubmitting.value = true
  if (!access_token){
    await MessagePlugin.error('驗證過期或無效驗證，請重新忘記密碼')
    await router.replace({name: 'userForgetPassword'})
    isSubmitting.value = false
    return
  }
  if (forgetPasswordForm.value.password !== forgetPasswordForm.value.chkPassword) {
    await MessagePlugin.error('密碼與確認密碼不一致')
    isSubmitting.value = false
    return
  }
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/forget_password_confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: forgetPasswordForm.value.token,
          password: forgetPasswordForm.value.password,
          chk_password: forgetPasswordForm.value.chkPassword,
        })
      },
      {
        updateDataOnError: true,
        onFetchError: (error) => {
          return error
        }
      }
  ).get().json<ForgetPasswordResData>()
  if (data.value) {
    if (data.value.msg === 'error') {
      if (data.value.data === 'Required missing') {
        await MessagePlugin.error('請確認填寫完整資料')
        isSubmitting.value = false
        return
      }
      else if (data.value.data === 'Not the same') {
        await MessagePlugin.error('密碼與確認密碼不一致')
      }
      isSubmitting.value = false
      return
    } else if (data.value.msg === 'New same as old') {
      await MessagePlugin.error('不可與過去的密碼相同')
      isSubmitting.value = false
      return
    }
    await MessagePlugin.success('重設成功，請重新登入')
    isSubmitting.value = false
    await router.replace({name: 'userLogin'})
  }
  isSubmitting.value = false
}
</script>
<style scoped>
</style>
