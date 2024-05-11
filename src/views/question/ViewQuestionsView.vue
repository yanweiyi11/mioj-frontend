<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import CodeEditor from "@/components/CodeEditor.vue";
import MDViewer from "@/components/MDViewer.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    Message.error("记载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const form = ref<QuestionSubmitAddRequest>({
  questionId: props.id as any,
  language: "java",
  code: "",
});

const doSubmit = async () => {
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost(
    form.value
  );
  if (res.code === 0) {
    Message.success("提交成功");
  } else {
    Message.error("提交失败，" + res.message);
  }
};

const changeCode = (value: string) => {
  form.value = {
    ...form.value,
    code: value,
  };
};
</script>

<template>
  <div id="view-question-view">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <template #extra>
                <a-space>
                  <template v-for="(tag, index) of question?.tags" :key="index">
                    <a-tag color="green">{{ tag }}</a-tag>
                  </template>
                </a-space>
              </template>
              <a-descriptions size="medium" title="判题条件" :column="1">
                <a-descriptions-item label="时间限制">
                  {{ `${question.judgeConfig.timeLimit ?? 0} MS` }}
                </a-descriptions-item>
                <a-descriptions-item label="空间限制">
                  {{ `${question.judgeConfig.memoryLimit ?? 0} KB` }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ `${question.judgeConfig.stackLimit ?? 0} KB` }}
                </a-descriptions-item>
              </a-descriptions>
              <MDViewer :value="question.content || '无'" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论"> ...</a-tab-pane>
          <a-tab-pane key="answer" title="答案">
            <a-card v-if="question">
              暂时无法查看答案
              <!--<MDViewer :value="question.answer || ''" />-->
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item
            field="language"
            label="编程语言"
            :style="{ minWidth: '240px' }"
          >
            <a-select
              :style="{ width: '160px' }"
              placeholder="选择语言"
              :trigger-props="{ autoFitPopupMinWidth: true }"
              v-model="form.language"
            >
              <a-option>java</a-option>
              <a-option>python</a-option>
              <a-option>cpp</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :language="form.language"
          :value="form.code as string"
          :handle-change="changeCode"
        />
        <a-divider size="0" />
        <a-button type="primary" @click="doSubmit"> 提交代码</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
#view-question-view {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
