<template>
  <div id="example">
    <MDEditor :handle-change="handleMDChange" :value="mdValue" />
    <CodeEditor :handle-change="handleCodeChange" :value="codeValue" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MDEditor from "@/components/MDEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue";

const mdValue = ref("");
const handleMDChange = (v: string) => {
  mdValue.value = v;
};

const codeValue = ref("");
const handleCodeChange = (v: string) => {
  codeValue.value = v;
};
</script>
