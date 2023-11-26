<template>
  <div class="h-screen bg-cover bg-center " style="background-image: url('/assets/ntnu_bg.png')">
    <div class="flex flex-col items-center justify-center h-full  backdrop-blur-sm">

      <div
          class="absolute inset-0 bg-opacity-30 font-electrolyte bg-gradient-to-bl from-black to-transparent bg-gradient-to-tl from-black to-transparent opacity-75"></div>
      <div class="w-1/3 rounded-md bg-opacity-40 rounded-3xl relative bg-black p-4">
        <router-link to="/" class="self-start">
          <Button theme="success" ghost>
            <template #icon>
              <ArrowLeftIcon />
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

        <Form ref="form" class="!p-4 !px-12 !pb-8" :data="loginForm" :colon="true" :label-width="0">
          <FormItem class="my-4" name="account">
            <Input v-model="loginForm.email" clearable placeholder="電子郵件">
              <template #prefix-icon>
                <MailIcon />
              </template>
            </Input>
          </FormItem>

          <FormItem name="password">
            <Input v-model="loginForm.password" type="password" clearable placeholder="密碼">
              <template #prefix-icon>
                <lock-on-icon />
              </template>
            </Input>
          </FormItem>

          <FormItem>
            <Button theme="success" type="submit" block @click="login">登入</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Button, Form, FormItem, Input, Message} from "tdesign-vue-next";
import { MailIcon, LockOnIcon, ArrowLeftIcon } from 'tdesign-icons-vue-next'
import {ref} from "vue";
const loginForm = ref({
  email: '',
  password: '',
})
</script>
<style scoped>
</style>