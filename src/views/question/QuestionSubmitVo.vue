<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";

const router = useRouter();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res =
    await QuestionControllerService.listQuestionSubmitVoByPageUsingPost({
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    });
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    Message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时出发页面重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载完成后，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    dataIndex: "status",
  },
  {
    title: "题号",
    dataIndex: "questionId",
  },
  {
    title: "用户编号",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = { ...searchParams.value, current: page };
};

/**
 * 搜索题目（重新加载数据）
 */
const doSearch = async () => {
  // 需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<template>
  <div id="question-view">
    <a-form :model="searchParams" layout="inline">
      <a-form-item
        field="questionId"
        label="题号"
        :style="{ minWidth: '240px' }"
      >
        <a-input v-model="searchParams.questionId" placeholder="请输入题号" />
      </a-form-item>
      <a-form-item
        field="language"
        label="编程语言"
        :style="{ minWidth: '240px' }"
      >
        <a-select
          :style="{ width: '160px' }"
          placeholder="选择语言"
          :trigger-props="{ autoFitPopupMinWidth: true }"
          v-model="searchParams.language"
        >
          <a-option>java</a-option>
          <a-option>python</a-option>
          <a-option>cpp</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSearch">查询</a-button>
      </a-form-item>
    </a-form>
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total: total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo) }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
    </a-table>
  </div>
</template>

<style scoped>
#question-view {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
