import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SessionPayload } from './types/session-payload';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private jwtService: JwtService,
  ) {}

  async createSession(createSessionDto: SessionPayload, user: User) {
    try {
      const payload: SessionPayload = {
        sub: createSessionDto.sub,
        firstName: createSessionDto.firstName,
        lastName: createSessionDto.lastName,
        email: createSessionDto.email,
      };
      const jwtToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });
      await this.sessionRepository.save(
        this.sessionRepository.create({
          token: jwtToken,
          user: user,
        }),
      );
      return jwtToken;
    } catch {
      // Erro para caso alguma coisa do processo dê errado
      console.log('Algo deu errado');
      throw new Error();
    }
  }

  async isTokenValid(token: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: {
          token: token,
        },
      });
      // Checa se o token está registrado na table
      if (session) {
        // Verifica se o jwt está expirado
        const payload: SessionPayload = await this.jwtService.verifyAsync(
          token,
          {
            secret: process.env.JWT_SECRET,
          },
        );
        if (payload.iat && payload.exp && payload.iat > payload.exp) {
          this.deleteSessionByToken(token);
          throw new UnauthorizedException();
        }
        return { valid: true, user: payload };
      }
      console.log('Sessão não encontrada!');
      return { valid: false, user: null };
    } catch (error) {
      console.log(error);
      return { valid: false, user: null };
    }
  }

  async deleteSessionByToken(token: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: {
          token: token,
        },
      });
      if (session) {
        return await this.sessionRepository.delete(session.id);
      }
      console.log('Sessão não encontrada');
      throw new NotFoundException();
    } catch {
      throw new BadRequestException();
    }
  }

  async findSessionByToken(token: string) {
    const session = await this.sessionRepository.findOne({
      where: {
        token: token,
      },
    });

    if (!session) {
      console.log('Sessão não encontrada');
      throw new NotFoundException();
    }

    return session;
  }
}
