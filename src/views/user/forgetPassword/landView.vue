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
        <div class="p-2 text-center text-4xl font-bold text-white">忘記密碼</div>
        <div class="text-center text-white">請輸入您註冊的電子郵件</div>
        <Form ref="form" class="!mt-8 !p-4 !px-12 !pb-8" :data="forgetForm" :colon="true" :label-width="0">
          <FormItem class="my-4" name="email">
            <Input v-model="forgetForm.email" clearable placeholder="電子郵件">
              <template #prefix-icon>
                <MailIcon/>
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
import {MailIcon, ArrowLeftIcon} from 'tdesign-icons-vue-next'
import {ref} from "vue";
import {useFetch} from "@vueuse/core";

const forgetForm = ref({
  email: '',
})


interface ForgetResData {
  code: number;
  msg: string;
  data: string;
}

const onSubmit = async () => {
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/forget_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: forgetForm.value.email,
        })
      },
      {
        updateDataOnError: true,
        onFetchError: (error) => {
          return error
        }
      }
  ).get().json<ForgetResData>()
  if (data.value) {
    if (data.value.msg === 'error') {
      if (data.value.data === 'Email not found') {
        await MessagePlugin.error('電子郵件不存在')
        return
      }
    }
    await MessagePlugin.success('寄送重設密碼連結成功，請前往電子郵件查看')
  }
}
</script>
<style scoped>
</style>
