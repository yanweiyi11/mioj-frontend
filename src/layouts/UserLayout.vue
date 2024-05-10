<template>
  <div id="user-layout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img src="@/assets/logo.png" class="login" alt="" />
          <div>MiOJ 在线判题系统</div>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">MiOJ 在线判题系统</a-layout-footer>
    </a-layout>
  </div>
</template>

<style>
#user-layout {
  text-align: center;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")
    0 0 / 100% 100%;
}

#user-layout .header {
  margin-top: 100px;
}

#user-layout .login {
  width: 64px;
}

#user-layout .content {
  padding: 16px;
}

#user-layout .footer {
  padding: 12px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts"></script>
