<template>
  <div class="w-4/5">
    <div class="font-semibold text-xl">
      你的帳號
    </div>
    <t-divider class="border border-gray-300"/>
    <div class="flex-col">
      <div class="mb-4 font-semibold">
        使用者名稱
      </div>
      <div v-if="idEditUsername==false" class="flex justify-between items-center">
        <div class="">
          {{ authStore.userInfo.username }}
        </div>
        <div class="ml-4 ">
          <Button size="medium" theme="danger" @click="handleEditUsername">
            <template #icon>
              <EditIcon/>
            </template>
            編輯
          </Button>
        </div>
      </div>
      <div v-else class="flex justify-between items-center">
        <div class="flex-grow">
          <Input v-model="afterUsername" clearable placeholder="使用者名稱">
            <template #prefix-icon>
              <User1Icon/>
            </template>
          </Input>
        </div>
        <div class="ml-4 ">
          <Button class="mx-2" size="medium" theme="primary" @click="cancelEditUsername">
            <template #icon>
              <CloseIcon />
            </template>
            取消
          </Button>
          <Button size="medium" theme="danger" @click="">
            <template #icon>
              <CheckIcon/>
            </template>
            確認
          </Button>
        </div>
      </div>
    </div>
    <t-divider class="border border-gray-300"/>
    <div class="flex-col">
      <div class="mb-4 font-semibold">
        電子郵件
      </div>
      <div class="flex justify-between items-center">
        <div class="">
          {{ authStore.userInfo.email }}
        </div>
        <div class="ml-4 ">
          <Button size="medium" theme="danger" disabled>
            <template #icon>
              <EditIcon/>
            </template>
            編輯
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import {ref} from "vue";
import {EditIcon, CheckIcon, CloseIcon, User1Icon} from "tdesign-icons-vue-next";
import {Button, Input} from "tdesign-vue-next";

const authStore = useAuthStore();
const idEditUsername = ref(false)
const afterUsername = ref(authStore.userInfo.username)

const handleEditUsername = () => {
  afterUsername.value = authStore.userInfo.username
  idEditUsername.value = true
}

const cancelEditUsername = () => {
  idEditUsername.value = false
}

</script>

<style scoped>
</style>