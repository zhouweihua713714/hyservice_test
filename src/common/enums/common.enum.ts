export enum User_Status_Enum {
  /** 停用 */
  Disabled = 'disabled',
  /** 启用 */
  Enabled = 'enabled',
}

export enum User_Types_Enum {
  /** 管理员 */
  Administrator = 'administrator',
  /** 审题员 */
  Approver = 'approver',
  /** 录题员 */
  Keyboarder = 'keyboarder',
  /** 普通人员 */
  User = 'user',
}

export enum Paper_Types_Enum {
  /** 数学一 */
  MathOne = 'math_one',
  /** 数学三 */
  MathThree = 'math_three',
  /** 数学二 */
  MathTwo = 'math_two',
}

export enum Exercise_Types_Enum {
  /** 每日导练 */
  DailyExercise = 'daily_exercise',
  /** 诊断练习 */
  DiagnosticExercise = 'diagnostic_exercise',
  /** 真题练习 */
  PaperExercise = 'paper_exercise',
  /** 题库练习 */
  QuestionsExercise = 'questions_exercise',
  /** 模考练习 */
  SimulationExercise = 'simulation_exercise',
  /** 单题练习 */
  SingleExercise = 'single_exercise',
}

export enum Gender_Types_Enum {
  /** 女 */
  Female = 'female',
  /** 男 */
  Male = 'male',
  /** 未知 */
  Unknown = 'unknown',
}

export enum Question_Types_Enum {
  /** 选择题 */
  ChoiceQuestion = 'choice_question',
  /** 填空题 */
  GapFillingQuestion = 'gap_filling_question',
  /** 解答题 */
  Question = 'question',
}

export enum Question_Status_Enum {
  /** 已发布 */
  Active = 'active',
  /** 已下架 */
  Inactive = 'inactive',
  /** 待发布 */
  Ready = 'ready',
}

export enum Upload_Status_Enum {
  // 清楚缓存
  Clear = 'clear',
  // 等待上传
  Waiting = 'waiting',
  /** 正在上传 */
  Uploading = 'uploading',
  /** 已下架 */
  Finished = 'finished',
}

export enum Feedback_Types_Enum {
  /** 解析 */
  Analysis = 'analysis',
  /** 选项 */
  Answers = 'answers',
  /** 操作按钮 */
  Button = 'button',
  /** 题目 */
  Content = 'content',
  /** 其他 */
  Other = 'other',
  /** 提示 */
  Prompt = 'prompt',
}

export enum Test_Types_Enum {
  /** 诊断卷 */
  DiagnosticTest = 'diagnostic_test',
  /** 真题卷 */
  PaperTest = 'paper_test',
  /** 模拟卷 */
  SimulationTest = 'simulation_test',
}

export enum Test_Status_Enum {
  /** 已发布 */
  Active = 'active',
  /** 已下架 */
  Inactive = 'inactive',
  /** 待发布 */
  Ready = 'ready',
}

export enum EnvModeType {
  DEV = 'dev',
  CI = 'ci',
  TEST = 'testing',
  STAGE = 'staging',
  PUBLICATION = 'publication',
}

export enum Question_Wrong_Types_Enum {
  /** 已遗忘该知识 */
  Forgotten = 'forgotten',
  /** 缺乏解题思路 */
  Incomprehension = 'incomprehension',
  /** 计算错误 */
  Miscalculation = 'miscalculation',
  /** 看错或手误 */
  Misread = 'misread',
  /** 其他 */
  Other = 'other',
  /** 考虑不全面 */
  Thoughtless = 'thoughtless',
  /** 还未学习该知识 */
  Unlearned = 'unlearned',
}

export enum Self_Evaluation_Rating_Enum {
  /** 只做对一点点 */
  ABitRight = 'a_bit_right',
  /** 错了一点点 */
  ABitWrong = 'a_bit_wrong',
  /** 满分 */
  AllRight = 'all_right',
  /** 全错 */
  AllWrong = 'all_wrong',
  /** 接近全对 */
  AlmostAllRight = 'almost_all_right',
  /** 接近半对 */
  AlmostHalfRight = 'almost_half_right',
  /** 对了一半 */
  HalfRight = 'half_right',
}

export enum Test_Finished_Status_Enum {
  /** 还未开始 */
  NotStarted = 'not_started',
  /** 已经提交 */
  Submit = 'submit',
  /** 进行中 */
  Underway = 'underway',
  /** 已经完成自评打分 */
  Finished = 'finished',
}

export enum MessageType {
  HELLO = 'hello',
}

export enum Favorite_Question_types_Enum {
  /** 加入 */
  Add = 'add',
  /** 移除 */
  Remove = 'remove',
}

export enum Orders_Enum {
  /** 降序 */
  DESC = 'DESC',
  /** 升序 */
  ASC = 'ASC',
}
