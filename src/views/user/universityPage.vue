<template>
  <t-layout>
    <t-aside class="h-[calc(100vh-72px)]">
      <t-menu v-model="menuVal">
        <t-menu-item
            :key="1"
            :value="1"
            class="text-md font-semibold"
            @click="curComponent = universityChart"
        >
          <template #icon>
            <Flag1Icon />
          </template>
          學校各項排名圖表
        </t-menu-item>
        <t-menu-item
            :key="2"
            :value="2"
            class="text-md font-semibold"
            @click="curComponent = universityTable"
        >
          <template #icon>
            <ChartLineMultiIcon />
          </template>
          學校各項分數圖表
        </t-menu-item>
      </t-menu>
    </t-aside>
    <Content class="h-[calc(100vh-72px)] overflow-y-auto py-8 px-12 flex justify-center">
      <keep-alive>
        <component :is="curComponent" />
      </keep-alive>
    </Content>
  </t-layout>
</template>

<script setup lang="ts">
import {Content} from "tdesign-vue-next";
import {shallowRef} from "vue";
import universityChart from "@/components/container/top-university/chart.vue";
import universityTable from "@/components/container/top-university/table.vue";
import {ref} from "vue";
import {ChartLineMultiIcon, Flag1Icon} from "tdesign-icons-vue-next";

const menuVal = ref()
const curComponent = shallowRef(universityChart)
</script>

<style scoped>
</style>