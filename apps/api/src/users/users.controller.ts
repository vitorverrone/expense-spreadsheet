import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
    return { message: 'Create user successfully' };
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { token } = await this.usersService.login(loginUserDto);
    return { message: 'Logged in successfully', token: token };
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  getMe(@CurrentUser() user: any) {
    return this.usersService.findOne(user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('/me')
  async update(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(user.sub, updateUserDto);
    return { message: 'Updated successfully' };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
