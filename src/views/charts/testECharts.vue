<template>
  <div class="w-full h-full">
    <router-link to="/">
      <Button theme="danger">上一頁</Button>
    </router-link>
    <div class="text-red-500">This is EChart Page. If you see the chart, that's fine.</div>
    <Test/>
  </div>
</template>
<script setup lang="ts">
import Test from '@/components/Test.vue'
import {Button} from "tdesign-vue-next";
</script>
<style scoped>
</style>
