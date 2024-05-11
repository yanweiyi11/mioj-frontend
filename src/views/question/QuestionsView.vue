<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";

const router = useRouter();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  console.log("@");
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
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
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "名称",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = { ...searchParams.value, current: page };
};

const isRecordValid = (record: any) => {
  return (
    record.acceptedNum != null &&
    record.submitNum != null &&
    record.acceptedNum != 0 &&
    record.submitNum != 0
  );
};
const calculateAcceptedRate = (record: any) => {
  if (isRecordValid(record)) {
    const rate = ((record.submitNum / record.acceptedNum) * 100).toFixed(2); // 计算通过率并保留两位小数
    return `${rate} %`;
  }
  return "暂无";
};

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
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
      <a-form-item field="id" label="题号" :style="{ minWidth: '240px' }">
        <a-input v-model="searchParams.id" placeholder="请输入题号" />
      </a-form-item>
      <a-form-item field="title" label="名称" :style="{ minWidth: '240px' }">
        <a-input v-model="searchParams.title" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item field="tags" label="标签" :style="{ minWidth: '240px' }">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签" />
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
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{ calculateAcceptedRate(record) }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="toQuestionPage(record)">
            开始
          </a-button>
        </a-space>
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
