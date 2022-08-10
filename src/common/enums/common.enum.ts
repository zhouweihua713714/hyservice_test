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
  /**项目 */
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

