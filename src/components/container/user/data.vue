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
          <Input v-model="resetUsernameForm.new_username" clearable placeholder="新使用者名稱">
            <template #prefix-icon>
              <User1Icon/>
            </template>
          </Input>
        </div>
        <div class="ml-4 ">
          <Button class="mx-2" size="medium" theme="primary" @click="cancelEditUsername">
            <template #icon>
              <CloseIcon/>
            </template>
            取消
          </Button>
          <Button size="medium" theme="danger" @click="confirmResetUsername">
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
    <t-dialog
        placement="center"
        header="確認修改名稱？"
        :visible="isPopupMessage"
        :on-confirm="onSubmitResetUsername"
        confirmBtn="確認"
        :on-close="cancelResetUsername"
        cancelBtn="取消"
    />
  </div>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import {ref} from "vue";
import {EditIcon, CheckIcon, CloseIcon, User1Icon} from "tdesign-icons-vue-next";
import {Button, Input, MessagePlugin} from "tdesign-vue-next";
import {useFetch} from "@vueuse/core";

const authStore = useAuthStore();
const idEditUsername = ref(false)

const handleEditUsername = () => {
  resetUsernameForm.value.new_username = authStore.userInfo.username
  idEditUsername.value = true
}

const cancelEditUsername = () => {
  idEditUsername.value = false
}

const isPopupMessage = ref(false)

const confirmResetUsername = () => {
  isPopupMessage.value = true
}

const cancelResetUsername = () => {
  isPopupMessage.value = false
}

interface ResetUsernameForm {
  old_username: string;
  new_username: string;
}

interface GeneralResData {
  code: number;
  msg: string;
  data: string;
}

const resetUsernameForm = ref<ResetUsernameForm>({
  old_username: authStore.userInfo.username,
  new_username: '',
})

const onSubmitResetUsername = async () => {
  if(resetUsernameForm.value.new_username === ''){
    await MessagePlugin.error('名稱不可為空')
    return
  }
  if(resetUsernameForm.value.new_username === resetUsernameForm.value.old_username){
    await MessagePlugin.error('不可與舊名稱相同')
    return
  }
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/reset_username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.userInfo.token}`
        },
        body: JSON.stringify(resetUsernameForm.value)
      },
      {
        updateDataOnError: true,
        onFetchError: (error) => {
          return error
        }
      }
  ).get().json<GeneralResData>()
  if (data.value) {
    if (data.value.msg === 'error') {
      if(data.value.data === 'Required missing'){
        await MessagePlugin.error('名稱不可為空')
        return
      }
      else if(data.value.data === 'New same as old'){
        await MessagePlugin.error('不可與舊名稱相同')
        return
      }
      await MessagePlugin.error("修改失敗，可能是連線逾時，請重新登入後重試")
      return
    }
    await MessagePlugin.success("修改成功")
    authStore.userInfo.username = resetUsernameForm.value.new_username
    resetUsernameForm.value = {
      old_username: authStore.userInfo.username,
      new_username: '',
    }
    idEditUsername.value = false
    isPopupMessage.value = false
  }
}
</script>

<style scoped>
</style>