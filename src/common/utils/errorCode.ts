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
    USER_NOT_SIGNUP_ERROR: {
      code: 10013,
      message: '该手机未在本站注册或手机验证码输入错误',
    },
    USER_NOT_FOUND_ERROR: {
      code: 10014,
      message: '用户名/密码错误或手机号未在本站注册',
    },
    SIGNUP_ERROR: {
      code: 10015,
      message: '注册失败',
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
  // 4xxxx
  QUESTIONS: {
    QUESTION_NOT_FOUND_ERROR: {
      code: 40004,
      message: '当前题目已下架/删除',
    },
    RECOMMEND_QUESTION_ERROR: {
      code: 40018,
      message: '获取推荐题目失败,原因:exerciseId、nodeId 不允许同时为空',
    },
    QUESTION_PERMISSION_ERROR: {
      code: 40019,
      message: '用户当前数学类型和课程状态无该题目权限',
    },
  },
  // 5xxxx
  USERS: {
    PAPER_TYPE_NOT_PERMITTED_ERROR: {
      code: 50001,
      message: '数学类型只允许:数学一、数学二、数学三',
    },
    SET_PAPER_TYPE_ERROR: {
      code: 50002,
      message: '设置数学类型失败',
    },
    COURSER_NOT_FOUND_ERROR: {
      code: 50003,
      message: '该课程不存在或者已经被停用',
    },
    SET_COURSE_ERROR: {
      code: 50004,
      message: '设置课程失败',
    },
    UNSET_PAPER_TYPE_ERROR: {
      code: 50005,
      message: '请先设置数学类型',
    },
    UNSET_COURSE_ERROR: {
      code: 50006,
      message: '请先设置课程',
    },
  },
  // 6xxxx
  EXERCISES: {
    USER_EXERCISE_NOT_PERMITTED_ERROR: {
      code: 60005,
      message: '该导练/试卷已经结束或当前用户无权限',
    },
    USER_ANSWER_ID_ERROR: {
      code: 60006,
      message: '用户提交的答案id不存在',
    },
    SUBMIT_EXERCISE_ERROR: {
      code: 60007,
      message: '提交导练记录失败',
    },
    NODE_ID_NOT_FOUND_ERROR: {
      code: 60008,
      message: '该章节或知识点不存在或者已经被停用',
    },
    USER_EXERCISE_ENDED_AT_ERROR: {
      code: 60009,
      message: '本次导练未结束无相关的导练分析结果',
    },
    SUBMIT_EXERCISE_QUESTION_ID_REPEATED_ERROR: {
      code: 60010,
      message: '该题在本次导练中已经提交过记录,不允许重复提交',
    },
    USER_EXERCISE_DETAIL_NOT_FOUND_ERROR: {
      code: 60011,
      message: '该答题记录不存在',
    },
    USER_EXERCISE_DETAIL_USER_ID_ERROR: {
      code: 60012,
      message: '该答题记录不属于当前用户',
    },
    CHAPTER_ID_NOT_IN_TEST_ERROR: {
      code: 60017,
      message: '该章节下找不到该试卷',
    },
    MODIFY_EXERCISE_PAPER_TYPE_ERROR: {
      code: 60019,
      message: '当前用户数学类型与该作答记录不一致',
    },
    SELf_EVALUATION_RATING_NOT_NEEDED_ERROR: {
      code: 60025,
      message: '当前题型不需要自评打分',
    },
    SELf_EVALUATION_RATING_FINISHED: {
      code: 60026,
      message: '自评打分已完成, 不可重复自评',
    },
    USER_EXERCISE_NOT_FINISHED_ERROR: {
      code: 60027,
      message: '有未结束的导练,exercise_id 不能为空',
    },
    TEST_NOT_PERMITTED_ERROR: {
      code: 60028,
      message: '用户当前数学类型无权做该试卷',
    },
    TEST_CHOICE_UNFINISHED_ERROR: {
      code: 60029,
      message: '还有题目未做完,请答完后交卷',
    },
    USER_EXERCISE_NOT_FOUND_ERROR: {
      code: 60030,
      message: '考试或练习记录不存在',
    },
    TEST_NOT_FOUND_ERROR: {
      code: 60031,
      message: '试卷不存在或者用户没权限',
    },
    UNFINISHED_SELF_EVALUATION_SCORE: {
      code: 60032,
      message: '用户未完成自评打分，无法统计得分情况',
    },
    TEST_QUESTIONS_NOT_EXISTS: {
      code: 60033,
      message: '考试题目不存在',
    },
    TEST_SCORE_INVALID: {
      code: 60034,
      message: '考试评分不合法',
    },
    SELf_EVALUATION_RATING_NOT_FINISHED: {
      code: 60035,
      message: '自评打分还未完成',
    },
    TEST_FINISHED: {
      code: 60036,
      message: '已交卷, 无法再答题',
    },
  },
  // 7xxxx
  FEEDBACKS: {
    FEEDBACK_TYPE_ERROR: {
      code: 70001,
      message: '提交的反馈类型不存在',
    },
    FEEDBACK_CONTENT_ERROR: {
      code: 70002,
      message: '提交的反馈必须有内容',
    },
    FEEDBACK_IMAGE_NUMBER_ERROR: {
      code: 70003,
      message: '提交的反馈中照片的数量超限',
    },
    FEEDBACK_SUBMIT_ERROR: {
      code: 70004,
      message: '提交反馈失败',
    },
    FEEDBACK_CONTENT_TYPE_ERROR: {
      code: 70005,
      message: '提交的反馈内容类型错误',
    },
    FEEDBACK_IMAGE_TYPE_ERROR: {
      code: 70006,
      message: '提交的反馈中内容的images必须是数组类型',
    },
    FEEDBACK_IMAGE_ERROR: {
      code: 70007,
      message: '提交的反馈中照片不存在',
    },
    FEEDBACK_IMAGE_STATUS_ERROR: {
      code: 70008,
      message: '提交的反馈中照片状态错误',
    },
  },
};
