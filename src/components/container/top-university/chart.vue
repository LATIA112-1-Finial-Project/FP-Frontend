<template>
  <t-loading v-if="isLoading" text="獲取資料中..." size="small"></t-loading>
  <div v-else class="flex-col h-auto w-full pb-8">
    <div class="flex-col">
      <div class="flex justify-center items-center mb-8 text-4xl">
        學校各項排名圖表
      </div>
      <div class="flex justify-center items-center">
        <t-select-input
            v-model:inputValue="inputValue"
            :value="selectOptionsValue"
            :allow-input="allowInput"
            :placeholder="allowInput ? '請選擇學校 (可輸入查詢、支援多選)' : '請選擇'"
            :tag-input-props="{ excessTagsDisplayType }"
            :popup-props="popupProps"
            clearable
            multiple
            :reserveKeyword="true"
            @tag-change="onTagChange"
            @input-change="onInputChange(inputValue)"
            class="w-1/2"
        >
          <template #panel>
            <t-checkbox-group
                v-if="allUniversityValue.length"
                :value="checkboxValue"
                :options="allUniversityValue"
                class="tdesign-demo__panel-options-multiple"
                @change="onCheckedChange"
            />
            <div v-else class="tdesign-demo__select-empty-multiple">查無相關資料</div>
          </template>
          <template #suffixIcon>
            <ChevronDownIcon/>
          </template>
        </t-select-input>
        <Button theme="primary" class="ml-4" @click="handleOnClick">
          送出
        </Button>
      </div>
    </div>
    <div class="mx-auto w-2/3 h-2/3">
      <VChart v-if="!isLoading" class="mt-8" :option="option" :key="chartKey" autoresize/>
    </div>
    <div class="flex flex-wrap justify-between w-full h-full">
      <VChart v-if="!isLoading" class="mt-8 w-[calc(50%-0.5em)] h-1/2" :option="academicOption" :key="chartKey"
              autoresize/>
      <VChart v-if="!isLoading" class="mt-8 w-[calc(50%-0.5em)] h-1/2" :option="employerOption" :key="chartKey"
              autoresize/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Button, MessagePlugin} from "tdesign-vue-next";
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
import {ref, provide, onMounted, computed, watch} from "vue";
import {useFetch} from "@vueuse/core";
import {useAuthStore} from "@/stores/auth.ts";
import {useRouter} from "vue-router";
import {ChevronDownIcon} from "tdesign-icons-vue-next";

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
  data: number[];
}


// formatter: function
interface yAxisType {
  type: string;
}

interface seriesType {
  name: string;
  type: string;
  data: (number | string)[];
}

const option = ref({
  title: {
    text: "University 2021 ~ 2024 總排名",
    left: "center"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} (順位)"
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
    min: 1,
    max: 500,
    inverse: true,
    type: "value",
  },
  series: []
} as optionType)
const academicOption = ref({
  title: {
    text: "University 2021 ~ 2024 學術排名",
    left: "center"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} (順位)"
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
    min: 1,
    max: 500,
    inverse: true,
    type: "value",
  },
  series: []
} as optionType)
const employerOption = ref({
  title: {
    text: "University 2021 ~ 2024 師資排名",
    left: "center"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} (順位)"
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
    min: 1,
    max: 500,
    inverse: true,
    type: "value",
  },
  series: []
} as optionType)


interface UniversityIdName {
  id: number;
  name: string;
}

interface resData {
  code: number;
  msg: string;
  data: UniversityIdName[];
}

// value in List is List
const UniversityIdNameList = ref([] as SelectOptionsType[])

const router = useRouter()
const authStore = useAuthStore()
const userInfo = authStore.userInfo
const isLoading = ref(true)

const handleUniversityIdName = async () => {
  isLoading.value = true
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/university', {
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
    // data.value.data.id -> UniversityIdNameList.value[i].value
    // data.value.data.name -> UniversityIdNameList.value[i].label
    for (let i = 0; i < data.value.data.length; i++) {
      UniversityIdNameList.value.push({
        label: data.value.data[i].name,
        value: data.value.data[i].id
      })
    }
    await pushUniversityIdNameInSelectOptionsType()
    isLoading.value = false
  }
}

const pushUniversityIdNameInSelectOptionsType = async () => {
  allUniversityValue.value = UniversityIdNameList.value
}

interface SelectOptionsType {
  label: string;
  value: number;
}

interface SelectOptionsValue {
  label: string;
  value: number;
}

const allUniversityValue = ref([] as SelectOptionsType[])
const selectOptionsValue = ref([] as SelectOptionsValue[])
const allowInput = ref(true);
const inputValue = ref('');
const excessTagsDisplayType = ref('scroll');

const popupProps = ref({
  overlayInnerClassName: ['narrow-scrollbar'],
  overlayInnerStyle: {
    maxHeight: '280px',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    padding: '6px',
  },
});

const checkboxValue = computed(() => {
  const arr = [];
  const list = selectOptionsValue.value;
  for (let i = 0, len = list.length; i < len; i++) {
    list[i].value && arr.push(list[i].value);
  }
  return arr;
});

const onCheckedChange = (val, {current, type}) => {
  if (type === 'check') {
    const tagOption = allUniversityValue.value.find((t) => t.value === current);
    if (!tagOption) return;
    selectOptionsValue.value.push(tagOption);
  } else {
    selectOptionsValue.value = selectOptionsValue.value.filter((v) => v.value !== current);
  }
  inputValue.value = '';
};

const onTagChange = (currentTags, context) => {
  const {trigger, index, item} = context;
  if (trigger === 'clear') {
    selectOptionsValue.value = [];
  }
  if (['tag-remove', 'backspace'].includes(trigger)) {
    selectOptionsValue.value.splice(index, 1);
  }
};


// 輸入篩選來源為 inputValue

// 輸入後可以篩選列表 selectOptions，如果沒有輸入值，則顯示全部列表

const onInputChange = (value: string) => {
  pushUniversityIdNameInSelectOptionsType()
  const filterList = allUniversityValue.value.filter((item) => item.label.includes(value));
  if (!value) return
  allUniversityValue.value = filterList;
}

interface UniversityResDataType {
  academic_reputation_info_rank_list: (number | string) [];
  academic_reputation_info_score_list: (number | string) [];
  academic_reputation_info_year_list: (number | string) [];
  employer_reputation_info_rank_list: (number | string) [];
  employer_reputation_info_score_list: (number | string) [];
  employer_reputation_info_year_list: (number | string) [];
  overall_info_rank_list: (number | string) [];
  overall_info_score_list: (number | string) [];
  overall_info_year_list: (number | string) [];
  university_name: string;
}

interface UniversityResType {
  code: number;
  msg: string;
  data: UniversityResDataType;
}

// array of UniversityResDataType
const universityResData = ref([] as UniversityResDataType[])

const handleOnClick = async () => {
  // initial universityResData
  universityResData.value = []

  const idList = selectOptionsValue.value.map((item) => item.value)
  await Promise.all(idList.map(async (id) => {
    await handleUniversityResData(id);
  }));
  await handleUniversityResDataDrawChart()
}

const chartKey = ref(0)

const clearOption = async () => {
  option.value.legend.data = []
  option.value.series = []
  option.value.xAxis.data = []
  academicOption.value.legend.data = []
  academicOption.value.series = []
  academicOption.value.xAxis.data = []
  employerOption.value.legend.data = []
  employerOption.value.series = []
  employerOption.value.xAxis.data = []
}

const changeOption = async () => {
  for (let i = 0; i < universityResData.value.length; i++) {
    // add option data
    option.value.legend.data[i] = universityResData.value[i].university_name
    option.value.series[i] = {
      name: universityResData.value[i].university_name,
      type: 'line',
      data: universityResData.value[i].overall_info_rank_list,
    }
    option.value.xAxis.data = [2021, 2022, 2023, 2024]
    // add academicOption data
    academicOption.value.legend.data[i] = universityResData.value[i].university_name
    academicOption.value.series[i] = {
      name: universityResData.value[i].university_name,
      type: 'line',
      data: universityResData.value[i].academic_reputation_info_rank_list,
    }
    academicOption.value.xAxis.data = [2021, 2022, 2023, 2024]
    // add employerOption data
    employerOption.value.legend.data[i] = universityResData.value[i].university_name
    employerOption.value.series[i] = {
      name: universityResData.value[i].university_name,
      type: 'line',
      data: universityResData.value[i].employer_reputation_info_rank_list,
    }
    employerOption.value.xAxis.data = [2021, 2022, 2023, 2024]
  }
  chartKey.value += 1;
}

const handleUniversityResDataDrawChart = async () => {
  // clear all option data
  await clearOption()
  await changeOption()
}

const handleUniversityResData = async (id: number) => {
  const {data} = await useFetch(`${import.meta.env.VITE_API_ENDPOINT}` + '/auth/university_attr/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userInfo.token}`
    }
  }).get().json<UniversityResType>()
  if (data.value) {
    if (data.value.msg !== 'success') {
      return
    }
    universityResData.value.push(data.value.data)
  }
}

// async onMounted
onMounted(async () => {
  if (!authStore.isLoggedIn) {
    await router.replace({name: 'userLogin'})
  }
  await handleUniversityIdName()
})


</script>

<style scoped>
.tdesign-demo__panel-options-multiple {
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tdesign-demo__panel-options-multiple .t-checkbox {
  display: flex;
  border-radius: 3px;
  line-height: 22px;
  cursor: pointer;
  padding: 3px 8px;
  color: var(--td-text-color-primary);
  transition: background-color 0.2s linear;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.tdesign-demo__panel-options-multiple .t-checkbox:hover {
  background-color: var(--td-bg-color-container-hover);
}
</style>