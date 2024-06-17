import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { SessionModule } from 'src/session/session.module';
import { CartesiModule } from 'src/cartesi/cartesi.module';

@Module({
  imports: [UserModule, SessionModule, CartesiModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
