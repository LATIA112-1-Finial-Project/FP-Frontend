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
        <div class="text-center text-white">請輸入您的電子郵件</div>

        <Form ref="form" class="!mt-8 !p-4 !px-12 !pb-8" :data="registerForm" :colon="true" :label-width="0">

          <FormItem class="my-4" name="email">
            <Input v-model="registerForm.email" clearable placeholder="電子郵件">
              <template #prefix-icon>
                <MailIcon/>
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
import {MailIcon, ArrowLeftIcon} from 'tdesign-icons-vue-next'
import {ref} from "vue";
import {useFetch} from "@vueuse/core";

const registerForm = ref({
  email: '',
})

const isSubmitting = ref(false)

interface RegisterResData {
  code: number;
  msg: string;
  data: string;
}

const onSubmit = async () => {
  isSubmitting.value = true
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: registerForm.value.email,
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
        await MessagePlugin.error('請確認填寫電子郵件')
        isSubmitting.value = false
        return
      }
    } else if (data.value.msg === 'duplicate') {
      await MessagePlugin.error('此電子郵件已被註冊')
      isSubmitting.value = false
      return
    }
    await MessagePlugin.success('成功，請前往電子郵件進行下一步註冊')
    isSubmitting.value = false
  }
  isSubmitting.value = false
}
</script>
<style scoped>
</style>
