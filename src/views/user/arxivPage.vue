<template>
  <t-layout>
    <t-aside class="h-[calc(100vh-72px)] overflow-y-auto flex flex-col items-center">
      <t-menu v-model="menuVal" class="!h-[calc(100vh-120px)]">
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
      <Button v-if="!discussionVisible" @click="handleDiscussionOpen">
        <template #icon>
          <ChatBubble1Icon />
        </template>
        <span>開啟討論串</span>
      </Button>
      <Button v-else @click="handleDiscussionClose">
        <template #icon>
          <ChatBubble1Icon />
        </template>
        <span>關閉討論串</span>
      </Button>
    </t-aside>
    <Content class="h-[calc(100vh-72px)] overflow-y-auto py-8 px-12 flex justify-center">
      <keep-alive>
        <component :is="curComponent" />
      </keep-alive>
    </Content>
    <Drawer
        :preventScrollThrough="true"
        :closeOnOverlayClick="true"
        :showOverlay="true"
        :footer="false"
        size="medium"
        sizeDraggable
        v-model:visible="discussionVisible"
        header="熱門領域討論串"
    >
      <Content>
        <keep-alive>
          <component :is="curDiscussionComponent" />
        </keep-alive>
      </Content>
    </Drawer>
  </t-layout>
</template>

<script setup lang="ts">
import {Content, Drawer, Button} from "tdesign-vue-next";
import {shallowRef} from "vue";
import arxivChart from "@/components/container/arxiv/chart.vue";
import arxivTable from "@/components/container/arxiv/table.vue";
import {ref} from "vue";
import {ChartLineMultiIcon, TableIcon, ChatBubble1Icon} from "tdesign-icons-vue-next";
import discussionArxiv from "@/components/container/discussion/arxiv.vue";

const menuVal = ref()
const curComponent = shallowRef(arxivChart)
const curDiscussionComponent = shallowRef(discussionArxiv)
const discussionVisible = ref(false)

const handleDiscussionOpen = () => {
  discussionVisible.value = true
}

const handleDiscussionClose = () => {
  discussionVisible.value = false
}

</script>

<style scoped>
</style>