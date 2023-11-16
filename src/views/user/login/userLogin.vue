<template>
  <div class="w-full h-full">
    <router-link to="/">
      <Button theme="danger">上一頁</Button>
    </router-link>
    <div class="text-blue-500">This is Login Page, and text is blue, because Tailwind is ready.</div>
  </div>
</template>
<script setup lang="ts">
import {Button} from "tdesign-vue-next";
</script>
<style scoped>
</style>
