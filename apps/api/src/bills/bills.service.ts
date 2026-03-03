import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Bill } from './entities/bill.entity';
import { ILike, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billsRepo: Repository<Bill>,
  ) {}

  async create(userId: number, createBillDto: CreateBillDto) {
    const bill = this.billsRepo.create({
      ...createBillDto,
      userId,
    });

    return this.billsRepo.save(bill);
  }

  findAll() {
    return this.billsRepo.find();
  }

  async getBillsFromUser(
    userId: number,
    month?: number,
    year?: number,
    title?: string,
  ) {
    const today = new Date();
    const targetYear = year ? Number(year) : today.getFullYear();
    const targetMonth = month ? Number(month) - 1 : today.getMonth();
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);

    const query = this.billsRepo
      .createQueryBuilder('bill')
      .where('bill.userId = :userId', { userId });

    query.andWhere(
      `(
            (bill.billType = 'normal' AND bill.billDate >= :startOfMonth AND bill.billDate <= :endOfMonth)
            OR
            (bill.billType = 'installment' AND bill.billDate <= :endOfMonth AND bill.finalDate >= :startOfMonth)
            OR
            (bill.billType = 'recurrent')
        )`,
      {
        startOfMonth,
        endOfMonth,
      },
    );

    if (title) {
      query.andWhere('bill.title ILike :title', { title: `%${title}%` });
    }

    return await query.orderBy('bill.title', 'ASC').getMany();
  }

  async update(id: number, userId: number, updateBillDto: UpdateBillDto) {
    const bill = await this.billsRepo.findOne({ where: { id, userId } });

    if (!bill) {
      throw new NotFoundException('Bill not found or access denied');
    }

    Object.assign(bill, updateBillDto);
    return this.billsRepo.save(bill);
  }

  async remove(id: number, userId: number) {
    const bill = await this.billsRepo.findOne({ where: { id, userId } });

    if (!bill) {
      throw new NotFoundException('Bill not found or access denied');
    }

    return this.billsRepo.remove(bill);
  }
}
