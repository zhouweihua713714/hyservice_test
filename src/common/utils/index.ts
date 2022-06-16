import { RedisKeyPrefix } from '../enums/redisKeyPrefix.enum';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * 获取 模块前缀与唯一标识 整合后的 redis key
 * @param moduleKeyPrefix 模块前缀
 * @param id id 或 唯一标识
 */
export function getRedisKey(moduleKeyPrefix: RedisKeyPrefix, id: string | number): string {
  return `${moduleKeyPrefix}${id}`;
}

/**
 * 密文转hash
 * @param {String} str 需要加密的内容
 * @returns {String} 密文
 */
export function bhash(str: string): string {
  return bcrypt.hashSync(str, 10);
}

/**
 * hash是否正确
 * @param {String} str 需要匹配的内容
 * @param {String} hash hash值
 * @returns {Boolean} 是否匹配
 */
export function bcompare(str: string, hash: string): boolean {
  return bcrypt.compareSync(str, hash);
}

/**
 * @description 对称性加密
 * @param {String} src 原始数据
 * @param {String} secretKey 密码16位
 * @param {String} iv 偏移量
 * @returns {String} sign 加密数据
 */
export function encode(src: string, secretKey: string, iv: string): string {
  let sign = '';
  const cipher = crypto.createCipheriv('aes-128-cbc', secretKey, iv); // createCipher在10.0.0已被废弃
  sign += cipher.update(src, 'utf8', 'hex');
  sign += cipher.final('hex');
  return sign;
}

/**
 * @description 对称性解密
 * @param {String} sign 加密数据
 * @param {String} secretKey 密码16位
 * @param {String} iv 偏移量
 * @returns {String} src 原始数据
 */
export function decode(sign: string, secretKey: string, iv: string): string {
  let src = '';
  const cipher = crypto.createDecipheriv('aes-128-cbc', secretKey, iv);
  src += cipher.update(sign, 'hex', 'utf8');
  src += cipher.final('utf8');
  return src;
}
