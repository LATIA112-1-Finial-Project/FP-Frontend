<template>
  <t-loading v-if="isLoading" text="獲取資料中..." size="small"></t-loading>
  <VChart v-else class="h-auto" :option="option" autoresize/>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
import {LineChart} from 'echarts/charts';
import {UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import VChart, {THEME_KEY} from "vue-echarts";
import {ref, provide, onMounted} from "vue";
import {useFetch} from "@vueuse/core";
import {useAuthStore} from "@/stores/auth.ts";
import {useRouter} from "vue-router";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);
provide(THEME_KEY, "dark");

// define option type

interface optionType {
  title: TitleComponentOption;
  tooltip: TooltipComponentOption;
  legend: legendType;
  grid: GridComponentOption;
  toolbox: ToolboxComponentOption;
  xAxis: xAxisType;
  yAxis: yAxisType;
  series: seriesType[];
}

interface legendType {
  data: string[];
}

interface xAxisType {
  type: string;
  boundaryGap: boolean;
  data: string[];
}


// formatter: function
interface yAxisType {
  type: string;
}
interface seriesType {
  name: string;
  type: string;
  data: number[];
}

const option = ref({
  title: {
    text: "Arxiv 各領域總刊登",
    left: "center"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} (份刊登)"
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: []
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: "value",
  },
  series: []
} as optionType)


interface ArxivFieldInfo {
  name_list: string[];
  year_list: number[];
  article_count_list: number[];
  cross_list_count_list: number[];
  total_article_count_list: number[];
}

interface resData {
  code: number;
  msg: string;
  data: ArxivFieldInfo;
}

// value in List is List
const arxivFieldInfoList = ref({
  name_list: [] as string[][],
  year_list: [] as number[][],
  article_count_list: [] as number[][],
  cross_list_count_list: [] as number[][],
  total_article_count_list: [] as number[][],
})

const router = useRouter()
const authStore = useAuthStore()
const userInfo = authStore.userInfo
const isLoading = ref(true)
const getArxivFieldInfo = async () => {
  // for loop to get arxiv field info api = /auth/arxiv_field/<id>
  for (let id = 1; id < 21; id++) {
    const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/arxiv_field/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.token}`
      }
    }).get().json<resData>()

    if (data.value) {
      if (data.value.msg !== 'success') {
        return
      }
      const resDataList = data.value.data
      // reverse data
      resDataList.name_list.reverse()
      resDataList.year_list.reverse()
      resDataList.article_count_list.reverse()
      resDataList.cross_list_count_list.reverse()
      resDataList.total_article_count_list.reverse()
      // until year 2023 to 1991, if no data, fill 0
      for (let i = 0; i < 33; i++) {
        if (resDataList.year_list[i] !== 1991 + i) {
          resDataList.name_list.splice(i, 0, resDataList.name_list[i])
          resDataList.year_list.splice(i, 0, 1991 + i)
          resDataList.article_count_list.splice(i, 0, 0)
          resDataList.cross_list_count_list.splice(i, 0, 0)
          resDataList.total_article_count_list.splice(i, 0, 0)
        }
      }
      // push data into arxivFieldInfoList
      arxivFieldInfoList.value.name_list.push(resDataList.name_list)
      arxivFieldInfoList.value.year_list.push(resDataList.year_list)
      arxivFieldInfoList.value.article_count_list.push(resDataList.article_count_list)
      arxivFieldInfoList.value.cross_list_count_list.push(resDataList.cross_list_count_list)
      arxivFieldInfoList.value.total_article_count_list.push(resDataList.total_article_count_list)
    }
  }
  // put data into option
  // year 1991 ~ 2023
  option.value.xAxis.data = ['1991', '1992', '1993', '1994', '1995', '1996', '1997',
    '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005',
    '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013',
    '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021',
    '2022', '2023']
  // name_list
  for (let i = 0; i < arxivFieldInfoList.value.name_list.length; i++) {
    option.value.legend.data.push(arxivFieldInfoList.value.name_list[i][0])
  }
  // total_article_count_list
  for (let i = 0; i < arxivFieldInfoList.value.total_article_count_list.length; i++) {
    option.value.series.push({
      name: arxivFieldInfoList.value.name_list[i][0],
      type: 'line',
      data: arxivFieldInfoList.value.total_article_count_list[i]
    })
  }
  isLoading.value = false
}

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.replace({name: 'userLogin'})
  }
  getArxivFieldInfo()
})

</script>

<style scoped>
</style>