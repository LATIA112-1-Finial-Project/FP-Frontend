<template>
  <t-layout>
    <t-aside class="h-[calc(100vh-72px)] flex flex-col items-center">
      <t-menu v-model="menuVal" class="!h-[calc(100vh-120px)]">
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
        header="大學排名討論串"
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
import {Button, Content, Drawer} from "tdesign-vue-next";
import {shallowRef} from "vue";
import universityChart from "@/components/container/top-university/chart.vue";
import universityTable from "@/components/container/top-university/table.vue";
import {ref} from "vue";
import {ChartLineMultiIcon, ChatBubble1Icon, Flag1Icon} from "tdesign-icons-vue-next";
import discussionTopUniversity from "@/components/container/discussion/topUniversity.vue";

const menuVal = ref()
const curComponent = shallowRef(universityChart)
const curDiscussionComponent = shallowRef(discussionTopUniversity)
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