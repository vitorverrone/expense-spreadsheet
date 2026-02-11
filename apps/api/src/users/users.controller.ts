import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        return { message: 'Logged in successfully', user };
    }

    @Post('/logout')
    logout() {
        return { message: 'Logged out successfully' };
    }

    @Post('/login')
    async login(@Body() loginUserDto: LoginUserDto) {
        const token = await this.usersService.login(loginUserDto);
        return { message: 'Logged in successfully', token: token };
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('/me/:id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete('/:id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
