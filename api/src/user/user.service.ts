import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  Brackets,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryPaginationOptions } from 'src/utils/paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(
      this.userRepository.create({
        ...createUserDto,
      }),
    );
  }

  find(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    return this.userRepository.find({
      where,
    });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findByWallet(wallet: string) {
    return await this.userRepository.findOne({
      where: {
        address: wallet,
      },
    });
  }

  async findUserById(id: number, options?: FindOneOptions<User>) {
    return await this.userRepository.findOne({
      ...options,
      where: {
        id: id,
      },
    });
  }

  // Débito técnico: lidar com filtro com acento
  async findAllCustomers(
    pagination: QueryPaginationOptions,
    filter?: string,
    company?: number,
    sector?: number,
  ) {
    const where = (qb: SelectQueryBuilder<User>) => {
      if (filter) {
        qb.andWhere(
          new Brackets((qb) => {
            qb.where('email ILIKE :filter', { filter: `%${filter}%` })
              .orWhere('phone ILIKE :filter', { filter: `%${filter}%` })
              .orWhere('"firstName" ILIKE :filter', {
                filter: `%${filter}%`,
              })
              .orWhere('"lastName" ILIKE :filter', { filter: `%${filter}%` })
              .orWhere('document ILIKE :filter', {
                filter: `%${filter}%`,
              });
          }),
        );
      }
      if (company) {
        qb.andWhere('company.id = :company', { company });
      }

      if (sector) {
        qb.andWhere('sector.id = :sector', { sector });
      }
    };
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.company', 'company')
      .leftJoinAndSelect('user.healthScore', 'healthScore')
      .leftJoinAndSelect('user.sector', 'sector')
      .orderBy('user.firstName', 'ASC')
      .where(where)
      .skip(pagination.skip)
      .take(pagination.take)
      .getManyAndCount();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundException();
    }

    const newUser = this.userRepository.create({
      ...user,
      ...updateUserDto,
    });

    return await this.userRepository.save(newUser);
  }

  async remove(id: number) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return await this.userRepository.delete(id);
  }
}
