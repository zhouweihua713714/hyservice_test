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
import { signInResInfo } from '@/modules/auth/auth.types';
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
    if (allowAnon) return true;
    const req = ctx.switchToHttp().getRequest();
    const token: string = req.get('Authorization');
    if (!token) throw new ForbiddenException('请先登录');
    // 兼容老token
    const verifyToken = token.startsWith('Bearer ')
      ? token.replace('Bearer ', '')
      : token.replace('bearer ', '');
    const signInResInfo: signInResInfo | null = this.authService.verifyToken(verifyToken);
    if (!signInResInfo) throw new UnauthorizedException('当前登录已过期, 请重新登录');
    return this.activate(ctx);
  }

  async activate(ctx: ExecutionContext): Promise<boolean> {
    return super.canActivate(ctx) as Promise<boolean>;
  }
}
