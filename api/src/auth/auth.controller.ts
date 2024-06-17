import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from '../utils/guards/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SetRequestTimeout } from 'src/utils/decorators/set-timeout';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body() signInDto: SignInAuthDto) {
    return this.authService.signIn(signInDto);
  }

  @SetRequestTimeout(60000)
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logOut(@Request() req) {
    return this.authService.logOut(req.token);
  }

  @Post('changepassword')
  @UseGuards(AuthGuard)
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
    return this.authService.changePassword(changePasswordDto, req.user.sub);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req) {
    /* const { token, user } = await this.authService.refreshToken(req.token);
    return { token, user }; */
    return {
      id: req.user.sub,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      birthdate: req.user.birthdate,
      phone: req.user.phone,
    };
  }
}
