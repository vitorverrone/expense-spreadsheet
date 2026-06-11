import { Test, TestingModule } from '@nestjs/testing';
import { BillsService } from './bills.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { NotFoundException } from '@nestjs/common';

const mockBill = {
  id: 1,
  title: 'Conta de Luz',
  value: 200,
  billType: 'normal',
  userId: 1,
  billDate: new Date('2026-01-10'),
  finalDate: new Date('2026-01-10'),
  installments: 0,
};

const mockQueryBuilder: any = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([mockBill]),
};

const mockBillsRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

describe('BillsService', () => {
  let service: BillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillsService,
        { provide: getRepositoryToken(Bill), useValue: mockBillsRepo },
      ],
    }).compile();

    service = module.get<BillsService>(BillsService);
    jest.clearAllMocks();
    mockBillsRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  describe('create', () => {
    it('deve criar uma bill com userId', async () => {
      mockBillsRepo.create.mockReturnValue(mockBill);
      mockBillsRepo.save.mockResolvedValue(mockBill);

      const result = await service.create(1, {
        title: 'Conta de Luz',
        value: 200,
        billType: 'normal',
        billDate: new Date('2026-01-10'),
        finalDate: new Date('2026-01-10'),
        installments: 0,
      });

      expect(result).toEqual(mockBill);
      expect(mockBillsRepo.create).toHaveBeenCalledWith(expect.objectContaining({ userId: 1 }));
    });
  });

  describe('getBillsFromUser', () => {
    it('deve retornar bills do usuário filtradas por mês', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockBill]);

      const result = await service.getBillsFromUser(1, 1, 2026);

      expect(result).toEqual([mockBill]);
      expect(mockBillsRepo.createQueryBuilder).toHaveBeenCalledWith('bill');
    });

    it('deve filtrar por título quando fornecido', async () => {
      await service.getBillsFromUser(1, 1, 2026, 'Luz');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('ILike'),
        expect.objectContaining({ title: '%Luz%' }),
      );
    });

    it('deve retornar lista vazia quando não há bills', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.getBillsFromUser(1, 1, 2026);
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('deve atualizar uma bill existente', async () => {
      mockBillsRepo.findOne.mockResolvedValue(mockBill);
      mockBillsRepo.save.mockResolvedValue({ ...mockBill, title: 'Conta de Água' });

      const result = await service.update(1, 1, { title: 'Conta de Água' });
      expect(result.title).toBe('Conta de Água');
    });

    it('deve lançar NotFoundException para bill inexistente', async () => {
      mockBillsRepo.findOne.mockResolvedValue(null);

      await expect(service.update(999, 1, { title: 'X' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover uma bill existente', async () => {
      mockBillsRepo.findOne.mockResolvedValue(mockBill);
      mockBillsRepo.remove.mockResolvedValue(mockBill);

      const result = await service.remove(1, 1);
      expect(result).toEqual(mockBill);
    });

    it('deve lançar NotFoundException para bill inexistente', async () => {
      mockBillsRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
