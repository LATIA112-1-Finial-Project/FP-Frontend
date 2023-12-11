<template>
  <div class="w-4/5">
    <div class="font-semibold text-xl">
      登入與安全性
    </div>
    <t-divider class="border border-gray-300"/>
    <div class="flex-col">
      <div class="mb-4 font-semibold">
        修改密碼
      </div>
      <div v-if="idEditPassword==false" class="flex justify-between items-center">
        <div>
          <Button size="medium" theme="danger" @click="handleEditPassword">
            <template #icon>
              <EditIcon/>
            </template>
            編輯
          </Button>
        </div>
      </div>
      <div v-else class="flex-col justify-between items-center">
        <div class="flex-grow">
          <Input class="mb-4" v-model="resetPasswordForm.old_password" type="password" clearable placeholder="舊密碼">
            <template #prefix-icon>
              <LockOnIcon/>
            </template>
          </Input>
          <Input class="mb-4" v-model="resetPasswordForm.new_password" type="password" clearable placeholder="新密碼">
            <template #prefix-icon>
              <UserLockedIcon/>
            </template>
          </Input>
          <Input class="mb-6" v-model="resetPasswordForm.chk_new_password" type="password" clearable
                 placeholder="確認新密碼">
            <template #prefix-icon>
              <UserLockedIcon />
            </template>
          </Input>
        </div>
        <div>
          <Button class="mr-2" size="medium" theme="primary" @click="cancelEditUsername">
            <template #icon>
              <CloseIcon/>
            </template>
            取消
          </Button>
          <Button size="medium" theme="danger" @click="confirmResetPassword">
            <template #icon>
              <CheckIcon/>
            </template>
            確認
          </Button>
        </div>
      </div>
    </div>
    <t-dialog
        placement="center"
        header="確認修改密碼？"
        :visible="isPopupMessage"
        :on-confirm="onSubmitResetPassword"
        confirmBtn="確認"
        :on-close="cancelResetPassword"
        cancelBtn="取消"
    />
  </div>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import {ref} from "vue";
import {EditIcon, CheckIcon, CloseIcon, UserLockedIcon, LockOnIcon} from "tdesign-icons-vue-next";
import {Button, Input, MessagePlugin} from "tdesign-vue-next";
import {useFetch} from "@vueuse/core";
import {useRouter} from "vue-router";

const authStore = useAuthStore();
const idEditPassword = ref(false)
const afterPassword = ref(authStore.userInfo.username)
const router = useRouter()
const isSubmitting = ref(false)

const handleEditPassword = () => {
  afterPassword.value = authStore.userInfo.username
  idEditPassword.value = true
}

const cancelEditUsername = () => {
  idEditPassword.value = false
}

interface ResetPasswordForm {
  old_password: string;
  new_password: string;
  chk_new_password: string;
}

interface GeneralResData {
  code: number;
  msg: string;
  data: string;
}

const resetPasswordForm = ref<ResetPasswordForm>({
  old_password: '',
  new_password: '',
  chk_new_password: '',
})

const isPopupMessage = ref(false)

const confirmResetPassword = async () => {
  isPopupMessage.value = true
}

const cancelResetPassword = async () => {
  isPopupMessage.value = false
}

const onSubmitResetPassword = async () => {
  if (resetPasswordForm.value.new_password !== resetPasswordForm.value.chk_new_password) {
    await MessagePlugin.error('密碼與確認密碼不一致')
    isPopupMessage.value = false
    return
  }
  isSubmitting.value = true
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.userInfo.token}`
        },
        body: JSON.stringify(resetPasswordForm.value)
      },
      {
        updateDataOnError: true,
        onFetchError: (error) => {
          return error
        }
      }
  ).get().json<GeneralResData>()
  if(data.value){
    if(data.value.msg === 'error'){
      console.log(data.value.data)
      if(data.value.data === 'Required missing'){
        await MessagePlugin.error('請確認填寫完整資料')
        isPopupMessage.value = false
        return
      }
      else if(data.value.data === 'Not the same'){
        await MessagePlugin.error('密碼與確認密碼不一致')
        isPopupMessage.value = false
        return
      }
      else if(data.value.data === 'Old password is wrong'){
        await MessagePlugin.error('舊密碼錯誤')
        isPopupMessage.value = false
        return
      }
      else {
        await MessagePlugin.error('修改失敗，可能是連線逾時，請重新登入後重試')
        isPopupMessage.value = false
        return
      }

    }
    else {
      await MessagePlugin.success('修改成功，請重新登入')
      idEditPassword.value = false
      isPopupMessage.value = false
      resetPasswordForm.value = {
        old_password: '',
        new_password: '',
        chk_new_password: '',
      }
      await handleLogout()
      return
    }
  }
}

const handleLogout = async () => {
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).get().json<GeneralResData>()
  if (data.value) {
    if (data.value.msg !== 'success') {
      return
    }
    authStore.logout()
    await router.replace({name: 'userLogin'})
  }
}
</script>

<style scoped>
</style>