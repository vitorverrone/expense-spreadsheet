import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepo: Repository<User>,
		private readonly jwtService: JwtService
	) { }

	async create(createUserDto: CreateUserDto) {
		const existingUser = await this.usersRepo.findOneBy({
			username: createUserDto.username,
		});

		if (existingUser) {
			throw new BadRequestException('Username already exists');
		}

		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

		const user = this.usersRepo.create({
			...createUserDto,
			password: hashedPassword,
		});

		return this.usersRepo.save(user);
	}


	async login(loginUserDto: LoginUserDto) {
		const user = await this.usersRepo.findOne({
			where: { username: loginUserDto.username },
			select: ['id', 'username', 'password'] // Forçamos a senha apenas aqui
		});

		if (!user) {
			throw new UnauthorizedException('Invalid username or password');
		}

		const isPasswordValid = await bcrypt.compare(
			loginUserDto.password,
			user.password,
		);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid username or password');
		}

		const token = this.jwtService.sign({ sub: user.id, username: user.username});

		return token;
	}

	findAll() {
		return this.usersRepo.find();
	}

	findOne(id: number) {
		return this.usersRepo.findOneBy({ id });
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		const user = await this.findOne(id);
		
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const { password, ...updateData } = updateUserDto;

		await this.usersRepo.update(id, updateData);

		return this.findOne(id);
	}

	async remove(id: number) {
		const user = await this.usersRepo.findOneBy({ id });

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return this.usersRepo.remove(user);
	}
}
