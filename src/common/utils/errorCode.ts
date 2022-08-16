export const ErrorCode = {
  // business status code
  SYSTEM: {
    UNKNOWN_SERVICE: {
      code: 500,
      message: '未知服务错误',
    },
    ARGUMENT_ERROR: {
      code: 1001,
      message: '参数错误',
    },
    ARRAY_ATTRIBUTES_ERROR: {
      code: 1002,
      message: '数组的key值缺失或错误',
    },
    OSS_AUTHORIZATION_ERROR: {
      code: 1003,
      message: 'oss authorization 不能为空',
    },
    OSS_X_OSS_PUB_KEY_URL_ERROR: {
      code: 1004,
      message: 'x-oss-pub-key-url 不能为空',
    },
    OSS_AUTHORIZATION_CHECK_ERROR: {
      code: 1005,
      message: 'oss 授权认证失败',
    },
    SMS_INNER_ERROR: {
      code: 1006,
      message: '短信内部服务错误',
    },
    SMS_MOBILE_NUMBER_ILLEGAL_ERROR: {
      code: 1007,
      message: '手机号码格式错误',
    },
    SMS_BUSINESS_LIMIT_CONTROL_ERROR: {
      code: 1008,
      message: '您的当前操作太频繁, 请稍后再试',
    },
  },

  // 1xxxx
  AUTH: {
    UNAUTHENTICATED_ERROR: {
      code: 10000,
      message: '授权认证失败',
    },
    ILLEGAL_MOBILE: {
      code: 10001,
      message: '手机号码不合法',
    },
    MOBILE_ALREADY_REGISTERED: {
      code: 10002,
      message: '手机号码已经被注册',
    },
    ILLEGAL_CODE: {
      code: 10003,
      message: '验证码不合法',
    },
    CODE_NOT_FOUND: {
      code: 10004,
      message: '验证码不存在',
    },
    CODE_EXPIRED: {
      code: 10005,
      message: '验证码已过期',
    },
    CODE_MISMATCH: {
      code: 10006,
      message: '验证码错误',
    },
    ILLEGAL_PASSWORD: {
      code: 10007,
      message: '密码格式不合法',
    },
    PASSWORD_SAME_ERROR: {
      code: 10008,
      message: '新旧密码不能一致',
    },
    PASSWORD_ERROR: {
      code: 10009,
      message: '原始密码输入错误',
    },
    MODIFY_PASSWORD_ERROR: {
      code: 10010,
      message: '修改密码错误',
    },
    RESET_PASSWORD_ERROR: {
      code: 10011,
      message: '重置密码失败',
    },
    ACCOUNT_FORBIDDEN_ERROR: {
      code: 10012,
      message: '该账号已经被停用, 请联系管理员',
    },
    USER_NOT_SIGN_UP_ERROR: {
      code: 10013,
      message: '该手机未在本站注册或手机验证码输入错误',
    },
    USER_NOT_FOUND_ERROR: {
      code: 10014,
      message: '用户名/密码错误或手机号未在本站注册',
    },
    SIGN_UP_ERROR: {
      code: 10015,
      message: '注册失败',
    },
    USER_NOT_PERMITTED_ERROR: {
      code: 10016,
      message: '当前用户无权限操作',
    },
  },
  // 2xxxx
  CONTENT_MANAGEMENT: {
    COLUMN_NOT_FOUND_ERROR: {
      code: 20001,
      message: '当前栏目不存在或者已经被删除',
    },
    TYPE_NOT_FOUND_ERROR: {
      code: 20002,
      message: '当前类型不存在或者已经被删除',
    },
    SUBJECT_NOT_FOUND_ERROR: {
      code: 20003,
      message: '当前学科不存在或者已经被删除',
    },
    START_TIME_ERROR: {
      code: 20004,
      message: '开始时间不能大于结束时间',
    },
    RESOURCE_NOT_FOUND_ERROR: {
      code: 20005,
      message: '该数据不存在或已经被删除',
    },
    LANGUAGE_NOT_FOUND_ERROR: {
      code: 20006,
      message: '当前语言不存在或已经被删除',
    },
    PERIOD_NOT_FOUND_ERROR: {
      code: 20007,
      message: '当前发刊周期不存在或已经被删除',
    },
    PEKING_UNIT_NOT_FOUND_ERROR: {
      code: 20008,
      message: '当前期刊不存在或已经被删除',
    },
  },
  // 3xxxx
  FILES: {
    FILE_NOT_FOUND_ERROR: {
      code: 30001,
      message: '文件不存在',
    },
    FILE_STATUS_MODIFY_ERROR: {
      code: 30002,
      message: '文件状态更新失败',
    },
  },
};
