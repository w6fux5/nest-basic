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
  Session,
  UseGuards,
  // ClassSerializerInterceptor, // nest 內建攔截器
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

import { AuthGuard } from 'src/guard/auth.guard';

import { CurrentUser } from './decorators/current-user.decorator';

import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { User } from './users.entity';

import { UserDto } from './dtos/user.dto';
// auth/signup
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/register')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.register({
      email: body.email,
      password: body.password,
    });

    session.userID = user.id;
    return user;
  }

  @Post('/login')
  async login(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.login({
      email: body.email,
      password: body.password,
    });
    session.userID = user.id;
    console.log(user.id, ' ====> user login');
    return user;
  }

  @Post('/logout')
  logout(@Session() session: any) {
    session.userID = null;
  }

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userID);
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
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
    return this.usersService.remove(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }
}
