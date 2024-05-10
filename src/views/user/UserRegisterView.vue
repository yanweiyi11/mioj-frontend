<template>
  <div id="user-register-view">
    <h2 class="register-title">用户注册</h2>
    <a-form
      ref="formRef"
      :auto-label-width="true"
      :model="form"
      @submit="handleSubmit"
      class="register-form"
    >
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请设置账号" />
      </a-form-item>
      <a-form-item field="userPassword" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请设置密码"
        />
      </a-form-item>
      <a-form-item field="checkPassword" label="确认密码">
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请输入确认密码"
        />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit">注册</a-button>
          <a-button @click="$refs.formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

const router = useRouter();

/**
 * 提交表单，执行注册
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);
  if (res.code === 0) {
    Message.success("注册成功，请登录");
    await router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    Message.error("注册失败，" + res.message);
  }
};
</script>

<style scoped>
#user-register-view .register-title {
  margin-bottom: 32px;
}

#user-register-view .register-form {
  max-width: 360px;
  margin: 0 auto;
}
</style>
