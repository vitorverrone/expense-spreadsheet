import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@test.com',
  password: 'password',
  name: 'Test User',
};

const mockUsersRepo = {
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar usuário com senha hasheada', async () => {
      mockUsersRepo.findOneBy.mockResolvedValue(null);
      mockUsersRepo.create.mockReturnValue(mockUser);
      mockUsersRepo.save.mockResolvedValue(mockUser);

      const result = await service.create({
        username: 'testuser',
        email: 'test@test.com',
        password: '123456',
        name: 'Test User',
        salary: 0,
        salarySubtraction: false,
      });

      expect(result).toEqual(mockUser);
      expect(mockUsersRepo.save).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se username já existe', async () => {
      mockUsersRepo.findOneBy.mockResolvedValueOnce(mockUser);

      await expect(service.create({
        username: 'testuser',
        email: 'new@test.com',
        password: '123456',
        name: 'Test',
        salary: 0,
        salarySubtraction: false,
      })).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se email já existe', async () => {
      mockUsersRepo.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUser);

      await expect(service.create({
        username: 'newuser',
        email: 'test@test.com',
        password: '123456',
        name: 'Test',
        salary: 0,
        salarySubtraction: false,
      })).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('deve retornar token para credenciais válidas', async () => {
      const hashedPassword = await bcrypt.hash('123456', 10);
      mockUsersRepo.findOne.mockResolvedValue({ ...mockUser, password: hashedPassword });

      const result = await service.login({ username: 'testuser', password: '123456' });

      expect(result.token).toBe('mock-token');
    });

    it('deve lançar UnauthorizedException para usuário inexistente', async () => {
      mockUsersRepo.findOne.mockResolvedValue(null);

      await expect(service.login({ username: 'nouser', password: '123456' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException para senha errada', async () => {
      const hashedPassword = await bcrypt.hash('outrasenha', 10);
      mockUsersRepo.findOne.mockResolvedValue({ ...mockUser, password: hashedPassword });

      await expect(service.login({ username: 'testuser', password: '123456' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('update', () => {
    it('deve atualizar dados do usuário', async () => {
      mockUsersRepo.findOneBy.mockResolvedValue(mockUser);
      mockUsersRepo.update.mockResolvedValue({ affected: 1 });

      await service.update(1, { name: 'Novo Nome' });

      expect(mockUsersRepo.update).toHaveBeenCalledWith(1, { name: 'Novo Nome' });
    });

    it('deve hashear a senha ao atualizar', async () => {
      mockUsersRepo.findOneBy.mockResolvedValue(mockUser);
      mockUsersRepo.update.mockResolvedValue({ affected: 1 });

      await service.update(1, { password: 'novasenha' });

      const callArg = mockUsersRepo.update.mock.calls[0][1];
      expect(callArg.password).not.toBe('novasenha');
      expect(callArg.password).toMatch(/^\$2b\$/); // bcrypt hash
    });

    it('deve lançar NotFoundException se usuário não existe', async () => {
      mockUsersRepo.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, { name: 'X' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover usuário existente', async () => {
      mockUsersRepo.findOneBy.mockResolvedValue(mockUser);
      mockUsersRepo.remove.mockResolvedValue(mockUser);

      const result = await service.remove(1);
      expect(result).toEqual(mockUser);
    });

    it('deve lançar NotFoundException se usuário não existe', async () => {
      mockUsersRepo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
