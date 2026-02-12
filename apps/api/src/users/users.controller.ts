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
        return { message: 'Create user successfully' };
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

    @Patch('/me/:id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.usersService.update(+id, updateUserDto);
        return { message: 'Updated successfully' };
    }

    @Delete('/:id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
