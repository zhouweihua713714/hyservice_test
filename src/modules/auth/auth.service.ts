import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User_Status_Enum} from '@/common/enums/common.enum';
import { JwtUser, signInResInfo, signUpResInfo } from '@/modules/auth/auth.types';
import { ResultData } from '@/common/utils/result';
import { bcompare } from '@/common/utils';
import { Logins } from '@/entities/Logins.entity';
import { Users } from '@/entities/Users.entity';
import { Connection, getConnection } from 'typeorm';
import { GenCodeDto, ModifyPasswordDto, ResetPasswordDto, signInDto, signUpDto } from './auth.dto';
import { ErrorCode } from '@/common/utils/errorCode';
import { Codes } from '@/entities/Codes.entity';
import { constant } from '@/common/utils/constant';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { EnvModeType } from '@/common/enums/common.enum';
import { sendSMS } from '@/common/utils/sendSms';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly connection: Connection
  ) {}

  /**
   * @description 登录, 返回用户和token信息
   * @param {signInDto} params 登录信息
   * @returns {ResultData} 返回用户聚合信息
   */
  async signIn(params: signInDto): Promise<ResultData> {
    const { mobile, password, provider } = params;
    // 聚合查询相关信息
    const signInResInfo: signInResInfo | undefined = await this.connection
      .createQueryBuilder(Users, 'users')
      .select('users.id', 'id')
      .addSelect('users.mobile', 'mobile')
      .addSelect('users.name', 'name')
      .addSelect('users.status', 'status')
      .addSelect('logins.token', 'token')
      .innerJoin(Logins, 'logins', 'users.mobile=logins.mobile')
      .where('logins.mobile = :mobile', { mobile })
      .andWhere('logins.provider = :provider', { provider: provider || 'local' })
      .getRawOne();

    // 用户不存在
    if (!signInResInfo) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_FOUND_ERROR });
    }
    // 用户未激活
    if (signInResInfo.status === User_Status_Enum.Disabled) {
      return ResultData.fail({ ...ErrorCode.AUTH.ACCOUNT_FORBIDDEN_ERROR });
    }
    // 密码错误
    if (!bcompare(password, signInResInfo.token)) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_FOUND_ERROR });
      // return ResultData.fail({ ...ErrorCode.AUTH.PASSWORD_ERROR });
    }
    // 暂时还保留之前的token构造形式
    const payload: JwtUser = {
      id: signInResInfo.id,
      mobile: signInResInfo.mobile,
      name: signInResInfo.name,
      status: signInResInfo.status,
    };
    signInResInfo.token = this.createToken(payload);
    return ResultData.ok({ data: signInResInfo });
  }

  /**
   * 生成 token
   * @param {Object} payload
   * @returns {String} token
   */
  createToken(payload: object): string {
    return this.jwtService.sign(payload);
  }

  /**
   * @description 校验token
   * @param {String} token
   * @returns {signInResInfo | null} signInResInfo
   */
  verifyToken(token: string): signInResInfo | null {
    try {
      if (!token) return null;
      const signInResInfo = this.jwtService.verify(token);
      return signInResInfo;
    } catch (error) {
      return null;
    }
  }

  /**
   * @description 注册, 返回用户和token信息
   * @param {signUpDto} params 注册信息
   * @returns {ResultData} 返回用户聚合信息
   */
  async signUp(params: signUpDto): Promise<ResultData> {
    const { mobile, password, code } = params;
    const codeRegex = /^([0-9]{6})$/;
    if (!codeRegex.test(code)) {
      return ResultData.fail({ ...ErrorCode.AUTH.ILLEGAL_CODE });
    }
    // check code
    const codeInfo = await this.connection
      .createQueryBuilder(Codes, 'codes')
      .where('codes.mobile =:mobile', { mobile })
      .getOne();
    if (!codeInfo) {
      return ResultData.fail({ ...ErrorCode.AUTH.CODE_NOT_FOUND });
    }
    // if code expired (5mins), then throw error
    if (Date.now() - codeInfo.sentAt.getTime() > constant.FIELD_LIMIT.GEN_CODE_VALID_TIME) {
      return ResultData.fail({ ...ErrorCode.AUTH.CODE_EXPIRED });
    }
    // if code mismatch, then throw error
    if (codeInfo.code !== code) {
      return ResultData.fail({ ...ErrorCode.AUTH.CODE_MISMATCH });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // check user
    const userInfo = await this.connection
      .createQueryBuilder(Users, 'users')
      .where('users.mobile =:mobile', { mobile })
      .getOne();
    // if user exist, then throw error
    if (userInfo) {
      return ResultData.fail({ ...ErrorCode.AUTH.MOBILE_ALREADY_REGISTERED });
    }
    // insert user
    const affectRows = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values({
        mobile: mobile,
      })
      .execute();
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Logins)
      .values({
        mobile: mobile,
        provider: 'local',
        token: hashedPassword,
      })
      .execute();

    // return result
    const signUpResInfo: signUpResInfo | undefined = {
      id: affectRows.identifiers[0].id,
      mobile: mobile,
      name: null,
      status: User_Status_Enum.Enabled,
      token: '',
    };
    // get token
    const payload: JwtUser = {
      id: affectRows.identifiers[0].id,
      mobile: mobile,
      name: null,
      status: User_Status_Enum.Enabled,
    };
    signUpResInfo.token = this.createToken(payload);
    return ResultData.ok({ data: signUpResInfo });
  }

  /**
   * @description 修改密码, 返回{}信息
   * @param {ModifyPasswordDto} params 账号密码
   * @returns {ResultData} 返回数据信息
   */
  async modifyPassword(params: ModifyPasswordDto): Promise<ResultData> {
    const { mobile, oldPassword, newPassword } = params;
    // hash newPassword
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // check user login
    const loginInfo = await this.connection
      .createQueryBuilder(Logins, 'logins')
      .where('logins.mobile = :mobile and logins.provider = :provider', {
        mobile,
        provider: 'local',
      })
      .getOne();
    // if user login is not exist, then throw error
    if (!loginInfo) {
      return ResultData.fail({ ...ErrorCode.AUTH.UNAUTHENTICATED_ERROR });
    }
    // if they both with identical passwords, then throw error
    if (oldPassword === newPassword) {
      return ResultData.fail({ ...ErrorCode.AUTH.PASSWORD_SAME_ERROR });
    }
    // if oldPassword incorrect, then throw error
    if (!bcrypt.compareSync(oldPassword, loginInfo.token)) {
      return ResultData.fail({ ...ErrorCode.AUTH.PASSWORD_ERROR });
    }
    // update logins
    const affectRows = await getConnection()
      .createQueryBuilder()
      .update(Logins)
      .set({
        token: hashedPassword,
      })
      .where('mobile = :mobile and provider = :provider', { mobile, provider: 'local' })
      .execute();

    if (!affectRows.affected) {
      return ResultData.fail({ ...ErrorCode.AUTH.MODIFY_PASSWORD_ERROR });
    }
    // return result
    return ResultData.ok({ data: {} });
  }

  /**
   * @description 重置密码, 返回{}信息
   * @param {ModifyPasswordDto} params 账号密码
   * @returns {ResultData} 返回数据信息
   */
  async resetPassword(params: ResetPasswordDto): Promise<ResultData> {
    const { mobile, password, code } = params;
    // hash newPassword
    const hashedPassword = await bcrypt.hash(password, 10);
    // check user login
    const loginInfo = await this.connection
      .createQueryBuilder(Logins, 'logins')
      .where('logins.mobile = :mobile and logins.provider = :provider', {
        mobile,
        provider: 'local',
      })
      .getOne();
    // if user login is not exist, then throw error
    if (!loginInfo) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_signUp_ERROR });
    }
    // check code
    const codeInfo = await this.connection
      .createQueryBuilder(Codes, 'codes')
      .where('codes.mobile =:mobile', { mobile })
      .getOne();
    if (!codeInfo) {
      return ResultData.fail({ ...ErrorCode.AUTH.CODE_NOT_FOUND });
    }
    // if code expired (5mins), then throw error
    if (Date.now() - codeInfo.sentAt.getTime() > constant.FIELD_LIMIT.GEN_CODE_VALID_TIME) {
      return ResultData.fail({ ...ErrorCode.AUTH.CODE_EXPIRED });
    }
    // if code mismatch, then throw error
    if (codeInfo.code !== code) {
      return ResultData.fail({ ...ErrorCode.AUTH.CODE_MISMATCH });
    }
    // update logins
    const affectRows = await getConnection()
      .createQueryBuilder()
      .update(Logins)
      .set({
        token: hashedPassword,
      })
      .where('mobile = :mobile and provider = :provider', { mobile, provider: 'local' })
      .execute();

    if (!affectRows.affected) {
      return ResultData.fail({ ...ErrorCode.AUTH.RESET_PASSWORD_ERROR });
    }
    // return result
    return ResultData.ok({ data: {} });
  }
  /**
   * @description 发送验证码, 返回{}信息
   * @param {GenCodeDto} params 手机号
   * @returns {ResultData} 返回数据信息
   */
  async genCode(params: GenCodeDto): Promise<ResultData> {
    const { mobile } = params;
    // gen code
    const code = genCodeOfLength(6);

    if (
      this.config.get<string>('app.envMode') === EnvModeType.PUBLICATION ||
      this.config.get<string>('app.envMode') === EnvModeType.STAGE
    ) {
      // TODO: use redis counter to limit the frequency of sending SMS messages.
      const result = await sendSMS(mobile, code, 'verification', this.config);
      if (result?.Code !== 'OK') {
        // log record 具体错误
        console.error('SMS ERROR: ', result);
        switch (result?.Code) {
          case 'isv.MOBILE_NUMBER_ILLEGAL':
            return ResultData.fail({ ...ErrorCode.SYSTEM.SMS_MOBILE_NUMBER_ILLEGAL_ERROR });
          case 'isv.BUSINESS_LIMIT_CONTROL':
            return ResultData.fail({ ...ErrorCode.SYSTEM.SMS_BUSINESS_LIMIT_CONTROL_ERROR });
          default:
            return ResultData.fail({ ...ErrorCode.SYSTEM.SMS_INNER_ERROR });
        }
      }
    }
    // delete code
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Codes)
      .where('mobile = :mobile', { mobile: mobile })
      .execute();
    // insert code
    const affectRows = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Codes)
      .values({
        mobile: mobile,
        code: code,
        sentAt: new Date(),
      })
      .execute();
    if (
      this.config.get<string>('app.envMode') === EnvModeType.PUBLICATION ||
      this.config.get<string>('app.envMode') === EnvModeType.STAGE
    ) {
      return ResultData.ok({ data: { mobile, sendAt: new Date() } });
    }
    // return result
    return ResultData.ok({ data: { mobile, sendAt: new Date(), code: code } });
  }
}
