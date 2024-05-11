<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import MDEditor from "@/components/MDEditor.vue";
import { QuestionControllerService } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRoute } from "vue-router";

const route = useRoute();
const updatePage = computed(() => route.path.includes("update"));

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // 数据处理
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 0,
        stackLimit: 0,
        timeLimit: 0,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    Message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  if (updatePage.value) {
    loadData();
  }
});
// 监听路由变化来重置表单
watch(
  () => route.path,
  (newPath) => {
    if (!newPath.includes("update")) {
      form.value = { ...initParams };
    }
  }
);
const initParams = {
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 0,
    stackLimit: 0,
    timeLimit: 0,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
};

const form = ref({ ...initParams });

/**
 * 新增判题用例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

/**
 * 删除判题用例
 * @param index
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const onContentChange = (v: string) => {
  form.value.content = v;
};

const onAnswerChange = (v: string) => {
  form.value.answer = v;
};

const doSubmit = async () => {
  // 区分更新和创建
  if (updatePage.value) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      Message.success("更新成功");
    } else {
      Message.error("更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      Message.success("创建成功");
    } else {
      Message.error("创建失败，" + res.message);
    }
  }
};
</script>

<template>
  <div id="add-question-view">
    <h2 :style="{ marginBottom: '20px' }">创建题目</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input
          v-model="form.title"
          :style="{ width: '360px' }"
          placeholder="请输入标题"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag
          v-model="form.tags"
          :style="{ width: '360px' }"
          placeholder="请选择标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MDEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MDEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>

      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" :style="{ minWidth: '600px' }">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制（ms）">
            <a-space direction="vertical" size="large">
              <a-input-number
                size="large"
                :min="0"
                v-model="form.judgeConfig.timeLimit"
              />
            </a-space>
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制（kb）">
            <a-space direction="vertical" size="large">
              <a-input-number
                size="large"
                :min="0"
                v-model="form.judgeConfig.memoryLimit"
              />
            </a-space>
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制（kb）">
            <a-space direction="vertical" size="large">
              <a-input-number
                size="large"
                :min="0"
                v-model="form.judgeConfig.stackLimit"
              />
            </a-space>
          </a-form-item>
        </a-space>
      </a-form-item>

      <a-form-item
        label="判题用例配置"
        :content-flex="false"
        :merge-props="false"
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :label="`判题用例 ${index + 1}`"
          :key="index"
        >
          <a-space direction="vertical" fill>
            <a-form-item
              :field="`form.judgeCase[${index}].input`"
              label="输入"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请输入判题输入用例"
              />
            </a-form-item>
            <a-form-item
              :field="`form.judgeCase[${index}].output`"
              label="输出"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请输入判题输出用例"
              />
            </a-form-item>
            <a-button
              @click="handleDelete(index)"
              status="danger"
              type="outline"
              >删除
            </a-button>
          </a-space>
        </a-form-item>
        <a-button @click="handleAdd" type="outline" status="success"
          >新增用例
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped></style>
