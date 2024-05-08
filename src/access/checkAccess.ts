import AccessEnum from "@/access/accessEnum";

/**
 * 检查权限（判断当前登录用户是否具有某个权限）
 *
 * @param loginUser 当前登录用户
 * @param needAccess 需要有的权限
 * @return boolean 有无权限
 */
const checkAccess = (loginUser: any, needAccess = AccessEnum.NOT_LOGIN) => {
  // 获取当前登录用户具有的权限（如果没有 loginUser，则表示未登录）
  const loginUserAccess = loginUser?.userRole ?? AccessEnum.NOT_LOGIN;

  // 直接返回权限检查的结果
  switch (needAccess) {
    case AccessEnum.NOT_LOGIN:
      return true; // 无需登录即可访问
    case AccessEnum.USER:
      return loginUserAccess !== AccessEnum.NOT_LOGIN; // 需要用户登录
    case AccessEnum.ADMIN:
      return loginUserAccess === AccessEnum.ADMIN; // 需要管理员权限
    default:
      return false; // 默认情况下，无访问权限
  }
};

export default checkAccess;
