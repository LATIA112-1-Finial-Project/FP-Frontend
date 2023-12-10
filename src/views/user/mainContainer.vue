<template>
  <t-layout>
    <Sidebar/>
    <Content class="h-[calc(100vh-72px)] overflow-y-auto py-8 px-12">
      <div>Hi, this is Arxiv Page!</div>
    </Content>
  </t-layout>
</template>

<script setup lang="ts">
import {Content} from "tdesign-vue-next";
import Sidebar from "@/components/sidebar/arxiv.vue";
</script>

<style scoped>
</style>