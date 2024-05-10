<template>
  <div id="user-login-view">
    <h2 class="login-title">用户登录</h2>
    <a-form
      :auto-label-width="true"
      :model="form"
      @submit="handleSubmit"
      class="login-form"
    >
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit">登录</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "admin",
  userPassword: "12345678",
} as UserLoginRequest);

const router = useRouter();
const store = useStore();

/**
 * 提交表单，执行登录
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    await store.dispatch("user/getLoginUser");
    await router.push({
      path: "/",
      replace: true,
    });
    Message.success("登陆成功");
  } else {
    Message.error("登陆失败，" + res.message);
  }
};
</script>

<style scoped>
#user-login-view .login-title {
  margin-bottom: 32px;
}

#user-login-view .login-form {
  max-width: 360px;
  margin: 0 auto;
}
</style>
