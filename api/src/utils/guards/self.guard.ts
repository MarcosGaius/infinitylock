import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Type,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
import { extractTokenFromHeader } from '../extractToken';
import { JwtService } from '@nestjs/jwt';

export const SelfGuard = (param: string = 'id'): Type<CanActivate> => {
  class SelfGuardMixim implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = extractTokenFromHeader(request);
      if (!token) throw new UnauthorizedException();
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.admin) return true;
      if (payload.sub !== request[param]) {
        console.log(
          `[SelfGuard] Forbidden. User ${payload.sub} tried to access user ${request[param]}`,
        );
        throw new ForbiddenException();
      }

      return true;
    }
  }

  const guard = mixin(SelfGuardMixim);
  return guard;
};
