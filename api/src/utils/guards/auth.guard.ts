import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from 'src/session/session.service';
import { extractTokenFromHeader } from '../extractToken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (token) {
      const { valid, user } = await this.sessionService.isTokenValid(token);
      if (valid) {
        request['token'] = token;
        request['user'] = user;
        return true;
      }
      throw new UnauthorizedException();
    }
    throw new UnauthorizedException();
  }
}
