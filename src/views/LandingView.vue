<template>
  <div class="text-red-500">Landing View</div>
  <router-link :to="{ name: 'userLogin' }">
    <Button ghost>查看登入頁面</Button>
  </router-link>
  <router-link :to="{ name: 'showEcharts' }">
    <Button ghost>查看 ECharts 頁面</Button>
  </router-link>
</template>

<script setup lang="ts">
import {Button} from "tdesign-vue-next"
</script>

<style scoped>
</style>
