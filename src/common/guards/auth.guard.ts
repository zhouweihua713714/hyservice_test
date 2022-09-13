import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ALLOW_ANON } from '../decorators/allowAnon.decorator';
import { SignInResInfo } from '@/modules/auth/auth.types';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AuthService)
    private readonly authService: AuthService
  ) {
    super();
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // 函数, 类 是否允许 无 token 访问
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    const req = ctx.switchToHttp().getRequest();
    const token: string = req.get('Authorization');
    // 允许接口不校验但是有带头部仍然进行解析用户数据
    if (token && req.url.indexOf('/file/callback') === -1) {
      const verifyToken = token.startsWith('Bearer ')
        ? token.replace('Bearer ', '')
        : token.replace('bearer ', '');
      const SignInResInfo: SignInResInfo | null = this.authService.verifyToken(verifyToken);
      return this.activate(ctx);
    }
    if (allowAnon) return true;
    // const req = ctx.switchToHttp().getRequest();
    // const token: string = req.get('Authorization');
    if (!token) throw new ForbiddenException('请先登录');
    // 兼容老token
    const verifyToken = token.startsWith('Bearer ')
      ? token.replace('Bearer ', '')
      : token.replace('bearer ', '');
    const SignInResInfo: SignInResInfo | null = this.authService.verifyToken(verifyToken);
    if (!SignInResInfo) throw new UnauthorizedException('当前登录已过期, 请重新登录');
    return this.activate(ctx);
  }

  async activate(ctx: ExecutionContext): Promise<boolean> {
    return super.canActivate(ctx) as Promise<boolean>;
  }
}
