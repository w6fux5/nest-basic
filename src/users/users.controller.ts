import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  NotFoundException,
  // ClassSerializerInterceptor, // nest 內建攔截器
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

import { Serialize } from 'src/interceptors/serialize.interceptor';

import { UserDto } from './dtos/user.dto';
// auth/signup
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const existsUser = await this.usersService.findOne(id);

    if (!existsUser) {
      throw new NotFoundException('user not found');
    }

    return existsUser;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUer(@Param('id') id: string) {
    console.log(id);
    return this.usersService.remove(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }
}
