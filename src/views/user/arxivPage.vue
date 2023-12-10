<template>
  <t-layout>
    <t-aside class="h-[calc(100vh-72px)] overflow-y-auto">
      <t-menu v-model="menuVal">
        <t-menu-item
            :key="1"
            :value="1"
            class="text-md font-semibold"
            @click="curComponent = arxivChart"
        >
          <template #icon>
            <ChartLineMultiIcon />
          </template>
          綜合圖表
        </t-menu-item>
        <t-menu-item
            :key="2"
            :value="2"
            class="text-md font-semibold"
            @click="curComponent = arxivTable"
        >
          <template #icon>
            <TableIcon />
          </template>
          領域表單
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
import arxivChart from "@/components/container/arxiv/chart.vue";
import arxivTable from "@/components/container/arxiv/table.vue";
import {ref} from "vue";
import {ChartLineMultiIcon, TableIcon} from "tdesign-icons-vue-next";

const menuVal = ref()
const curComponent = shallowRef(arxivChart)
</script>

<style scoped>
</style>