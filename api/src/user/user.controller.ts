import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { QueryPaginationResult, paginate } from 'src/utils/paginate';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getUser(@Param('id') id: number) {
    return this.userService.findUserById(id, {
      relations: ['company', 'healthScore'],
    });
  }

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async findAllCustomers(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
    @Query('filter') filter?: string,
    @Query('company') company?: number,
    @Query('sector') sector?: number,
  ): Promise<QueryPaginationResult> {
    const pagination = paginate({ page, count });
    const [data, dataCount] = await this.userService.findAllCustomers(
      pagination,
      filter,
      company,
      sector,
    );
    return {
      data,
      count: dataCount,
      totalPages: Math.ceil(dataCount / count),
      currentPage: page,
    };
  }

  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  deleteUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
