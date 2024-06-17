import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { SessionModule } from 'src/session/session.module';

@Module({
  exports: [UserService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), SessionModule],
  providers: [UserService],
})
export class UserModule {}
