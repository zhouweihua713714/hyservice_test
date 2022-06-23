import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User_Status_Enum } from '@/common/enums/common.enum';
import { JwtUser, signInResInfo, signUpResInfo } from '@/modules/auth/auth.types';
import { ResultData } from '@/common/utils/result';
import { bcompare } from '@/common/utils';
import { GenCodeDto, ModifyPasswordDto, ResetPasswordDto, signInDto, signUpDto } from './auth.dto';
import { ErrorCode } from '@/common/utils/errorCode';
import { constant } from '@/common/utils/constant';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { genCodeOfLength } from '@/common/utils/genCodeOfLength';
import { EnvModeType } from '@/common/enums/common.enum';
import { sendSMS } from '@/common/utils/sendSms';
import { UsersRepo } from '@/entities/Users.repo';
import { LoginsRepo } from '@/entities/Logins.repo';
import { CodesRepo } from '@/entities/Codes.repo';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly usersRepo: UsersRepo,
    private readonly loginsRepo: LoginsRepo,
    private readonly codesRepo: CodesRepo
  ) {}

  /**
   * @description 登录, 返回用户和token信息
   * @param {signInDto} params 登录信息
   * @returns {ResultData} 返回用户聚合信息
   */
  async signIn(params: signInDto): Promise<ResultData> {
    const { mobile, password, provider } = params;
    const userInfo = await this.usersRepo.findOne({ mobile });
    const loginInfo = await this.loginsRepo.findOne({
      mobile: mobile,
      provider: 'local',
    });
    // 用户不存在
    if (!loginInfo || !userInfo) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_FOUND_ERROR });
    }
    // 用户未激活
    if (userInfo.status === User_Status_Enum.Disabled) {
      return ResultData.fail({ ...ErrorCode.AUTH.ACCOUNT_FORBIDDEN_ERROR });
    }
    // 密码错误
    if (!bcompare(password, loginInfo.token)) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_FOUND_ERROR });
      // return ResultData.fail({ ...ErrorCode.AUTH.PASSWORD_ERROR });
    }
    const signInResInfo: signInResInfo | undefined = {
      id: userInfo.id,
      name: userInfo.name,
      mobile: userInfo.mobile,
      status: User_Status_Enum.Enabled,
      token: loginInfo.token,
    };
    // 暂时还保留之前的token构造形式
    const payload: JwtUser = {
      id: userInfo.id,
      name: userInfo.name,
      mobile: userInfo.mobile,
      status: User_Status_Enum.Enabled,
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
    const codeInfo = await this.codesRepo.findOne(mobile);
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
    const userInfo = await this.usersRepo.findOne({ mobile });
    // if user exist, then throw error
    if (userInfo) {
      return ResultData.fail({ ...ErrorCode.AUTH.MOBILE_ALREADY_REGISTERED });
    }
    // insert user
    const user = await this.usersRepo.save({ mobile });
    await this.loginsRepo.save({ mobile: mobile, provider: 'local', token: hashedPassword });
    // return result
    const signUpResInfo: signUpResInfo | undefined = {
      id: user.id,
      mobile: mobile,
      name: null,
      status: User_Status_Enum.Enabled,
      token: '',
    };
    // get token
    const payload: JwtUser = {
      id: user.id,
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
    const loginInfo = await this.loginsRepo.findOne({ mobile, provider: 'local' });
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
    const affectRows = await this.loginsRepo.update(
      { mobile, provider: 'local' },
      { token: hashedPassword }
    );
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
    const loginInfo = await this.loginsRepo.findOne({ mobile, provider: 'local' });
    // if user login is not exist, then throw error
    if (!loginInfo) {
      return ResultData.fail({ ...ErrorCode.AUTH.USER_NOT_SIGN_UP_ERROR });
    }
    // check code
    const codeInfo = await this.codesRepo.findOne(mobile);
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
    const affectRows = await this.loginsRepo.update(
      { mobile, provider: 'local' },
      { token: hashedPassword }
    );
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
    await this.codesRepo.delete(mobile);
    // insert code
    await this.codesRepo.save({
      mobile: mobile,
      code: code,
      sentAt: new Date(),
    });
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
