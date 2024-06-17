import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { UserService } from 'src/user/user.service';
import { SessionService } from 'src/session/session.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CartesiService } from 'src/cartesi/cartesi.service';
import { hexToText } from 'src/utils/hex2text';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private cartesiService: CartesiService,
  ) {}

  async signIn(signInDto: SignInAuthDto) {
    const user = await this.userService.findByEmail(signInDto.email);
    if (!user) throw new NotFoundException();

    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isValidPassword) throw new BadRequestException();

    const token = await this.sessionService.createSession(
      {
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      user,
    );
    if (!token) throw new InternalServerErrorException();

    return {
      token: token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const userExists =
      (await this.userService.findByEmail(createUserDto.email)) ??
      (await this.userService.findByWallet(createUserDto.address));
    if (userExists) throw new BadRequestException('Usuário já cadastrado');

    const processRes = await this.cartesiService.detectFace(createUserDto.face);
    const processedFace = JSON.parse(hexToText(processRes.toString()));
    if (!processedFace) throw new BadRequestException('Face não detectada');

    try {
      await this.cartesiService.registerFace(
        processedFace.embedding,
        createUserDto.address,
      );
    } catch (error) {
      console.log(`[AuthService][signUp]: Erro ao registrar a face. ${error}`);
      throw new InternalServerErrorException('Erro ao cadastrar a face');
    }

    const user = await this.userService.create(createUserDto);
    const token = await this.sessionService.createSession(
      {
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      user,
    );
    /* Exemplo de erro: CASO A CRIAÇÃO DO TOKEN DÊ ERRO, O USUÁRIO JÁ FOI CRIADO, ENCONTRAR ALGUM JEITO DE
      SE CASO UM DER ERRO CANCELAR AMBAS TRANSAÇÕES */
    return {
      token: token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  async logOut(token: string) {
    try {
      return await this.sessionService.deleteSessionByToken(token);
    } catch {
      throw new BadRequestException();
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException();
    }
    console.log('[AuthService] ', changePasswordDto, userId);
    const isValidPassword = await bcrypt.compare(
      changePasswordDto.previousPassword,
      user.password,
    );
    if (!isValidPassword) {
      console.log('[AuthService] Senha incorreta!');
      throw new BadRequestException();
    }
    console.log(
      '[AuthService] As senhas condizem, alterando a senha do usuário id',
      userId,
    );

    if (changePasswordDto.previousPassword === changePasswordDto.newPassword) {
      console.log('[AuthService] As senha nova não pode ser igual a antiga');
      throw new BadRequestException();
    }

    user.password = changePasswordDto.newPassword;
    return user.save();
  }

  async refreshToken(token: string) {
    console.log(token);
    const { valid, user: oldUser } =
      await this.sessionService.isTokenValid(token);

    if (!valid) {
      console.log('inválido');
      return;
    }

    const user = await this.userService.findUserById(oldUser.sub);

    if (!user) {
      return;
    }

    const newToken = await this.sessionService.createSession(
      {
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      user,
    );
    return {
      token: newToken,
      user: {
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }
}
