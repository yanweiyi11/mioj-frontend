import router from "@/router";
import store from "@/store";
import AccessEnum from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  let loginUser = store.state.user.loginUser;
  // 自动登录处理：如果用户未登录，触发登录操作
  if (!loginUser || !loginUser?.userRole) {
    // 加 await 是为了等用户登录成功之后，在执行后续的代码
    await store.dispatch("user/getLoginUser");
    // 重新获取登录态
    loginUser = store.state.user.loginUser;
  }
  // 确定当前路由所需的权限级别，默认为无需登录
  const needAccess = (to.meta?.access as string) ?? AccessEnum.NOT_LOGIN;
  // 如果用户访问的页面必登录须要
  if (needAccess !== AccessEnum.NOT_LOGIN) {
    // 未登录用户重定向到登录页面
    if (
      !loginUser ||
      !loginUser?.userRole ||
      loginUser.userRole == AccessEnum.NOT_LOGIN
    ) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // 如果登录了，但是权限不足，跳转到无权限页面
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
