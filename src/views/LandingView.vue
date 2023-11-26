<template>
  <div class="h-screen bg-cover bg-center " style="background-image: url('/assets/ntnu_bg.png')">
    <div class="flex flex-col items-center justify-center h-full  backdrop-blur-sm">
      <div class="absolute inset-0 bg-opacity-30 font-electrolyte bg-gradient-to-bl from-black to-transparent bg-gradient-to-tl from-black to-transparent opacity-75"></div>
      <div class="flex flex-col items-center justify-center w-1/2 h-1/2 p-8 bg-opacity-5 rounded-3xl relative z-10 bg-black">
        <div class="text-6xl text-white">LATIA 112-1 期末專題</div>
        <div class="text-6xl text-white my-8 mb-20">大學排名與熱門領域討論站</div>
        <router-link :to="{ name: 'userLogin' }">
          <Button theme="success" shape="round" class="flex items-center">
            <template #icon>
              <div class="ml-2 mr-4">點我開始</div>
              <ArrowRightIcon size="1.5em"/>
            </template>
          </Button>

        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Button} from "tdesign-vue-next"
import {ArrowRightIcon} from "tdesign-icons-vue-next"
</script>

<style scoped>
.t-button{
  height: var(--td-size-14);
  font-size: var(--td-size-7);
}

</style>
