<template>
  <div id="basic-layout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">MiOJ 在线判题系统</a-layout-footer>
    </a-layout>
  </div>
</template>

<style>
#basic-layout {
}

#basic-layout .header {
  box-shadow: #eee 1px 1px 5px;
}

#basic-layout .content {
  padding: 16px;
}

#basic-layout .footer {
  padding: 12px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>
