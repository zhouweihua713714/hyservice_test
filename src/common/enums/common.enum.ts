export enum User_Status_Enum {
  /** 停用 */
  Disabled = 'disabled',
  /** 启用 */
  Enabled = 'enabled',
}

export enum User_Types_Enum {
  /** 用户 */
  User = 'user',
  /** 管理员 */
  Admin = 'admin',
  /** 超级管理员 */
  Administrator = 'administrator',
}

export enum Gender_Types_Enum {
  /** 女 */
  Female = 'female',
  /** 男 */
  Male = 'male',
  /** 未知 */
  Unknown = 'unknown',
}

export enum EnvModeType {
  DEV = 'dev',
  CI = 'ci',
  TEST = 'testing',
  STAGE = 'staging',
  PUBLICATION = 'publication',
}

export enum MessageType {
  HELLO = 'hello',
}

export enum Orders_Enum {
  /** 降序 */
  DESC = 'DESC',
  /** 升序 */
  ASC = 'ASC',
}

export enum Content_Types_Enum {
  /** 会议 */
  CONFERENCE = 'conference',
  /** 机构 */
  INSTITUTION = 'institution',
  /** 专利 */
  PATENT = 'patent',
  /** 政策 */
  POLICY = 'policy',
  /**项目 */
  TERM = 'term',
  /**论文 */
  TREATISE = 'treatise',
  /**期刊 */
  PERIODICAL = 'periodical',
}

export enum Content_Status_Enum {
  /** 待发布 */
  READY = 'ready',
  /** 已发布 */
  ACTIVE = 'active',
}
export enum Peking_Unit_Enum {
  /**  核心期刊 */
  JOURNALS_001 = 'journals_001',
  /** 1级权威 */
  JOURNALS_002 = 'journals_002',
  /** 2级权威 */
  JOURNALS_003 = 'journals_003',
}

export enum Education_Level_Enum {
  /**  基础教育 */
  BASIC = 'basic',
  /** 高等教育 */
  HIGHER = 'higher',
  /** 职业教育*/
  VOCATION = 'vocation',
}

export enum Channels_Enum {
  /**  期刊 */
  WAY_001 = 'way_001',
  /** 会议 */
  WAY_002 = 'way_002',
  /** EDM会议*/
  WAY_003 = 'way_003',
  /** 书*/
  WAY_004 = 'way_004',
}

export enum Labels_Enum {
  /** 强烈推荐 */
  Label_001 = 'label_001',
  /** 写得好 */
  Label_002 = 'label_002',
  /** 有深度 */
  Label_003 = 'label_003',
  /** 很实用 */
  Label_004 = 'label_004',
}

export enum Operate_types_Enum {
  /** 加入 */
  Add = 'add',
  /** 移除 */
  Remove = 'remove',
}

export enum Picker_Enum {
  /** 年 */
  Year = 'year',
  /** 月 */
  Month = 'month',
  /** 日 */
  Date = 'date',
}

export enum NSFDirectorate_Enum {
  NSFDirectorate_EHR = 'NSFDirectorate_EHR',
  NSFDirectorate_SBE = 'NSFDirectorate_SBE',
  NSFDirectorate_CSE = 'NSFDirectorate_CSE',
}
