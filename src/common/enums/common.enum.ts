export enum User_Status_Enum {
  /** 停用 */
  Disabled = 'disabled',
  /** 启用 */
  Enabled = 'enabled',
}

export enum User_Type_Enum {
  /** 用户 */
  User = 'user',
  /** 管理员 */
  Admin= 'admin',
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
