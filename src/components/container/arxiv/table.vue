<template>
  <t-loading v-if="isLoading" text="獲取資料中..." size="small"></t-loading>
  <div v-else class="flex-col h-auto w-full pb-8">
    <t-space class="mb-4">
      <t-dropdown :options="dropdownOptions" :max-column-width="300" :max-height="200">
        <t-button variant="text">
          {{ currentTitle }}
          <template #suffix>
            <chevron-down-icon size="16"/>
          </template>
        </t-button>
      </t-dropdown>
    </t-space>
    <VChart class="" :option="option" autoresize/>
  </div>
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
import {BarChart} from 'echarts/charts';
import {UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import VChart, {THEME_KEY} from "vue-echarts";
import {ref, provide, onMounted} from "vue";
import {useFetch} from "@vueuse/core";
import {useAuthStore} from "@/stores/auth.ts";
import {useRouter} from "vue-router";
import {ChevronDownIcon} from 'tdesign-icons-vue-next';
import {MessagePlugin} from 'tdesign-vue-next';


echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
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


interface seriesTypeData {
  value: number;
  itemStyle: {
    color: string;
  }
}

interface seriesType {
  name: string;
  type: string;
  data: seriesTypeData[];
}

const currentTitle = ref('請選擇領域')

const option = ref({
  title: {
    text: "Arxiv 各領域總刊登",
    left: "center"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} (份刊登)",
    axisPointer: {
      type: 'shadow'
    }
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
    data: [],
    axisTick: {
      alignWithLabel: true
    }
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
  name_list: [] as string[],
  year_list: [] as number[],
  article_count_list: [] as number[],
  cross_list_count_list: [] as number[],
  total_article_count_list: [] as number[],
})

const router = useRouter()
const authStore = useAuthStore()
const userInfo = authStore.userInfo
const isLoading = ref(true)
const dropdownOptions = [
  {
    content: 'Computer_Science',
    value: 1,
    onClick: async () => {

      await handleClickField(1)
    }
  },
  {
    content: 'Mathematics',
    value: 2,
    onClick: async () => {

      await handleClickField(2)
    }
  },
  {
    content: 'Quantitative_Biology',
    value: 3,
    onClick: async () => {

      await handleClickField(3)
    }
  },
  {
    content: 'Quantitative_Finance',
    value: 4,
    onClick: async () => {

      await handleClickField(4)
    }
  },
  {
    content: 'Statistics',
    value: 5,
    onClick: async () => {

      await handleClickField(5)
    }
  },
  {
    content: 'Economics',
    value: 6,
    onClick: async () => {

      await handleClickField(6)
    }
  },
  {
    content: 'Electrical_Engineering_and_Systems_Science',
    value: 7,
    onClick: async () => {

      await handleClickField(7)
    }
  },
  {
    content: 'Physics',
    children: [
      {
        content: 'Physics_Astrophysics',
        value: 8,
        onClick: async () => {

          await handleClickField(8)
        }
      },
      {
        content: 'Physics_Condensed_Matter',
        value: 9,
        onClick: async () => {

          await handleClickField(9)
        }
      },
      {
        content: 'Physics_General_Relativity_and_Quantum_Cosmology',
        value: 10,
        onClick: async () => {

          await handleClickField(10)
        }
      },
      {
        content: 'Physics_High_Energy_Physics_Experiment',
        value: 11,
        onClick: async () => {

          await handleClickField(11)
        }
      },
      {
        content: 'Physics_High_Energy_Physics_Lattice',
        value: 12,
        onClick: async () => {

          await handleClickField(12)
        }
      },
      {
        content: 'Physics_High_Energy_Physics_Phenomenology',
        value: 13,
        onClick: async () => {

          await handleClickField(13)
        }
      },
      {
        content: 'Physics_High_Energy_Physics_Theory',
        value: 14,
        onClick: async () => {

          await handleClickField(14)
        }
      },
      {
        content: 'Physics_Mathematical_Physics',
        value: 15,
        onClick: async () => {

          await handleClickField(15)
        }
      },
      {
        content: 'Physics_Nonlinear_Sciences',
        value: 16,
        onClick: async () => {

          await handleClickField(16)
        }
      },
      {
        content: 'Physics_Nuclear_Experiment',
        value: 17,
        onClick: async () => {

          await handleClickField(17)
        }
      },
      {
        content: 'Physics_Nuclear_Theory',
        value: 18,
        onClick: async () => {

          await handleClickField(18)
        }
      },
      {
        content: 'Physics_Physics',
        value: 19,
        onClick: async () => {

          await handleClickField(19)
        }
      },
      {
        content: 'Physics_Quantum_Physics',
        value: 20,
        onClick: async () => {

          await handleClickField(20)
        }
      },
    ],
  },
]

// click the menu item and get the value, and use the value to write arxivFieldInfoList from resDataList
const handleClickField = async (id_value: number) => {
  // data.value
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/arxiv_field/' + id_value, {
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
    arxivFieldInfoList.value.name_list = resDataList.name_list
    arxivFieldInfoList.value.year_list = resDataList.year_list
    arxivFieldInfoList.value.article_count_list = resDataList.article_count_list
    arxivFieldInfoList.value.cross_list_count_list = resDataList.cross_list_count_list
    arxivFieldInfoList.value.total_article_count_list = resDataList.total_article_count_list

    // put data into option
    // Find the index of the maximum value in total_article_count_list
    // Find the index of the maximum value in total_article_count_list
    const maxIndex = resDataList.total_article_count_list.indexOf(
        Math.max(...resDataList.total_article_count_list)
    );

    // Create an array of colors, setting red for the maximum value bar and default color for others
    const colors = resDataList.total_article_count_list.map((_, index) =>
        index === maxIndex ? 'red' : 'blue' // You can replace 'blue' with your default color
    );
    // year 1991 ~ 2023
    option.value.xAxis.data = ['1991', '1992', '1993', '1994', '1995', '1996', '1997',
      '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005',
      '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013',
      '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021',
      '2022', '2023']
    // name_list
    option.value.title.text = arxivFieldInfoList.value.name_list[0] + " 各年份總刊登"
    option.value.legend.data = []
    option.value.legend.data.push(arxivFieldInfoList.value.name_list[0])
    // total_article_count_list
    option.value.series = []
    // mark resDataList.total_article_count_list[maxIndex] as red
    // another mark blue
    // definition seriesTypeData list, and push {value, itemStyle} into it
    // 1991 ~ 2023
    const seriesTypeDataList = resDataList.year_list.map((year, index) => {
      return {
        value: (year === (1991 + index)) ? resDataList.total_article_count_list[index] : 0,
        itemStyle: {
          color: (year === (1991 + index)) ? colors[index] : 'blue',
        }
      }
    })

    option.value.series.push({
      name: arxivFieldInfoList.value.name_list[0],
      type: 'bar',
      data: seriesTypeDataList,
    })
    currentTitle.value = arxivFieldInfoList.value.name_list[id_value]
  }
  isLoading.value = false
}


onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.replace({name: 'userLogin'})
  }
  handleClickField(1)
})

</script>

<style scoped>
</style>